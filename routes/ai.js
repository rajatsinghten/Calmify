const express = require('express');
const { auth } = require('../utils');
const aiChatbot = require('../utils/aiChatbot');

const router = express.Router();

// Get AI chatbot response for testing
router.post('/response',
  auth.authenticateToken,
  async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          error: 'Message is required'
        });
      }

      const intent = aiChatbot.analyzeIntent(message);
      const response = aiChatbot.generateResponse(intent, message);

      res.json({
        intent,
        response,
        confidence: aiChatbot.getConfidenceScore ? aiChatbot.getConfidenceScore(intent, message) : 0.8
      });
    } catch (error) {
      console.error('AI response error:', error);
      res.status(500).json({
        error: 'Failed to generate AI response',
        details: error.message
      });
    }
  }
);

// Get mental health resources
router.get('/resources',
  auth.optionalAuth,
  async (req, res) => {
    try {
      const resources = aiChatbot.getMentalHealthResources();
      
      res.json({
        resources,
        message: 'Mental health resources and support information'
      });
    } catch (error) {
      console.error('Get resources error:', error);
      res.status(500).json({
        error: 'Failed to get resources',
        details: error.message
      });
    }
  }
);

// Test intent detection
router.post('/analyze-intent',
  auth.authenticateToken,
  async (req, res) => {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({
          error: 'Text is required for analysis'
        });
      }

      const intent = aiChatbot.analyzeIntent(text);
      const shouldRespond = aiChatbot.shouldRespondToMessage(
        { content: { text } },
        [req.user] // Simulate single participant
      );

      res.json({
        text,
        intent,
        shouldRespond,
        availableIntents: Object.keys(aiChatbot.INTENT_PATTERNS)
      });
    } catch (error) {
      console.error('Intent analysis error:', error);
      res.status(500).json({
        error: 'Failed to analyze intent',
        details: error.message
      });
    }
  }
);

module.exports = router;