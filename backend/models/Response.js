const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedValue: {
    type: Number,
    required: true,
    min: 0
  },
  selectedText: {
    type: String,
    required: true
  },
  responseTime: {
    type: Number, // in seconds
    default: 0
  }
});

const resultSchema = new mongoose.Schema({
  totalScore: {
    type: Number,
    required: true,
    min: 0
  },
  maxPossibleScore: {
    type: Number,
    required: true
  },
  percentageScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  severityLevel: {
    level: {
      type: String,
      required: true,
      enum: ['minimal', 'mild', 'moderate', 'moderately_severe', 'severe', 'unknown']
    },
    description: {
      type: String,
      required: true
    },
    recommendations: [{
      type: String
    }]
  },
  categoryScores: [{
    category: {
      type: String,
      enum: ['mood', 'anxiety', 'general_health', 'cognitive', 'behavioral', 'somatic']
    },
    score: Number,
    maxScore: Number
  }],
  riskFlags: [{
    type: {
      type: String,
      enum: ['suicidal_ideation', 'self_harm', 'severe_symptoms', 'crisis_indicators']
    },
    triggered: Boolean,
    questionNumber: Number,
    response: String
  }]
});

const responseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionnaireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Questionnaire',
    required: true
  },
  questionnaireType: {
    type: String,
    required: true,
    enum: ['PHQ-9', 'GAD-7', 'GHQ-12', 'GHQ-28']
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  answers: [answerSchema],
  result: resultSchema,
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  timeToComplete: {
    type: Number // in seconds
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'unknown'],
      default: 'unknown'
    },
    referralSource: String,
    notes: String
  },
  flaggedForReview: {
    type: Boolean,
    default: false
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String
}, {
  timestamps: true
});

// Indexes for efficient queries
responseSchema.index({ userId: 1, createdAt: -1 });
responseSchema.index({ questionnaireType: 1, createdAt: -1 });
responseSchema.index({ sessionId: 1 });
responseSchema.index({ 'result.severityLevel.level': 1 });
responseSchema.index({ flaggedForReview: 1 });

// Virtual to calculate completion percentage
responseSchema.virtual('completionPercentage').get(function() {
  if (!this.populated('questionnaireId')) return 0;
  const totalQuestions = this.questionnaireId.questions.length;
  return (this.answers.length / totalQuestions) * 100;
});

// Method to check if response is complete
responseSchema.methods.isComplete = function() {
  if (!this.populated('questionnaireId')) return false;
  return this.answers.length === this.questionnaireId.questions.length;
};

// Method to calculate time to complete
responseSchema.methods.calculateTimeToComplete = function() {
  if (this.startedAt && this.completedAt) {
    return Math.round((this.completedAt - this.startedAt) / 1000); // in seconds
  }
  return null;
};

// Method to check for risk flags
responseSchema.methods.checkRiskFlags = function() {
  const flags = [];
  
  // Check for suicidal ideation (PHQ-9 question 9)
  if (this.questionnaireType === 'PHQ-9') {
    const suicidalIdeationAnswer = this.answers.find(answer => answer.questionNumber === 9);
    if (suicidalIdeationAnswer && suicidalIdeationAnswer.selectedValue > 0) {
      flags.push({
        type: 'suicidal_ideation',
        triggered: true,
        questionNumber: 9,
        response: suicidalIdeationAnswer.selectedText
      });
    }
  }
  
  // Check for severe symptoms based on total score
  if (this.result && this.result.severityLevel.level === 'severe') {
    flags.push({
      type: 'severe_symptoms',
      triggered: true,
      questionNumber: null,
      response: `Total score: ${this.result.totalScore}`
    });
  }
  
  this.result.riskFlags = flags;
  
  // Flag for review if any risk flags are present
  if (flags.length > 0) {
    this.flaggedForReview = true;
  }
  
  return flags;
};

// Static method to get latest response for a user and questionnaire type
responseSchema.statics.getLatestForUser = function(userId, questionnaireType) {
  return this.findOne({ 
    userId, 
    questionnaireType,
    status: 'completed'
  })
  .sort({ completedAt: -1 })
  .populate('questionnaireId');
};

// Static method to get response history for a user
responseSchema.statics.getHistoryForUser = function(userId, questionnaireType = null, limit = 10) {
  const query = { userId, status: 'completed' };
  if (questionnaireType) {
    query.questionnaireType = questionnaireType;
  }
  
  return this.find(query)
    .sort({ completedAt: -1 })
    .limit(limit)
    .populate('questionnaireId');
};

// Pre-save middleware
responseSchema.pre('save', function(next) {
  // Set completion time when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
    this.timeToComplete = this.calculateTimeToComplete();
  }
  
  // Check for risk flags when result is calculated
  if (this.isModified('result') && this.result) {
    this.checkRiskFlags();
  }
  
  next();
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;