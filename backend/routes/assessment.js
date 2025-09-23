const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Assessment = require('../models/Assessment');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest } = require('../utils/validation');
const { body, query } = require('express-validator');

// Validation middleware for assessment submission
const assessmentValidation = {
  submit: [
    body('questionnaires').isObject().withMessage('Questionnaires data is required'),
    body('questionnaires.GAD-7').isObject().withMessage('GAD-7 results are required'),
    body('questionnaires.PHQ-9').isObject().withMessage('PHQ-9 results are required'),
    body('questionnaires.GHQ-12').isObject().withMessage('GHQ-12 results are required'),
    body('functionalImpact').isObject().withMessage('Functional impact data is required'),
    body('overallResults').isObject().withMessage('Overall results are required'),
    body('timeToComplete').optional().isNumeric().withMessage('Time to complete must be a number'),
    body('startedAt').optional().isISO8601().withMessage('Started at must be a valid date'),
    body('deviceType').optional().isIn(['mobile', 'tablet', 'desktop', 'unknown']).withMessage('Invalid device type')
  ]
};

/**
 * @route   POST /api/assessment/submit
 * @desc    Submit a completed comprehensive mental health assessment
 * @access  Authenticated users (patients/students only)
 */
router.post('/submit',
  authenticateToken,
  assessmentValidation.submit,
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      // Check if user is authorized (only patients and students)
      if (!['patient', 'student'].includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Assessments are only available to patients and students.'
        });
      }

      const {
        questionnaires,
        functionalImpact,
        overallResults,
        timeToComplete,
        startedAt,
        deviceType,
        notes
      } = req.body;

      // Generate unique session ID
      const sessionId = uuidv4();

      // Validate questionnaire data structure
      const requiredQuestionnaires = ['GAD-7', 'PHQ-9', 'GHQ-12'];
      for (const type of requiredQuestionnaires) {
        if (!questionnaires[type] || !questionnaires[type].questions || !Array.isArray(questionnaires[type].questions)) {
          return res.status(400).json({
            success: false,
            message: `Invalid ${type} questionnaire data format`
          });
        }
      }

      // Calculate completion time
      const startTime = startedAt ? new Date(startedAt) : new Date(Date.now() - (timeToComplete * 1000 || 900000)); // Default 15 minutes ago
      const completionTime = timeToComplete || Math.round((new Date() - startTime) / 1000);

      // Create assessment document
      const assessment = new Assessment({
        userId,
        sessionId,
        questionnaires: {
          'GAD-7': {
            type: 'GAD-7',
            questions: questionnaires['GAD-7'].questions,
            totalScore: questionnaires['GAD-7'].totalScore,
            maxPossibleScore: questionnaires['GAD-7'].maxPossibleScore,
            severityLevel: questionnaires['GAD-7'].severityLevel
          },
          'PHQ-9': {
            type: 'PHQ-9',
            questions: questionnaires['PHQ-9'].questions,
            totalScore: questionnaires['PHQ-9'].totalScore,
            maxPossibleScore: questionnaires['PHQ-9'].maxPossibleScore,
            severityLevel: questionnaires['PHQ-9'].severityLevel
          },
          'GHQ-12': {
            type: 'GHQ-12',
            questions: questionnaires['GHQ-12'].questions,
            totalScore: questionnaires['GHQ-12'].totalScore,
            maxPossibleScore: questionnaires['GHQ-12'].maxPossibleScore,
            severityLevel: questionnaires['GHQ-12'].severityLevel
          }
        },
        functionalImpact,
        overallResults,
        status: 'completed',
        startedAt: startTime,
        completedAt: new Date(),
        timeToComplete: completionTime,
        metadata: {
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip,
          deviceType: deviceType || 'unknown',
          version: '1.0',
          notes
        }
      });

      // Save assessment
      await assessment.save();

      // Check for crisis situations and flag for review
      const riskFlags = assessment.checkCrisisFlags();
      
      // If there are critical risk flags, we might want to trigger alerts
      const criticalFlags = riskFlags.filter(flag => flag.severity === 'critical');
      if (criticalFlags.length > 0) {
        // Log critical assessment for immediate attention
        console.warn(`CRITICAL ASSESSMENT ALERT: User ${userId}, Session ${sessionId}`, {
          flags: criticalFlags,
          timestamp: new Date(),
          userId,
          sessionId
        });
      }

      // Prepare response data
      const responseData = {
        id: assessment._id,
        sessionId: assessment.sessionId,
        completedAt: assessment.completedAt,
        timeToComplete: assessment.timeToComplete,
        overallResults: {
          overallSeverity: assessment.overallResults.overallSeverity,
          maxSeverityQuestionnaire: assessment.overallResults.maxSeverityQuestionnaire,
          recommendations: assessment.overallResults.recommendations,
          riskFlags: assessment.overallResults.riskFlags.map(flag => ({
            type: flag.type,
            triggered: flag.triggered,
            severity: flag.severity
          }))
        },
        questionnaires: Object.keys(assessment.questionnaires).reduce((acc, type) => {
          const q = assessment.questionnaires[type];
          acc[type] = {
            totalScore: q.totalScore,
            maxPossibleScore: q.maxPossibleScore,
            severityLevel: q.severityLevel
          };
          return acc;
        }, {}),
        functionalImpact: {
          selectedValue: assessment.functionalImpact.selectedValue,
          selectedText: assessment.functionalImpact.selectedText
        },
        flaggedForReview: assessment.flaggedForReview
      };

      res.status(201).json({
        success: true,
        message: 'Assessment submitted successfully',
        data: { assessment: responseData }
      });

    } catch (error) {
      console.error('Error submitting assessment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit assessment',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   GET /api/assessment/latest
 * @desc    Get user's latest assessment results
 * @access  Authenticated users (patients/students only)
 */
router.get('/latest', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if user is authorized
    if (!['patient', 'student'].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Assessments are only available to patients and students.'
      });
    }

    // Find latest assessment
    const assessment = await Assessment.getLatestForUser(userId);

    if (!assessment) {
      return res.status(200).json({
        success: true,
        message: 'No assessment found',
        data: { hasAssessment: false }
      });
    }

    // Prepare response data with full details
    const responseData = {
      id: assessment._id,
      sessionId: assessment.sessionId,
      completedAt: assessment.completedAt,
      timeToComplete: assessment.timeToComplete,
      overallResults: assessment.overallResults,
      questionnaires: assessment.questionnaires,
      functionalImpact: assessment.functionalImpact,
      flaggedForReview: assessment.flaggedForReview,
      hasAssessment: true
    };

    res.status(200).json({
      success: true,
      message: 'Latest assessment retrieved successfully',
      data: { assessment: responseData }
    });

  } catch (error) {
    console.error('Error retrieving latest assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve assessment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/assessment/history
 * @desc    Get user's assessment history
 * @access  Authenticated users (patients/students only)
 */
router.get('/history', 
  authenticateToken,
  [query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const limit = parseInt(req.query.limit) || 10;

      // Check if user is authorized
      if (!['patient', 'student'].includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Assessments are only available to patients and students.'
        });
      }

      // Get assessment history
      const assessments = await Assessment.getHistoryForUser(userId, limit);

      const historyData = assessments.map(assessment => ({
        id: assessment._id,
        sessionId: assessment.sessionId,
        completedAt: assessment.completedAt,
        timeToComplete: assessment.timeToComplete,
        overallSeverity: assessment.overallResults.overallSeverity,
        maxSeverityQuestionnaire: assessment.overallResults.maxSeverityQuestionnaire,
        flaggedForReview: assessment.flaggedForReview
      }));

      res.status(200).json({
        success: true,
        message: 'Assessment history retrieved successfully',
        data: {
          assessments: historyData,
          count: historyData.length,
          hasHistory: historyData.length > 0
        }
      });

    } catch (error) {
      console.error('Error retrieving assessment history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve assessment history',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   GET /api/assessment/:sessionId
 * @desc    Get specific assessment by session ID
 * @access  Authenticated users (patients/students only)
 */
router.get('/:sessionId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { sessionId } = req.params;

    // Check if user is authorized
    if (!['patient', 'student'].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Assessments are only available to patients and students.'
      });
    }

    // Find assessment by session ID and user ID
    const assessment = await Assessment.findOne({
      sessionId,
      userId,
      status: 'completed'
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Prepare full response data
    const responseData = {
      id: assessment._id,
      sessionId: assessment.sessionId,
      completedAt: assessment.completedAt,
      timeToComplete: assessment.timeToComplete,
      overallResults: assessment.overallResults,
      questionnaires: assessment.questionnaires,
      functionalImpact: assessment.functionalImpact,
      flaggedForReview: assessment.flaggedForReview
    };

    res.status(200).json({
      success: true,
      message: 'Assessment retrieved successfully',
      data: { assessment: responseData }
    });

  } catch (error) {
    console.error('Error retrieving assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve assessment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   DELETE /api/assessment/:sessionId
 * @desc    Delete a specific assessment (soft delete by changing status)
 * @access  Authenticated users (patients/students only)
 */
router.delete('/:sessionId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { sessionId } = req.params;

    // Check if user is authorized
    if (!['patient', 'student'].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Assessments are only available to patients and students.'
      });
    }

    // Find and update assessment
    const assessment = await Assessment.findOneAndUpdate(
      { sessionId, userId },
      { 
        status: 'abandoned',
        'metadata.notes': 'Deleted by user'
      },
      { new: true }
    );

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully',
      data: { sessionId: assessment.sessionId }
    });

  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete assessment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;