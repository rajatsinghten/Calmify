const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Response = require('../models/Response');
const Questionnaire = require('../models/Questionnaire');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, responseValidation } = require('../utils/validation');
const { ScorerFactory } = require('../utils/psychologicalScoring');

/**
 * @route   POST /api/responses/start
 * @desc    Start a new questionnaire response session
 * @access  Authenticated users
 */
router.post('/start',
  authenticateToken,
  responseValidation.start,
  validateRequest,
  async (req, res) => {
    try {
      const { questionnaireId, questionnaireType } = req.body;
      const userId = req.user.id;

      // Verify questionnaire exists and is active
      const questionnaire = await Questionnaire.findById(questionnaireId);
      if (!questionnaire || !questionnaire.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Questionnaire not found or not active'
        });
      }

      // Verify questionnaire type matches
      if (questionnaire.type !== questionnaireType) {
        return res.status(400).json({
          success: false,
          message: 'Questionnaire type mismatch'
        });
      }

      // Check for existing incomplete response
      const existingResponse = await Response.findOne({
        userId,
        questionnaireId,
        status: 'in_progress'
      });

      if (existingResponse) {
        return res.status(200).json({
          success: true,
          message: 'Existing session found',
          data: {
            sessionId: existingResponse.sessionId,
            response: {
              id: existingResponse._id,
              sessionId: existingResponse.sessionId,
              questionnaireType: existingResponse.questionnaireType,
              status: existingResponse.status,
              completedAnswers: existingResponse.answers.length,
              totalQuestions: questionnaire.questions.length,
              startedAt: existingResponse.startedAt
            }
          }
        });
      }

      // Create new response session
      const sessionId = uuidv4();
      const response = new Response({
        userId,
        questionnaireId,
        questionnaireType,
        sessionId,
        answers: [],
        status: 'in_progress',
        metadata: {
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip,
          deviceType: req.body.deviceType || 'unknown',
          referralSource: req.body.referralSource
        }
      });

      await response.save();

      res.status(201).json({
        success: true,
        message: 'Response session started successfully',
        data: {
          sessionId: response.sessionId,
          response: {
            id: response._id,
            sessionId: response.sessionId,
            questionnaireType: response.questionnaireType,
            status: response.status,
            completedAnswers: 0,
            totalQuestions: questionnaire.questions.length,
            startedAt: response.startedAt
          }
        }
      });

    } catch (error) {
      console.error('Error starting response session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start response session',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   POST /api/responses/submit-answer
 * @desc    Submit a single answer for a question
 * @access  Authenticated users
 */
router.post('/submit-answer',
  authenticateToken,
  responseValidation.submitAnswer,
  validateRequest,
  async (req, res) => {
    try {
      const {
        sessionId,
        questionNumber,
        questionId,
        selectedValue,
        selectedText,
        responseTime
      } = req.body;
      const userId = req.user.id;

      // Find the response session
      const response = await Response.findOne({
        sessionId,
        userId,
        status: 'in_progress'
      }).populate('questionnaireId');

      if (!response) {
        return res.status(404).json({
          success: false,
          message: 'Active response session not found'
        });
      }

      // Verify question belongs to questionnaire
      const question = response.questionnaireId.questions.find(
        q => q._id.toString() === questionId && q.questionNumber === questionNumber
      );

      if (!question) {
        return res.status(400).json({
          success: false,
          message: 'Invalid question for this questionnaire'
        });
      }

      // Verify selected value is valid for this question
      const validOption = question.options.find(opt => opt.value === selectedValue);
      if (!validOption) {
        return res.status(400).json({
          success: false,
          message: 'Invalid answer value for this question'
        });
      }

      // Remove existing answer for this question if it exists
      response.answers = response.answers.filter(
        answer => answer.questionNumber !== questionNumber
      );

      // Add new answer
      response.answers.push({
        questionNumber,
        questionId,
        selectedValue,
        selectedText: selectedText || validOption.text,
        responseTime: responseTime || 0
      });

      // Sort answers by question number
      response.answers.sort((a, b) => a.questionNumber - b.questionNumber);

      await response.save();

      // Check if questionnaire is complete
      const isComplete = response.answers.length === response.questionnaireId.questions.length;

      res.status(200).json({
        success: true,
        message: 'Answer submitted successfully',
        data: {
          response: {
            sessionId: response.sessionId,
            completedAnswers: response.answers.length,
            totalQuestions: response.questionnaireId.questions.length,
            isComplete,
            nextQuestionNumber: isComplete ? null : response.answers.length + 1
          }
        }
      });

    } catch (error) {
      console.error('Error submitting answer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit answer',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   POST /api/responses/complete
 * @desc    Complete questionnaire and calculate results
 * @access  Authenticated users
 */
router.post('/complete',
  authenticateToken,
  responseValidation.complete,
  validateRequest,
  async (req, res) => {
    try {
      const { sessionId } = req.body;
      const userId = req.user.id;

      // Find the response session
      const response = await Response.findOne({
        sessionId,
        userId,
        status: 'in_progress'
      }).populate('questionnaireId');

      if (!response) {
        return res.status(404).json({
          success: false,
          message: 'Active response session not found'
        });
      }

      // Verify all questions are answered
      const totalQuestions = response.questionnaireId.questions.length;
      if (response.answers.length !== totalQuestions) {
        return res.status(400).json({
          success: false,
          message: `Incomplete questionnaire. ${response.answers.length}/${totalQuestions} questions answered.`
        });
      }

      // Calculate results using scoring factory
      const results = await ScorerFactory.calculateResults(
        response.questionnaireType,
        response.questionnaireId._id,
        response.answers
      );

      // Update response with results
      response.result = results;
      response.status = 'completed';
      response.completedAt = new Date();

      await response.save();

      res.status(200).json({
        success: true,
        message: 'Questionnaire completed successfully',
        data: {
          response: {
            id: response._id,
            sessionId: response.sessionId,
            questionnaireType: response.questionnaireType,
            status: response.status,
            completedAt: response.completedAt,
            timeToComplete: response.timeToComplete,
            result: {
              totalScore: results.totalScore,
              maxPossibleScore: results.maxPossibleScore,
              percentageScore: results.percentageScore,
              severityLevel: results.severityLevel,
              categoryScores: results.categoryScores,
              riskFlags: results.riskFlags.map(flag => ({
                type: flag.type,
                triggered: flag.triggered,
                severity: flag.severity || 'moderate'
              }))
            },
            flaggedForReview: response.flaggedForReview
          }
        }
      });

    } catch (error) {
      console.error('Error completing questionnaire:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete questionnaire',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   GET /api/responses/session/:sessionId
 * @desc    Get current response session status
 * @access  Authenticated users
 */
router.get('/session/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const response = await Response.findOne({
      sessionId,
      userId
    }).populate('questionnaireId', 'name type questions.questionNumber questions.questionText');

    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response session not found'
      });
    }

    const responseData = {
      id: response._id,
      sessionId: response.sessionId,
      questionnaireType: response.questionnaireType,
      questionnaireName: response.questionnaireId.name,
      status: response.status,
      completedAnswers: response.answers.length,
      totalQuestions: response.questionnaireId.questions.length,
      startedAt: response.startedAt,
      completedAt: response.completedAt,
      answers: response.answers.map(answer => ({
        questionNumber: answer.questionNumber,
        selectedValue: answer.selectedValue,
        selectedText: answer.selectedText,
        responseTime: answer.responseTime
      }))
    };

    // Include results if completed
    if (response.status === 'completed' && response.result) {
      responseData.result = {
        totalScore: response.result.totalScore,
        maxPossibleScore: response.result.maxPossibleScore,
        percentageScore: response.result.percentageScore,
        severityLevel: response.result.severityLevel,
        categoryScores: response.result.categoryScores
      };
    }

    res.status(200).json({
      success: true,
      message: 'Response session retrieved successfully',
      data: { response: responseData }
    });

  } catch (error) {
    console.error('Error fetching response session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch response session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/responses/abandon
 * @desc    Mark a response session as abandoned
 * @access  Authenticated users
 */
router.post('/abandon',
  authenticateToken,
  responseValidation.abandon,
  validateRequest,
  async (req, res) => {
    try {
      const { sessionId, reason } = req.body;
      const userId = req.user.id;

      const response = await Response.findOne({
        sessionId,
        userId,
        status: 'in_progress'
      });

      if (!response) {
        return res.status(404).json({
          success: false,
          message: 'Active response session not found'
        });
      }

      response.status = 'abandoned';
      response.metadata.notes = reason || 'Session abandoned by user';
      
      await response.save();

      res.status(200).json({
        success: true,
        message: 'Response session abandoned successfully',
        data: {
          sessionId: response.sessionId,
          status: response.status
        }
      });

    } catch (error) {
      console.error('Error abandoning response session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to abandon response session',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   GET /api/responses/user/history
 * @desc    Get user's response history
 * @access  Authenticated users
 */
router.get('/user/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      questionnaireType, 
      limit = 10, 
      page = 1,
      status = 'completed'
    } = req.query;

    const filter = { userId, status };
    if (questionnaireType) {
      filter.questionnaireType = questionnaireType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const responses = await Response.find(filter)
      .populate('questionnaireId', 'name type description')
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Response.countDocuments(filter);

    const responseData = responses.map(response => ({
      id: response._id,
      sessionId: response.sessionId,
      questionnaire: {
        id: response.questionnaireId._id,
        name: response.questionnaireId.name,
        type: response.questionnaireId.type
      },
      status: response.status,
      completedAt: response.completedAt,
      result: response.result ? {
        totalScore: response.result.totalScore,
        maxPossibleScore: response.result.maxPossibleScore,
        percentageScore: response.result.percentageScore,
        severityLevel: response.result.severityLevel.level,
        severityDescription: response.result.severityLevel.description
      } : null,
      flaggedForReview: response.flaggedForReview
    }));

    res.status(200).json({
      success: true,
      message: 'Response history retrieved successfully',
      data: {
        responses: responseData,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: responseData.length,
          totalResponses: total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching response history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch response history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;