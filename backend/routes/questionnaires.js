const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/Questionnaire');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, questionnaireValidation } = require('../utils/validation');

/**
 * @route   POST /api/questionnaires
 * @desc    Create a new questionnaire template
 * @access  Admin only
 */
router.post('/', 
  authenticateToken,
  questionnaireValidation.create,
  validateRequest,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }

      const {
        name,
        type,
        description,
        instructions,
        questions,
        scoringRules,
        maxScore,
        version,
        metadata
      } = req.body;

      // Check if questionnaire type already exists
      const existingQuestionnaire = await Questionnaire.findOne({ type });
      if (existingQuestionnaire) {
        return res.status(409).json({
          success: false,
          message: `Questionnaire type '${type}' already exists`
        });
      }

      // Create new questionnaire
      const questionnaire = new Questionnaire({
        name,
        type,
        description,
        instructions,
        questions,
        scoringRules,
        maxScore,
        version: version || '1.0',
        metadata: metadata || {}
      });

      await questionnaire.save();

      res.status(201).json({
        success: true,
        message: 'Questionnaire created successfully',
        data: {
          questionnaire: {
            id: questionnaire._id,
            name: questionnaire.name,
            type: questionnaire.type,
            description: questionnaire.description,
            totalQuestions: questionnaire.questions.length,
            maxScore: questionnaire.maxScore,
            version: questionnaire.version,
            createdAt: questionnaire.createdAt
          }
        }
      });

    } catch (error) {
      console.error('Error creating questionnaire:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create questionnaire',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   GET /api/questionnaires
 * @desc    Get all active questionnaires
 * @access  Authenticated users
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, includeInactive = false } = req.query;
    
    const filter = {};
    if (type) {
      filter.type = type;
    }
    if (!includeInactive || includeInactive === 'false') {
      filter.isActive = true;
    }

    const questionnaires = await Questionnaire.find(filter)
      .select('-questions.options -scoringRules') // Exclude detailed data for list view
      .sort({ type: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Questionnaires retrieved successfully',
      data: {
        questionnaires: questionnaires.map(q => ({
          id: q._id,
          name: q.name,
          type: q.type,
          description: q.description,
          totalQuestions: q.questions.length,
          maxScore: q.maxScore,
          version: q.version,
          isActive: q.isActive,
          estimatedTime: q.metadata?.timeToComplete || 5,
          createdAt: q.createdAt,
          updatedAt: q.updatedAt
        })),
        count: questionnaires.length
      }
    });

  } catch (error) {
    console.error('Error fetching questionnaires:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questionnaires',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/questionnaires/:id
 * @desc    Get a specific questionnaire by ID
 * @access  Authenticated users
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { includeScoring = false } = req.query;

    const questionnaire = await Questionnaire.findById(id);
    
    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire not found'
      });
    }

    if (!questionnaire.isActive && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Questionnaire is not active'
      });
    }

    // Prepare response data
    const responseData = {
      id: questionnaire._id,
      name: questionnaire.name,
      type: questionnaire.type,
      description: questionnaire.description,
      instructions: questionnaire.instructions,
      questions: questionnaire.questions.map(q => ({
        id: q._id,
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        options: q.options,
        category: q.category
      })),
      maxScore: questionnaire.maxScore,
      version: questionnaire.version,
      isActive: questionnaire.isActive,
      metadata: questionnaire.metadata,
      createdAt: questionnaire.createdAt,
      updatedAt: questionnaire.updatedAt
    };

    // Include scoring rules only if requested and user is admin
    if (includeScoring === 'true' && req.user.role === 'admin') {
      responseData.scoringRules = questionnaire.scoringRules;
    }

    res.status(200).json({
      success: true,
      message: 'Questionnaire retrieved successfully',
      data: { questionnaire: responseData }
    });

  } catch (error) {
    console.error('Error fetching questionnaire:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questionnaire',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/questionnaires/type/:type
 * @desc    Get questionnaire by type (PHQ-9, GAD-7, etc.)
 * @access  Authenticated users
 */
router.get('/type/:type', authenticateToken, async (req, res) => {
  try {
    const { type } = req.params;
    const { includeScoring = false } = req.query;

    const questionnaire = await Questionnaire.findByType(type);
    
    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: `Questionnaire type '${type}' not found`
      });
    }

    // Prepare response data
    const responseData = {
      id: questionnaire._id,
      name: questionnaire.name,
      type: questionnaire.type,
      description: questionnaire.description,
      instructions: questionnaire.instructions,
      questions: questionnaire.questions.map(q => ({
        id: q._id,
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        options: q.options,
        category: q.category
      })),
      maxScore: questionnaire.maxScore,
      version: questionnaire.version,
      metadata: questionnaire.metadata,
      createdAt: questionnaire.createdAt,
      updatedAt: questionnaire.updatedAt
    };

    // Include scoring rules only if requested and user is admin
    if (includeScoring === 'true' && req.user.role === 'admin') {
      responseData.scoringRules = questionnaire.scoringRules;
    }

    res.status(200).json({
      success: true,
      message: 'Questionnaire retrieved successfully',
      data: { questionnaire: responseData }
    });

  } catch (error) {
    console.error('Error fetching questionnaire by type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questionnaire',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/questionnaires/:id
 * @desc    Update an existing questionnaire
 * @access  Admin only
 */
router.put('/:id',
  authenticateToken,
  questionnaireValidation.update,
  validateRequest,
  async (req, res) => {
    try {
      // Check if user has admin privileges
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }

      const { id } = req.params;
      const updates = req.body;

      const questionnaire = await Questionnaire.findById(id);
      if (!questionnaire) {
        return res.status(404).json({
          success: false,
          message: 'Questionnaire not found'
        });
      }

      // Update questionnaire
      Object.assign(questionnaire, updates);
      await questionnaire.save();

      res.status(200).json({
        success: true,
        message: 'Questionnaire updated successfully',
        data: {
          questionnaire: {
            id: questionnaire._id,
            name: questionnaire.name,
            type: questionnaire.type,
            description: questionnaire.description,
            totalQuestions: questionnaire.questions.length,
            maxScore: questionnaire.maxScore,
            version: questionnaire.version,
            isActive: questionnaire.isActive,
            updatedAt: questionnaire.updatedAt
          }
        }
      });

    } catch (error) {
      console.error('Error updating questionnaire:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update questionnaire',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   DELETE /api/questionnaires/:id
 * @desc    Deactivate a questionnaire (soft delete)
 * @access  Admin only
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user has admin privileges
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    const questionnaire = await Questionnaire.findById(id);
    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire not found'
      });
    }

    // Soft delete by setting isActive to false
    questionnaire.isActive = false;
    await questionnaire.save();

    res.status(200).json({
      success: true,
      message: 'Questionnaire deactivated successfully',
      data: {
        questionnaire: {
          id: questionnaire._id,
          type: questionnaire.type,
          isActive: questionnaire.isActive
        }
      }
    });

  } catch (error) {
    console.error('Error deactivating questionnaire:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate questionnaire',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/questionnaires/:id/preview
 * @desc    Get questionnaire preview without questions (for display purposes)
 * @access  Public (no authentication required)
 */
router.get('/:id/preview', async (req, res) => {
  try {
    const { id } = req.params;

    const questionnaire = await Questionnaire.findById(id)
      .select('name type description instructions metadata maxScore version isActive');
    
    if (!questionnaire || !questionnaire.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Questionnaire not found or not active'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Questionnaire preview retrieved successfully',
      data: {
        questionnaire: {
          id: questionnaire._id,
          name: questionnaire.name,
          type: questionnaire.type,
          description: questionnaire.description,
          instructions: questionnaire.instructions,
          estimatedTime: questionnaire.metadata?.timeToComplete || 5,
          maxScore: questionnaire.maxScore,
          version: questionnaire.version
        }
      }
    });

  } catch (error) {
    console.error('Error fetching questionnaire preview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questionnaire preview',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;