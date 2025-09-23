/**
 * Psychological Assessment Scoring Utilities
 * Provides modular scoring logic for various psychological screening tools
 */

const Questionnaire = require('../models/Questionnaire');
const Response = require('../models/Response');

/**
 * Base class for all scoring calculators
 */
class BaseScorer {
  constructor(questionnaireType) {
    this.questionnaireType = questionnaireType;
  }

  /**
   * Calculate total score from responses
   * @param {Array} answers - Array of answer objects
   * @returns {number} Total score
   */
  calculateTotalScore(answers) {
    return answers.reduce((total, answer) => total + (answer.selectedValue || 0), 0);
  }

  /**
   * Calculate category scores
   * @param {Array} answers - Array of answer objects
   * @param {Array} questions - Array of question objects with categories
   * @returns {Array} Category scores
   */
  calculateCategoryScores(answers, questions) {
    const categoryMap = new Map();

    // Initialize categories
    questions.forEach(question => {
      const category = question.category || 'general_health';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { score: 0, maxScore: 0, questionCount: 0 });
      }
    });

    // Calculate scores for each category
    answers.forEach(answer => {
      const question = questions.find(q => q.questionNumber === answer.questionNumber);
      if (question) {
        const category = question.category || 'general_health';
        const categoryData = categoryMap.get(category);
        categoryData.score += answer.selectedValue;
        categoryData.maxScore += Math.max(...question.options.map(opt => opt.value));
        categoryData.questionCount++;
      }
    });

    // Convert to array format
    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      score: data.score,
      maxScore: data.maxScore,
      averageScore: data.questionCount > 0 ? data.score / data.questionCount : 0
    }));
  }

  /**
   * Check for specific risk indicators
   * @param {Array} answers - Array of answer objects
   * @returns {Array} Risk flags
   */
  checkRiskIndicators(answers) {
    return [];
  }

  /**
   * Calculate complete results
   * @param {Object} questionnaire - Questionnaire object
   * @param {Array} answers - Array of answer objects
   * @returns {Object} Complete scoring results
   */
  async calculateResults(questionnaire, answers) {
    const totalScore = this.calculateTotalScore(answers);
    const percentageScore = (totalScore / questionnaire.maxScore) * 100;
    const severityLevel = questionnaire.getSeverityLevel(totalScore);
    const categoryScores = this.calculateCategoryScores(answers, questionnaire.questions);
    const riskFlags = this.checkRiskIndicators(answers);

    return {
      totalScore,
      maxPossibleScore: questionnaire.maxScore,
      percentageScore: Math.round(percentageScore * 100) / 100,
      severityLevel,
      categoryScores,
      riskFlags
    };
  }
}

/**
 * PHQ-9 (Patient Health Questionnaire-9) Scorer
 * Depression screening tool
 */
class PHQ9Scorer extends BaseScorer {
  constructor() {
    super('PHQ-9');
  }

  checkRiskIndicators(answers) {
    const flags = [];
    
    // Check question 9 for suicidal ideation
    const suicidalIdeationAnswer = answers.find(answer => answer.questionNumber === 9);
    if (suicidalIdeationAnswer && suicidalIdeationAnswer.selectedValue > 0) {
      flags.push({
        type: 'suicidal_ideation',
        triggered: true,
        questionNumber: 9,
        response: suicidalIdeationAnswer.selectedText,
        severity: suicidalIdeationAnswer.selectedValue >= 2 ? 'high' : 'moderate'
      });
    }

    // Check for severe depressive symptoms (score >= 20)
    const totalScore = this.calculateTotalScore(answers);
    if (totalScore >= 20) {
      flags.push({
        type: 'severe_symptoms',
        triggered: true,
        questionNumber: null,
        response: `Severe depression indicated (score: ${totalScore})`
      });
    }

    return flags;
  }

  /**
   * Get PHQ-9 specific interpretations
   */
  getInterpretation(score) {
    if (score >= 20) return 'Severe depression';
    if (score >= 15) return 'Moderately severe depression';
    if (score >= 10) return 'Moderate depression';
    if (score >= 5) return 'Mild depression';
    return 'Minimal depression';
  }
}

/**
 * GAD-7 (Generalized Anxiety Disorder-7) Scorer
 * Anxiety screening tool
 */
class GAD7Scorer extends BaseScorer {
  constructor() {
    super('GAD-7');
  }

  checkRiskIndicators(answers) {
    const flags = [];
    const totalScore = this.calculateTotalScore(answers);

    // Check for severe anxiety symptoms (score >= 15)
    if (totalScore >= 15) {
      flags.push({
        type: 'severe_symptoms',
        triggered: true,
        questionNumber: null,
        response: `Severe anxiety indicated (score: ${totalScore})`
      });
    }

    // Check for panic disorder indicators (high scores on specific questions)
    const panicQuestions = [1, 3, 4]; // Questions about worry, restlessness, and irritability
    const panicScore = answers
      .filter(answer => panicQuestions.includes(answer.questionNumber))
      .reduce((sum, answer) => sum + answer.selectedValue, 0);

    if (panicScore >= 8) {
      flags.push({
        type: 'panic_indicators',
        triggered: true,
        questionNumber: null,
        response: 'High scores on panic-related symptoms'
      });
    }

    return flags;
  }

  getInterpretation(score) {
    if (score >= 15) return 'Severe anxiety';
    if (score >= 10) return 'Moderate anxiety';
    if (score >= 5) return 'Mild anxiety';
    return 'Minimal anxiety';
  }
}

/**
 * GHQ (General Health Questionnaire) Scorer
 * General psychological distress screening
 */
class GHQScorer extends BaseScorer {
  constructor(version = 'GHQ-12') {
    super(version);
    this.version = version;
  }

  checkRiskIndicators(answers) {
    const flags = [];
    const totalScore = this.calculateTotalScore(answers);
    
    // GHQ uses different scoring - binary scoring (0-0-1-1) is common
    const binaryScore = this.calculateBinaryScore(answers);
    
    // Check for general psychological distress
    const threshold = this.version === 'GHQ-12' ? 4 : 6;
    if (binaryScore >= threshold) {
      flags.push({
        type: 'psychological_distress',
        triggered: true,
        questionNumber: null,
        response: `Significant psychological distress indicated (binary score: ${binaryScore})`
      });
    }

    return flags;
  }

  /**
   * Calculate GHQ binary score (0-0-1-1 method)
   */
  calculateBinaryScore(answers) {
    return answers.reduce((total, answer) => {
      // Convert Likert scale to binary (0-0-1-1)
      return total + (answer.selectedValue >= 2 ? 1 : 0);
    }, 0);
  }

  async calculateResults(questionnaire, answers) {
    const results = await super.calculateResults(questionnaire, answers);
    
    // Add GHQ-specific binary scoring
    results.binaryScore = this.calculateBinaryScore(answers);
    results.maxBinaryScore = questionnaire.questions.length;
    
    return results;
  }

  getInterpretation(binaryScore) {
    const threshold = this.version === 'GHQ-12' ? 4 : 6;
    return binaryScore >= threshold ? 'Significant psychological distress' : 'No significant distress';
  }
}

/**
 * Scorer Factory - returns appropriate scorer for questionnaire type
 */
class ScorerFactory {
  static getScorer(questionnaireType) {
    switch (questionnaireType) {
      case 'PHQ-9':
        return new PHQ9Scorer();
      case 'GAD-7':
        return new GAD7Scorer();
      case 'GHQ-12':
        return new GHQScorer('GHQ-12');
      case 'GHQ-28':
        return new GHQScorer('GHQ-28');
      default:
        throw new Error(`Unsupported questionnaire type: ${questionnaireType}`);
    }
  }

  /**
   * Calculate results for any supported questionnaire type
   */
  static async calculateResults(questionnaireType, questionnaireId, answers) {
    try {
      const questionnaire = await Questionnaire.findById(questionnaireId);
      if (!questionnaire) {
        throw new Error('Questionnaire not found');
      }

      const scorer = this.getScorer(questionnaireType);
      return await scorer.calculateResults(questionnaire, answers);
    } catch (error) {
      throw new Error(`Scoring failed: ${error.message}`);
    }
  }

  /**
   * Get all supported questionnaire types
   */
  static getSupportedTypes() {
    return ['PHQ-9', 'GAD-7', 'GHQ-12', 'GHQ-28'];
  }
}

/**
 * Aggregate scoring utilities for analytics
 */
class AggregateScorer {
  /**
   * Calculate aggregate statistics for a set of responses
   */
  static async calculateAggregateStats(responses) {
    if (!responses || responses.length === 0) {
      return {
        totalResponses: 0,
        averageScore: 0,
        severityDistribution: {},
        riskFlagged: 0
      };
    }

    const totalResponses = responses.length;
    const totalScore = responses.reduce((sum, response) => sum + response.result.totalScore, 0);
    const averageScore = totalScore / totalResponses;

    // Calculate severity distribution
    const severityDistribution = responses.reduce((dist, response) => {
      const level = response.result.severityLevel.level;
      dist[level] = (dist[level] || 0) + 1;
      return dist;
    }, {});

    // Count risk-flagged responses
    const riskFlagged = responses.filter(response => response.flaggedForReview).length;

    // Calculate score ranges
    const scores = responses.map(r => r.result.totalScore);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);

    return {
      totalResponses,
      averageScore: Math.round(averageScore * 100) / 100,
      minScore,
      maxScore,
      severityDistribution,
      riskFlagged,
      riskPercentage: Math.round((riskFlagged / totalResponses) * 10000) / 100
    };
  }

  /**
   * Calculate trends over time
   */
  static async calculateTrends(responses, groupBy = 'month') {
    const trends = {};
    
    responses.forEach(response => {
      let key;
      const date = new Date(response.completedAt);
      
      switch (groupBy) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      if (!trends[key]) {
        trends[key] = [];
      }
      trends[key].push(response);
    });

    // Calculate statistics for each time period
    const trendStats = {};
    for (const [period, periodResponses] of Object.entries(trends)) {
      trendStats[period] = await this.calculateAggregateStats(periodResponses);
    }

    return trendStats;
  }
}

module.exports = {
  BaseScorer,
  PHQ9Scorer,
  GAD7Scorer,
  GHQScorer,
  ScorerFactory,
  AggregateScorer
};