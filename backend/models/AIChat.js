const mongoose = require('mongoose');

const aiChatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  crisisDetected: {
    type: Boolean,
    default: false
  }
});

const aiChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  messages: [aiChatMessageSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  crisisDetected: {
    type: Boolean,
    default: false
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  messageCount: {
    type: Number,
    default: 0
  },
  conversationSummary: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
aiChatSchema.index({ userId: 1, createdAt: -1 });
aiChatSchema.index({ userId: 1, isActive: 1 });
aiChatSchema.index({ lastMessageAt: -1 });
aiChatSchema.index({ crisisDetected: 1 });

// Method to add a message
aiChatSchema.methods.addMessage = function(role, content, crisisDetected = false) {
  this.messages.push({
    role,
    content,
    crisisDetected,
    timestamp: new Date()
  });
  
  this.lastMessageAt = new Date();
  this.messageCount = this.messages.length;
  
  // Update crisis detection if any message has crisis
  if (crisisDetected) {
    this.crisisDetected = true;
  }
  
  // Auto-generate title from first user message if not set
  if (!this.title || this.title === 'New Chat') {
    const firstUserMessage = this.messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      this.title = this.generateTitleFromMessage(firstUserMessage.content);
    }
  }
  
  return this.save();
};

// Method to generate title from message
aiChatSchema.methods.generateTitleFromMessage = function(message) {
  // Take first 50 characters and add ellipsis if longer
  let title = message.trim();
  if (title.length > 50) {
    title = title.substring(0, 47) + '...';
  }
  
  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1);
  
  return title;
};

// Method to get recent messages for context
aiChatSchema.methods.getRecentMessages = function(limit = 20) {
  return this.messages.slice(-limit);
};

// Method to mark as inactive
aiChatSchema.methods.markInactive = function() {
  this.isActive = false;
  return this.save();
};

// Static method to get user's chat history (only closed/inactive chats)
aiChatSchema.statics.getUserChatHistory = function(userId, limit = 20) {
  return this.find({ userId, isActive: false })
    .sort({ lastMessageAt: -1 })
    .limit(limit)
    .select('title lastMessageAt messageCount crisisDetected createdAt');
};

// Static method to get active chat for user
aiChatSchema.statics.getActiveChat = function(userId) {
  return this.findOne({ userId, isActive: true })
    .select('_id title lastMessageAt messageCount crisisDetected createdAt messages');
};

// Static method to create new chat
aiChatSchema.statics.createNewChat = function(userId, title = 'New Chat') {
  return this.create({
    userId,
    title,
    messages: [],
    isActive: true,
    messageCount: 0
  });
};

module.exports = mongoose.model('AIChat', aiChatSchema);