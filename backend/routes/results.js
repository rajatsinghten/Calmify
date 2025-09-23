const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Questionnaire = require('../models/Questionnaire');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, resultsValidation } = require('../utils/validation');
const { AggregateScorer } = require('../utils/psychologicalScoring');

/**
 * @route   GET /api/results/user/:userId/latest
 * @desc    Get latest results for a specific user
 * @access  Authenticated users (own data) or admin
 */
router.get('/user/:userId/latest', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { questionnaireType } = req.query;

    // Check authorization - users can only access their own data unless admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Can only access your own results.'
      });
    }

    const filter = { userId, status: 'completed' };
    if (questionnaireType) {
      filter.questionnaireType = questionnaireType;
    }

    const latestResponse = await Response.findOne(filter)
      .populate('questionnaireId', 'name type description maxScore')
      .sort({ completedAt: -1 });

    if (!latestResponse) {
      return res.status(404).json({
        success: false,
        message: 'No completed results found'
      });
    }

    const result = {
      id: latestResponse._id,
      sessionId: latestResponse.sessionId,
      questionnaire: {
        id: latestResponse.questionnaireId._id,
        name: latestResponse.questionnaireId.name,
        type: latestResponse.questionnaireId.type,
        description: latestResponse.questionnaireId.description
      },
      completedAt: latestResponse.completedAt,
      timeToComplete: latestResponse.timeToComplete,
      result: {
        totalScore: latestResponse.result.totalScore,
        maxPossibleScore: latestResponse.result.maxPossibleScore,
        percentageScore: latestResponse.result.percentageScore,
        severityLevel: latestResponse.result.severityLevel,
        categoryScores: latestResponse.result.categoryScores,
        interpretation: latestResponse.result.severityLevel.description,
        recommendations: latestResponse.result.severityLevel.recommendations
      },
      flaggedForReview: latestResponse.flaggedForReview,
      riskFlags: latestResponse.result.riskFlags?.filter(flag => flag.triggered) || []
    };

    res.status(200).json({
      success: true,
      message: 'Latest results retrieved successfully',
      data: { result }
    });

  } catch (error) {
    console.error('Error fetching latest results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest results',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/results/user/:userId/history
 * @desc    Get historical results for a specific user
 * @access  Authenticated users (own data) or admin
 */
router.get('/user/:userId/history', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      questionnaireType, 
      limit = 10, 
      page = 1,
      startDate,
      endDate,
      includeRiskFlags = false
    } = req.query;

    // Check authorization
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Can only access your own results.'
      });
    }

    const filter = { userId, status: 'completed' };
    
    if (questionnaireType) {
      filter.questionnaireType = questionnaireType;
    }

    if (startDate || endDate) {
      filter.completedAt = {};
      if (startDate) filter.completedAt.$gte = new Date(startDate);
      if (endDate) filter.completedAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const responses = await Response.find(filter)
      .populate('questionnaireId', 'name type description maxScore')
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Response.countDocuments(filter);

    const results = responses.map(response => {
      const result = {
        id: response._id,
        sessionId: response.sessionId,
        questionnaire: {
          id: response.questionnaireId._id,
          name: response.questionnaireId.name,
          type: response.questionnaireId.type
        },
        completedAt: response.completedAt,
        timeToComplete: response.timeToComplete,
        result: {
          totalScore: response.result.totalScore,
          maxPossibleScore: response.result.maxPossibleScore,
          percentageScore: response.result.percentageScore,
          severityLevel: response.result.severityLevel.level,
          severityDescription: response.result.severityLevel.description
        },
        flaggedForReview: response.flaggedForReview
      };

      if (includeRiskFlags === 'true') {
        result.riskFlags = response.result.riskFlags?.filter(flag => flag.triggered) || [];
      }

      return result;
    });

    // Calculate trends if multiple results
    let trends = null;
    if (results.length > 1) {
      trends = {
        scoreImprovement: results[0].result.totalScore - results[results.length - 1].result.totalScore,
        severityTrend: results[0].result.severityLevel !== results[results.length - 1].result.severityLevel,
        averageScore: results.reduce((sum, r) => sum + r.result.totalScore, 0) / results.length
      };
    }

    res.status(200).json({
      success: true,
      message: 'Results history retrieved successfully',
      data: {
        results,
        trends,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: results.length,
          totalResults: total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching results history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch results history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/results/response/:responseId
 * @desc    Get detailed results for a specific response
 * @access  Authenticated users (own data) or admin
 */
router.get('/response/:responseId', authenticateToken, async (req, res) => {
  try {
    const { responseId } = req.params;
    const { includeAnswers = false } = req.query;

    const response = await Response.findById(responseId)
      .populate('questionnaireId', 'name type description questions maxScore');

    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response not found'
      });
    }

    // Check authorization
    if (response.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Can only access your own results.'
      });
    }

    if (response.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Response is not completed'
      });
    }

    const result = {
      id: response._id,
      sessionId: response.sessionId,
      questionnaire: {
        id: response.questionnaireId._id,
        name: response.questionnaireId.name,
        type: response.questionnaireId.type,
        description: response.questionnaireId.description
      },
      completedAt: response.completedAt,
      timeToComplete: response.timeToComplete,
      result: {
        totalScore: response.result.totalScore,
        maxPossibleScore: response.result.maxPossibleScore,
        percentageScore: response.result.percentageScore,
        severityLevel: response.result.severityLevel,
        categoryScores: response.result.categoryScores,
        riskFlags: response.result.riskFlags?.filter(flag => flag.triggered) || []
      },
      flaggedForReview: response.flaggedForReview
    };

    // Include answers if requested and user is admin or owns the data
    if (includeAnswers === 'true') {
      result.answers = response.answers.map(answer => {
        const question = response.questionnaireId.questions.find(
          q => q.questionNumber === answer.questionNumber
        );
        return {
          questionNumber: answer.questionNumber,
          questionText: question?.questionText,
          selectedValue: answer.selectedValue,
          selectedText: answer.selectedText,
          responseTime: answer.responseTime,
          category: question?.category
        };
      });
    }

    res.status(200).json({
      success: true,
      message: 'Detailed results retrieved successfully',
      data: { result }
    });

  } catch (error) {
    console.error('Error fetching detailed results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch detailed results',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/results/admin/aggregate
 * @desc    Get aggregate results for admin analytics
 * @access  Admin only
 */
router.get('/admin/aggregate',
  authenticateToken,
  resultsValidation.adminAggregate,
  validateRequest,
  async (req, res) => {
    try {
      // Check admin privileges
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }

      const {
        questionnaireType,
        startDate,
        endDate,
        groupBy = 'month',
        includeTrends = false
      } = req.query;

      const filter = { status: 'completed' };
      
      if (questionnaireType) {
        filter.questionnaireType = questionnaireType;
      }

      if (startDate || endDate) {
        filter.completedAt = {};
        if (startDate) filter.completedAt.$gte = new Date(startDate);
        if (endDate) filter.completedAt.$lte = new Date(endDate);
      }

      const responses = await Response.find(filter)
        .populate('questionnaireId', 'name type maxScore')
        .sort({ completedAt: -1 });

      // Calculate aggregate statistics
      const aggregateStats = await AggregateScorer.calculateAggregateStats(responses);

      // Group by questionnaire type
      const byQuestionnaireType = {};
      for (const response of responses) {
        const type = response.questionnaireType;
        if (!byQuestionnaireType[type]) {
          byQuestionnaireType[type] = [];
        }
        byQuestionnaireType[type].push(response);
      }

      const typeStats = {};
      for (const [type, typeResponses] of Object.entries(byQuestionnaireType)) {
        typeStats[type] = await AggregateScorer.calculateAggregateStats(typeResponses);
      }

      let trends = null;
      if (includeTrends === 'true') {
        trends = await AggregateScorer.calculateTrends(responses, groupBy);
      }

      // Calculate additional metrics
      const additionalMetrics = {
        averageCompletionTime: responses.length > 0 
          ? responses.reduce((sum, r) => sum + (r.timeToComplete || 0), 0) / responses.length 
          : 0,
        completionRate: responses.length > 0 ? 100 : 0, // Would need to compare with started sessions
        mostCommonSeverity: Object.entries(aggregateStats.severityDistribution)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown',
        riskAssessmentNeeded: aggregateStats.riskFlagged
      };

      res.status(200).json({
        success: true,
        message: 'Aggregate results retrieved successfully',
        data: {
          overview: aggregateStats,
          byQuestionnaireType: typeStats,
          additionalMetrics,
          trends,
          period: {
            startDate: startDate || 'all',
            endDate: endDate || 'all',
            groupBy
          }
        }
      });

    } catch (error) {
      console.error('Error fetching aggregate results:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch aggregate results',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   GET /api/results/admin/risk-flagged
 * @desc    Get responses flagged for review
 * @access  Admin only
 */
router.get('/admin/risk-flagged', authenticateToken, async (req, res) => {
  try {
    // Check admin privileges
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { 
      limit = 20, 
      page = 1,
      questionnaireType,
      reviewStatus = 'pending'
    } = req.query;

    const filter = { 
      flaggedForReview: true,
      status: 'completed'
    };

    if (questionnaireType) {
      filter.questionnaireType = questionnaireType;
    }

    if (reviewStatus === 'reviewed') {
      filter.reviewedBy = { $exists: true };
    } else if (reviewStatus === 'pending') {
      filter.reviewedBy = { $exists: false };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const responses = await Response.find(filter)
      .populate('userId', 'name email')
      .populate('questionnaireId', 'name type')
      .populate('reviewedBy', 'name email')
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Response.countDocuments(filter);

    const flaggedResults = responses.map(response => ({
      id: response._id,
      sessionId: response.sessionId,
      user: {
        id: response.userId._id,
        name: response.userId.name,
        email: response.userId.email
      },
      questionnaire: {
        name: response.questionnaireId.name,
        type: response.questionnaireId.type
      },
      completedAt: response.completedAt,
      result: {
        totalScore: response.result.totalScore,
        severityLevel: response.result.severityLevel.level,
        riskFlags: response.result.riskFlags?.filter(flag => flag.triggered) || []
      },
      reviewStatus: response.reviewedBy ? 'reviewed' : 'pending',
      reviewedBy: response.reviewedBy ? {
        name: response.reviewedBy.name,
        email: response.reviewedBy.email
      } : null,
      reviewedAt: response.reviewedAt,
      reviewNotes: response.reviewNotes
    }));

    res.status(200).json({
      success: true,
      message: 'Risk-flagged results retrieved successfully',
      data: {
        flaggedResults,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: flaggedResults.length,
          totalFlagged: total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching risk-flagged results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch risk-flagged results',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/results/admin/review/:responseId
 * @desc    Mark a flagged response as reviewed
 * @access  Admin only
 */
router.post('/admin/review/:responseId',
  authenticateToken,
  resultsValidation.adminReview,
  validateRequest,
  async (req, res) => {
    try {
      // Check admin privileges
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }

      const { responseId } = req.params;
      const { reviewNotes, actionTaken } = req.body;

      const response = await Response.findById(responseId);
      if (!response) {
        return res.status(404).json({
          success: false,
          message: 'Response not found'
        });
      }

      if (!response.flaggedForReview) {
        return res.status(400).json({
          success: false,
          message: 'Response is not flagged for review'
        });
      }

      response.reviewedBy = req.user.id;
      response.reviewedAt = new Date();
      response.reviewNotes = reviewNotes;
      response.metadata.actionTaken = actionTaken;

      await response.save();

      res.status(200).json({
        success: true,
        message: 'Response marked as reviewed successfully',
        data: {
          responseId: response._id,
          reviewedAt: response.reviewedAt,
          reviewedBy: req.user.id
        }
      });

    } catch (error) {
      console.error('Error marking response as reviewed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark response as reviewed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;