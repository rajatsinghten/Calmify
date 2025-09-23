const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  }],
  category: {
    type: String,
    enum: ['mood', 'anxiety', 'general_health', 'cognitive', 'behavioral', 'somatic'],
    default: 'general_health'
  }
});

const scoringRuleSchema = new mongoose.Schema({
  minScore: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['minimal', 'mild', 'moderate', 'moderately_severe', 'severe']
  },
  description: {
    type: String,
    required: true
  },
  recommendations: [{
    type: String
  }]
});

const questionnaireSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['PHQ-9', 'GAD-7', 'GHQ-12', 'GHQ-28'],
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  instructions: {
    type: String,
    required: true
  },
  questions: [questionSchema],
  scoringRules: [scoringRuleSchema],
  maxScore: {
    type: Number,
    required: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    timeToComplete: {
      type: Number, // in minutes
      default: 5
    },
    validatedPopulation: [String],
    psychometricProperties: {
      reliability: String,
      validity: String,
      sensitivity: Number,
      specificity: Number
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
questionnaireSchema.index({ type: 1, isActive: 1 });

// Virtual for calculating total questions
questionnaireSchema.virtual('totalQuestions').get(function() {
  return this.questions.length;
});

// Method to get severity level based on score
questionnaireSchema.methods.getSeverityLevel = function(totalScore) {
  for (const rule of this.scoringRules) {
    if (totalScore >= rule.minScore && totalScore <= rule.maxScore) {
      return {
        level: rule.level,
        description: rule.description,
        recommendations: rule.recommendations,
        score: totalScore,
        maxScore: this.maxScore
      };
    }
  }
  return {
    level: 'unknown',
    description: 'Score out of defined range',
    recommendations: [],
    score: totalScore,
    maxScore: this.maxScore
  };
};

// Static method to get questionnaire by type
questionnaireSchema.statics.findByType = function(type) {
  return this.findOne({ type, isActive: true });
};

// Pre-save validation
questionnaireSchema.pre('save', function(next) {
  // Ensure scoring rules cover the full range
  const maxRuleScore = Math.max(...this.scoringRules.map(rule => rule.maxScore));
  if (maxRuleScore !== this.maxScore) {
    return next(new Error('Scoring rules must cover the full score range'));
  }
  
  // Ensure question numbers are sequential
  this.questions.sort((a, b) => a.questionNumber - b.questionNumber);
  
  next();
});

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

module.exports = Questionnaire;