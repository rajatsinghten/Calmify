import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, User, Bot, AlertTriangle, Trash2, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  crisisDetected?: boolean;
}

export default function ChatbotPage() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, [isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeChat = () => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      text: `Hello${user?.profile?.preferredName ? ` ${user.profile.preferredName}` : ''}! I'm Dr. Sarah, a clinical psychologist here to support you. I specialize in helping people navigate their mental health journey with compassion and evidence-based approaches. How are you feeling today, and what would you like to talk about?`,
      isBot: true,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputMessage.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage.trim();
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await apiService.sendChatMessage(messageText, conversationId);

      if (response.success) {
        // Update conversation ID if this is the first message
        if (!conversationId && response.data.conversationId) {
          setConversationId(response.data.conversationId);
        }

        // Check for crisis detection
        if (response.data.crisisDetected) {
          setCrisisDetected(true);
        }

        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          text: response.data.response,
          isBot: true,
          timestamp: new Date(),
          crisisDetected: response.data.crisisDetected
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.error || 'Failed to get response');
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. If this continues, please consider reaching out to a crisis helpline if you need immediate support.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
    setCrisisDetected(false);
    initializeChat();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
              <h1 className="text-lg font-semibold text-foreground">Dr. Sarah - AI Psychology Expert</h1>
              <p className="text-sm text-muted-foreground">
                {crisisDetected 
                  ? "Crisis support mode - I'm here to help" 
                  : "Compassionate mental health support"}
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
            New Chat
          </Button>
        </div>

        {/* Crisis Alert */}
        {crisisDetected && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 mx-4 mt-4 rounded">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Crisis Support Resources</p>
                <p className="text-sm text-destructive/80">
                  If you're in immediate danger, please call 911. For crisis support: National Suicide Prevention Lifeline at 988, or Crisis Text Line by texting HOME to 741741.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex gap-3 max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isBot ? 'bg-primary/10' : 'bg-blue-100'
                }`}>
                  {message.isBot ? (
                    <Bot className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <Card className={`p-3 ${
                  message.isBot 
                    ? 'bg-gray-50 border border-border' 
                    : 'bg-blue-50 border border-blue-200'
                } ${message.crisisDetected ? 'border-l-4 border-l-destructive' : ''}`}>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </Card>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <Card className="p-3 bg-gray-50 border border-border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Dr. Sarah is typing...</p>
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
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              This is an AI psychology expert. For emergencies, call 911 or crisis helplines.
            </p>
            {conversationId && (
              <p className="text-xs text-muted-foreground">
                Conversation history maintained
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}