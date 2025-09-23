import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import { Layout } from "@/components/Layout";
import { ChatBubble } from "@/components/ChatBubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, User, Bot, AlertTriangle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  _id: string;
  sender: string;
  text: string;
  timestamp: string;
  isBot?: boolean;
  crisisKeywords?: string[];
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

interface Session {
  _id: string;
  helperType: string;
  status: 'waiting' | 'active' | 'closed' | 'escalated';
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  crisis?: {
    detected: boolean;
    level: string;
  };
}

export default function ChatbotPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeSession();
  }, [isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeSession = async () => {
    try {
      setLoading(true);
      
      // Create chatbot session
      const sessionData = await apiService.createSession({
        helperType: 'chatbot',
        severity: 'mild'
      });
      setCurrentSession(sessionData.session);

      // Load existing messages
      if (sessionData.session._id) {
        try {
          const sessionDetails = await apiService.getSession(sessionData.session._id);
          const sessionMessages = sessionDetails.messages.map((msg: any) => ({
            _id: msg._id,
            sender: msg.senderRole,
            text: msg.message,
            timestamp: msg.createdAt,
            isBot: msg.senderRole === 'chatbot'
          }));
          setMessages(sessionMessages);
        } catch (error) {
          console.error('Failed to load session messages:', error);
        }
      }

      // Add welcome message if no messages exist
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          _id: 'welcome',
          sender: 'chatbot',
          text: `Hello${user?.profile?.preferredName ? ` ${user.profile.preferredName}` : ''}! I'm your AI mental health companion. I'm here to listen and provide support. How are you feeling today?`,
          timestamp: new Date().toISOString(),
          isBot: true
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Failed to initialize session:', error);
      // Create offline welcome message
      const welcomeMessage: Message = {
        _id: 'welcome',
        sender: 'chatbot',
        text: "Hello! I'm your AI mental health companion. I'm here to listen and provide support. How are you feeling today?",
        timestamp: new Date().toISOString(),
        isBot: true
      };
      setMessages([welcomeMessage]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      _id: `user-${Date.now()}`,
      sender: user?._id || 'anonymous',
      text: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      isBot: false
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage.trim();
    setInputMessage("");
    setIsTyping(true);

    try {
      // Send message to backend if session exists
      if (currentSession?._id) {
        await apiService.sendMessage({
          sessionId: currentSession._id,
          message: messageText,
          messageType: 'text'
        });
      }

      // Get AI response - simulate for now since the endpoint isn't implemented
      await simulateAIResponse(messageText);

    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
      
      // Add error message
      const errorMessage: Message = {
        _id: `error-${Date.now()}`,
        sender: 'chatbot',
        text: "I'm sorry, I'm having trouble connecting right now. Please try again or contact support if this continues.",
        timestamp: new Date().toISOString(),
        isBot: true
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const simulateAIResponse = async (userMessage: string) => {
    // Simple crisis detection
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'die', 'hopeless'];
    const hasCrisisKeywords = crisisKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );

    // Simulate typing delay
    setTimeout(() => {
      let responseText = "Thank you for sharing that with me. I'm here to listen and support you.";
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

      if (hasCrisisKeywords) {
        responseText = "I'm very concerned about what you've shared. Your safety is important to me. I want to connect you with immediate crisis resources.";
        riskLevel = 'high';
      } else if (userMessage.toLowerCase().includes('sad') || userMessage.toLowerCase().includes('depressed')) {
        responseText = "I hear that you're going through a difficult time. It takes courage to share these feelings. Can you tell me more about what's been weighing on your mind?";
        riskLevel = 'medium';
      } else if (userMessage.toLowerCase().includes('anxious') || userMessage.toLowerCase().includes('worried')) {
        responseText = "Anxiety can feel overwhelming. You're not alone in this. Would you like to try a breathing exercise together, or would you prefer to talk about what's causing these feelings?";
        riskLevel = 'medium';
      }

      const botMessage: Message = {
        _id: `bot-${Date.now()}`,
        sender: 'chatbot',
        text: responseText,
        timestamp: new Date().toISOString(),
        isBot: true,
        riskLevel
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Handle crisis detection
      if (hasCrisisKeywords) {
        handleCrisisDetection();
      }
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleCrisisDetection = () => {
    // Show crisis alert and redirect
    const crisisMessage: Message = {
      _id: `crisis-${Date.now()}`,
      sender: 'chatbot',
      text: "I'm connecting you with immediate crisis resources. If you're in immediate danger, please call emergency services (911) or go to your nearest emergency room.",
      timestamp: new Date().toISOString(),
      isBot: true,
      riskLevel: 'critical'
    };
    
    setMessages(prev => [...prev, crisisMessage]);
    
    // Redirect to crisis page after a short delay
    setTimeout(() => {
      navigate('/crisis');
    }, 3000);
  };

  const clearChat = async () => {
    try {
      if (currentSession?._id) {
        await apiService.closeSession(currentSession._id);
      }
      setMessages([]);
      setCurrentSession(null);
      await initializeSession();
    } catch (error) {
      console.error('Failed to clear chat:', error);
      // Clear locally anyway
      setMessages([]);
      setCurrentSession(null);
      await initializeSession();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <Layout currentRole={user?.role || "student"}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Initializing your session...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentRole={user?.role || "student"}>
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="bg-white border-b border-border p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AI Mental Health Companion</h1>
              <p className="text-sm text-muted-foreground">
                {currentSession?.crisis?.detected 
                  ? "Crisis support mode" 
                  : "Always here to listen and support"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>

        {/* Crisis Alert */}
        {currentSession?.crisis?.detected && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 mx-4 mt-4 rounded">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Crisis Support Activated</p>
                <p className="text-sm text-destructive/80">
                  If you're in immediate danger, please call emergency services or visit your nearest emergency room.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message._id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex gap-2 max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isBot ? 'bg-primary/10' : 'bg-blue-100'
                }`}>
                  {message.isBot ? (
                    <Bot className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <ChatBubble
                  message={message.text}
                  sender={message.isBot ? "assistant" : "user"}
                  timestamp={new Date(message.timestamp).toLocaleTimeString()}
                />
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <Card className="p-3 bg-gray-50 border border-border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              disabled={isTyping}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isTyping}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This AI provides support but is not a replacement for professional help. 
            If you're in crisis, please seek immediate professional assistance.
          </p>
        </div>
      </div>
    </Layout>
  );
}