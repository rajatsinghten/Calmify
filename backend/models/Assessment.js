const mongoose = require('mongoose');

const questionnaireResultSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['GAD-7', 'PHQ-9', 'GHQ-12']
  },
  questions: [{
    questionNumber: {
      type: Number,
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    selectedValue: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    },
    selectedText: {
      type: String,
      required: true
    }
  }],
  totalScore: {
    type: Number,
    required: true,
    min: 0
  },
  maxPossibleScore: {
    type: Number,
    required: true
  },
  severityLevel: {
    level: {
      type: String,
      required: true,
      enum: ['Minimal', 'Mild', 'Moderate', 'Moderately severe', 'Severe', 'Good', 'Mild distress', 'Moderate distress', 'Severe distress']
    },
    description: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  }
});

const functionalImpactSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    default: 'If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?'
  },
  selectedValue: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  selectedText: {
    type: String,
    required: true
  }
});

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  questionnaires: {
    'GAD-7': questionnaireResultSchema,
    'PHQ-9': questionnaireResultSchema,
    'GHQ-12': questionnaireResultSchema
  },
  functionalImpact: functionalImpactSchema,
  overallResults: {
    overallSeverity: {
      type: String,
      required: true,
      enum: ['minimal', 'mild', 'moderate', 'moderately severe', 'severe']
    },
    maxSeverityQuestionnaire: {
      type: String,
      required: true,
      enum: ['GAD-7', 'PHQ-9', 'GHQ-12']
    },
    recommendations: [{
      type: String,
      required: true
    }],
    riskFlags: [{
      type: {
        type: String,
        enum: ['suicidal_ideation', 'severe_symptoms', 'crisis_indicators', 'functional_impairment']
      },
      triggered: {
        type: Boolean,
        default: false
      },
      severity: {
        type: String,
        enum: ['low', 'moderate', 'high', 'critical'],
        default: 'moderate'
      },
      questionnaire: {
        type: String,
        enum: ['GAD-7', 'PHQ-9', 'GHQ-12', 'functional_impact']
      },
      details: String
    }]
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'completed'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: Date.now
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
    version: {
      type: String,
      default: '1.0'
    },
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
assessmentSchema.index({ userId: 1, createdAt: -1 });
assessmentSchema.index({ sessionId: 1 });
assessmentSchema.index({ 'overallResults.overallSeverity': 1 });
assessmentSchema.index({ flaggedForReview: 1 });
assessmentSchema.index({ status: 1 });

// Virtual to calculate completion time
assessmentSchema.virtual('completionTime').get(function() {
  if (this.startedAt && this.completedAt) {
    return Math.round((this.completedAt - this.startedAt) / 1000); // in seconds
  }
  return null;
});

// Method to check for crisis indicators
assessmentSchema.methods.checkCrisisFlags = function() {
  const flags = [];
  
  // Check for suicidal ideation in PHQ-9 (question 9)
  if (this.questionnaires['PHQ-9']) {
    const question9 = this.questionnaires['PHQ-9'].questions.find(q => q.questionNumber === 9);
    if (question9 && question9.selectedValue > 0) {
      flags.push({
        type: 'suicidal_ideation',
        triggered: true,
        severity: question9.selectedValue >= 2 ? 'critical' : 'high',
        questionnaire: 'PHQ-9',
        details: `Question 9 response: ${question9.selectedText}`
      });
    }
  }
  
  // Check for severe symptoms in any questionnaire
  Object.keys(this.questionnaires).forEach(type => {
    const questionnaire = this.questionnaires[type];
    if (questionnaire && questionnaire.severityLevel.level === 'Severe') {
      flags.push({
        type: 'severe_symptoms',
        triggered: true,
        severity: 'high',
        questionnaire: type,
        details: `${type} severity: ${questionnaire.severityLevel.description}`
      });
    }
  });
  
  // Check for significant functional impairment
  if (this.functionalImpact && this.functionalImpact.selectedValue >= 2) {
    flags.push({
      type: 'functional_impairment',
      triggered: true,
      severity: this.functionalImpact.selectedValue === 3 ? 'high' : 'moderate',
      questionnaire: 'functional_impact',
      details: `Functional impact: ${this.functionalImpact.selectedText}`
    });
  }
  
  this.overallResults.riskFlags = flags;
  
  // Flag for review if any high or critical risk flags are present
  const highRiskFlags = flags.filter(flag => ['high', 'critical'].includes(flag.severity));
  if (highRiskFlags.length > 0) {
    this.flaggedForReview = true;
  }
  
  return flags;
};

// Static method to get latest assessment for a user
assessmentSchema.statics.getLatestForUser = function(userId) {
  return this.findOne({ 
    userId, 
    status: 'completed'
  })
  .sort({ completedAt: -1 });
};

// Static method to get assessment history for a user
assessmentSchema.statics.getHistoryForUser = function(userId, limit = 10) {
  return this.find({ 
    userId, 
    status: 'completed' 
  })
  .sort({ completedAt: -1 })
  .limit(limit)
  .select('sessionId overallResults.overallSeverity overallResults.maxSeverityQuestionnaire completedAt timeToComplete flaggedForReview');
};

// Pre-save middleware to calculate risk flags and overall severity
assessmentSchema.pre('save', function(next) {
  // Calculate time to complete
  if (this.startedAt && this.completedAt && !this.timeToComplete) {
    this.timeToComplete = Math.round((this.completedAt - this.startedAt) / 1000);
  }
  
  // Check for crisis flags
  if (this.isModified('questionnaires') || this.isModified('functionalImpact')) {
    this.checkCrisisFlags();
  }
  
  next();
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;