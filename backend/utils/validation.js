const { body, validationResult } = require('express-validator');

// Validation middleware wrapper
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  };
};

// User registration validation
const validateRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['patient', 'peer', 'counselor'])
    .withMessage('Invalid role specified')
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
const validateProfileUpdate = [
  body('profile.firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  
  body('profile.lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  
  body('profile.age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters')
];

// Session creation validation
const validateSessionCreation = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('type')
    .isIn(['peer-support', 'counseling', 'group', 'crisis'])
    .withMessage('Invalid session type'),
  
  body('maxParticipants')
    .optional()
    .isInt({ min: 2, max: 50 })
    .withMessage('Max participants must be between 2 and 50'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
];

// Message validation - accepts both 'message' and 'content.text' formats
const validateMessage = [
  // Check for either 'message' or 'content.text'
  body()
    .custom((value, { req }) => {
      const hasMessage = req.body.message && typeof req.body.message === 'string';
      const hasContentText = req.body.content && req.body.content.text && typeof req.body.content.text === 'string';
      
      if (!hasMessage && !hasContentText) {
        throw new Error('Message is required (either as "message" or "content.text")');
      }
      
      const messageText = hasMessage ? req.body.message : req.body.content.text;
      if (messageText.length < 1 || messageText.length > 2000) {
        throw new Error('Message must be between 1 and 2000 characters');
      }
      
      return true;
    }),
  
  body('content.type')
    .optional()
    .isIn(['text', 'image', 'file'])
    .withMessage('Invalid message type')
];

// Legacy validation for endpoints that specifically need content.text
const validateMessageContent = [
  body('content.text')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters')
    .trim(),
  
  body('content.type')
    .optional()
    .isIn(['text', 'image', 'file'])
    .withMessage('Invalid message type')
];

// Crisis alert validation
const validateCrisisAlert = [
  body('type')
    .isIn(['keyword-detection', 'user-report', 'counselor-escalation'])
    .withMessage('Invalid crisis alert type'),
  
  body('severity')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity level'),
  
  body('triggerContent.text')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Trigger content must be less than 2000 characters')
];

// Questionnaire validation
const questionnaireValidation = {
  create: [
    body('name')
      .isLength({ min: 3, max: 100 })
      .withMessage('Questionnaire name must be between 3 and 100 characters'),
    
    body('type')
      .isIn(['PHQ-9', 'GAD-7', 'GHQ-12', 'GHQ-28'])
      .withMessage('Invalid questionnaire type'),
    
    body('description')
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
    
    body('instructions')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Instructions must be between 10 and 1000 characters'),
    
    body('questions')
      .isArray({ min: 1 })
      .withMessage('At least one question is required'),
    
    body('questions.*.questionText')
      .isLength({ min: 5, max: 500 })
      .withMessage('Question text must be between 5 and 500 characters'),
    
    body('questions.*.questionNumber')
      .isInt({ min: 1 })
      .withMessage('Question number must be a positive integer'),
    
    body('questions.*.options')
      .isArray({ min: 2 })
      .withMessage('Each question must have at least 2 options'),
    
    body('scoringRules')
      .isArray({ min: 1 })
      .withMessage('At least one scoring rule is required'),
    
    body('maxScore')
      .isInt({ min: 1 })
      .withMessage('Max score must be a positive integer')
  ],
  
  update: [
    body('name')
      .optional()
      .isLength({ min: 3, max: 100 })
      .withMessage('Questionnaire name must be between 3 and 100 characters'),
    
    body('description')
      .optional()
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
    
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean')
  ]
};

// Response validation
const responseValidation = {
  start: [
    body('questionnaireId')
      .isMongoId()
      .withMessage('Invalid questionnaire ID'),
    
    body('questionnaireType')
      .isIn(['PHQ-9', 'GAD-7', 'GHQ-12', 'GHQ-28'])
      .withMessage('Invalid questionnaire type'),
    
    body('deviceType')
      .optional()
      .isIn(['mobile', 'tablet', 'desktop', 'unknown'])
      .withMessage('Invalid device type')
  ],
  
  submitAnswer: [
    body('sessionId')
      .isUUID(4)
      .withMessage('Invalid session ID'),
    
    body('questionNumber')
      .isInt({ min: 1 })
      .withMessage('Question number must be a positive integer'),
    
    body('questionId')
      .isMongoId()
      .withMessage('Invalid question ID'),
    
    body('selectedValue')
      .isInt({ min: 0 })
      .withMessage('Selected value must be a non-negative integer'),
    
    body('selectedText')
      .isLength({ min: 1, max: 200 })
      .withMessage('Selected text must be between 1 and 200 characters'),
    
    body('responseTime')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Response time must be a non-negative integer')
  ],
  
  complete: [
    body('sessionId')
      .isUUID(4)
      .withMessage('Invalid session ID')
  ],
  
  abandon: [
    body('sessionId')
      .isUUID(4)
      .withMessage('Invalid session ID'),
    
    body('reason')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Reason must be less than 500 characters')
  ]
};

// Results validation
const resultsValidation = {
  adminAggregate: [
    body('questionnaireType')
      .optional()
      .isIn(['PHQ-9', 'GAD-7', 'GHQ-12', 'GHQ-28'])
      .withMessage('Invalid questionnaire type'),
    
    body('groupBy')
      .optional()
      .isIn(['day', 'week', 'month'])
      .withMessage('Invalid groupBy parameter')
  ],
  
  adminReview: [
    body('reviewNotes')
      .isLength({ min: 5, max: 1000 })
      .withMessage('Review notes must be between 5 and 1000 characters'),
    
    body('actionTaken')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Action taken must be less than 500 characters')
  ]
};

// Generic validation request handler
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validate,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateSessionCreation,
  validateMessage,
  validateMessageContent,
  validateCrisisAlert,
  questionnaireValidation,
  responseValidation,
  resultsValidation,
  validateRequest
};