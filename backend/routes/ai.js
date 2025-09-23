const express = require('express');
const { auth } = require('../utils');
const OpenAI = require('openai');

const router = express.Router();

// Initialize Azure OpenAI client
const initializeAzureOpenAI = () => {
  try {
    if (!process.env.AZURE_OPENAI_API_KEY || !process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
      console.log('Azure OpenAI credentials not found, using fallback responses');
      return null;
    }

    const client = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
      defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview' },
      defaultHeaders: {
        'api-key': process.env.AZURE_OPENAI_API_KEY,
      }
    });

    console.log('✅ Azure OpenAI client initialized for chatbot');
    return client;
  } catch (error) {
    console.error('Failed to initialize Azure OpenAI client:', error.message);
    return null;
  }
};

const azureOpenAIClient = initializeAzureOpenAI();

// In-memory conversation storage (in production, use Redis or database)
const conversations = new Map();

// Psychology expert system prompt
const PSYCHOLOGY_EXPERT_PROMPT = `You are Dr. Sarah, a compassionate and experienced clinical psychologist and mental health expert working for Calmify, a comprehensive mental health support platform. You specialize in cognitive behavioral therapy, mindfulness-based interventions, and crisis intervention.

Your role is to:
- Provide empathetic, non-judgmental support and active listening
- Offer evidence-based coping strategies and therapeutic techniques
- Help users understand their emotions and thought patterns
- Provide psychoeducation about mental health conditions
- Guide users through mindfulness and grounding exercises
- Recognize crisis situations and provide appropriate resources
- Encourage professional help when needed

IMPORTANT GUIDELINES:
- Always be warm, empathetic, and understanding
- Validate emotions and normalize mental health struggles
- Provide specific, actionable advice and coping strategies
- Keep responses concise but meaningful (2-4 sentences typically)
- NEVER diagnose or prescribe medication
- Always prioritize user safety and well-being
- If someone mentions self-harm, suicide, or crisis, immediately provide crisis resources
- Encourage professional therapy for ongoing support
- Use person-first language and avoid stigmatizing terms
- Remember details from the conversation to build rapport

Crisis Resources to provide when needed:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Emergency Services: 911
- SAMHSA National Helpline: 1-800-662-4357

Remember: You're here to provide support, hope, and practical tools for mental wellness.`;

// Simple psychology expert chatbot endpoint
router.post('/chat',
  auth.authenticateToken,
  async (req, res) => {
    try {
      const { message, conversationId } = req.body;
      const userId = req.user.id;

      if (!message || !message.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Message is required'
        });
      }

      // Generate or use existing conversation ID
      const convId = conversationId || `conv_${userId}_${Date.now()}`;
      
      // Get conversation history
      let conversation = conversations.get(convId) || [];
      
      // Add user message to conversation
      conversation.push({
        role: 'user',
        content: message.trim(),
        timestamp: new Date()
      });

      // Keep only last 20 messages to prevent context overflow
      if (conversation.length > 20) {
        conversation = conversation.slice(-20);
      }

      let responseText;
      let isAIGenerated = false;

      // Try Azure OpenAI first
      if (azureOpenAIClient) {
        try {
          // Build messages for OpenAI
          const messages = [
            {
              role: 'system',
              content: PSYCHOLOGY_EXPERT_PROMPT
            }
          ];

          // Add conversation history (last 10 messages for context)
          const recentHistory = conversation.slice(-10);
          for (const msg of recentHistory) {
            messages.push({
              role: msg.role,
              content: msg.content
            });
          }

          const response = await azureOpenAIClient.chat.completions.create({
            model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
            messages: messages,
            max_tokens: 400,
            temperature: 0.7,
            top_p: 0.9,
            frequency_penalty: 0.3,
            presence_penalty: 0.3
          });

          responseText = response.choices[0]?.message?.content;
          isAIGenerated = true;

        } catch (aiError) {
          console.error('Azure OpenAI error:', aiError);
          responseText = null;
        }
      }

      // Fallback to rule-based responses if AI fails
      if (!responseText) {
        responseText = generateFallbackResponse(message.trim());
      }

      // Add bot response to conversation
      conversation.push({
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      });

      // Update conversation storage
      conversations.set(convId, conversation);

      // Check for crisis indicators
      const crisisDetected = checkForCrisis(message.trim());

      // Clean old conversations periodically
      cleanOldConversations();

      res.json({
        success: true,
        data: {
          response: responseText,
          conversationId: convId,
          isAIGenerated,
          crisisDetected,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate response',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Fallback responses for when AI is unavailable
const generateFallbackResponse = (message) => {
  const text = message.toLowerCase();
  
  // Crisis detection
  if (text.includes('suicide') || text.includes('kill myself') || text.includes('end my life') || text.includes('hurt myself')) {
    return "I'm very concerned about what you've shared with me. Your life has value and there are people who want to help. Please reach out immediately: National Suicide Prevention Lifeline at 988, Crisis Text Line by texting HOME to 741741, or call 911 if you're in immediate danger. You don't have to go through this alone.";
  }

  // Greeting
  if (text.includes('hello') || text.includes('hi') || text.match(/^(good morning|good afternoon|good evening)/)) {
    return "Hello! I'm Dr. Sarah, and I'm here to support you. It takes courage to reach out, and I'm glad you're here. How are you feeling today, and what would you like to talk about?";
  }

  // Depression/sadness
  if (text.includes('depressed') || text.includes('sad') || text.includes('hopeless') || text.includes('empty')) {
    return "I hear that you're going through a really difficult time, and I want you to know that your feelings are completely valid. Depression can make everything feel overwhelming, but you're not alone in this. Can you tell me a bit more about what's been weighing on your mind lately?";
  }

  // Anxiety/worry
  if (text.includes('anxious') || text.includes('worried') || text.includes('panic') || text.includes('stressed')) {
    return "Anxiety can feel incredibly overwhelming, and I want you to know that what you're experiencing is real and valid. Let's take this one step at a time. First, try taking a slow, deep breath with me. Would you like to try a simple grounding technique, or would you prefer to talk about what's been causing these anxious feelings?";
  }

  // Stress
  if (text.includes('stressed') || text.includes('overwhelmed') || text.includes('pressure')) {
    return "It sounds like you're carrying a heavy load right now, and that's really challenging. Stress can affect us both mentally and physically. Let's work together to find some ways to help you feel more balanced. What's been your biggest source of stress lately?";
  }

  // Sleep issues
  if (text.includes('sleep') || text.includes('insomnia') || text.includes('tired')) {
    return "Sleep difficulties can really impact our mental health and daily functioning. This is very common, especially when we're dealing with stress or emotional challenges. Can you tell me more about your sleep patterns? Are you having trouble falling asleep, staying asleep, or both?";
  }

  // Relationships
  if (text.includes('relationship') || text.includes('family') || text.includes('friend') || text.includes('partner')) {
    return "Relationships can be both a source of great joy and significant stress. It sounds like you might be navigating some challenges in this area. Healthy relationships require communication, boundaries, and mutual respect. Would you like to share more about what's happening in your relationships?";
  }

  // Therapy/help seeking
  if (text.includes('therapy') || text.includes('therapist') || text.includes('counselor') || text.includes('help')) {
    return "Seeking help is actually a sign of strength and self-awareness. Therapy can provide you with personalized tools and support to navigate life's challenges. While I can offer support and coping strategies, working with a licensed therapist can provide deeper, ongoing care. Would you like some guidance on finding a therapist or would you like to explore some coping strategies we can work on together?";
  }

  // Default supportive response
  return "Thank you for sharing that with me. I can hear that this is important to you, and I want to make sure I understand what you're going through. Your feelings and experiences matter. Can you tell me a bit more about what's on your mind or how you've been feeling lately?";
};

// Check for crisis indicators in messages
const checkForCrisis = (message) => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'hurt myself', 'want to die',
    'no point living', 'better off dead', 'end it all', 'overdose',
    'cutting', 'self harm', 'jumping', 'hanging'
  ];
  
  const text = message.toLowerCase();
  return crisisKeywords.some(keyword => text.includes(keyword));
};

// Clean old conversations to prevent memory buildup
const cleanOldConversations = () => {
  const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
  
  for (const [convId, conversation] of conversations.entries()) {
    if (conversation.length > 0) {
      const lastMessage = conversation[conversation.length - 1];
      if (lastMessage.timestamp.getTime() < cutoffTime) {
        conversations.delete(convId);
      }
    }
  }
};

// Clean conversations every hour
setInterval(cleanOldConversations, 60 * 60 * 1000);

module.exports = router;