import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import { useChatSocket } from "../hooks/useSocket";
import { Layout } from "@/components/Layout";
import { ChatBubble } from "@/components/ChatBubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, AlertTriangle, Clock, FileText, MessageCircle, CheckCircle, XCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Session {
  _id: string;
  patientId: {
    _id: string;
    username: string;
    profile?: {
      preferredName?: string;
      firstName?: string;
    };
  };
  helperType: string;
  status: 'waiting' | 'active' | 'closed' | 'escalated';
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  title?: string;
  description?: string;
  createdAt: string;
  startedAt?: string;
  waitingMinutes?: number;
  messageCount?: number;
}

interface Message {
  _id: string;
  sessionId: string;
  senderId: {
    _id: string;
    username: string;
    profile?: {
      preferredName?: string;
      firstName?: string;
    };
  };
  message: string;
  senderRole: 'patient' | 'peer' | 'counselor' | 'admin' | 'chatbot';
  messageType: 'text' | 'image' | 'file';
  createdAt: string;
  crisisDetected?: boolean;
}

export default function CounselorSessionPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [availableSessions, setAvailableSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closeRating, setCloseRating] = useState<number>(0);
  const [closeFeedback, setCloseFeedback] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Socket.IO integration for real-time chat
  const socket = useChatSocket(currentSession?._id);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'counselor') {
      navigate('/login');
      return;
    }
    
    loadAvailableSessions();
  }, [isAuthenticated, user, navigate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [socket.messages]);

  const loadAvailableSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAvailableSessions();
      setAvailableSessions(response.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setError('Failed to load available sessions');
    } finally {
      setLoading(false);
    }
  };

  const acceptSession = async (session: Session) => {
    try {
      setLoading(true);
      setError(null);
      
      await apiService.acceptSession(session._id, "Hello! I'm a licensed professional counselor. I'm here to provide you with compassionate, evidence-based support. How are you feeling today?");
      
      // Join the Socket.IO room for this session
      socket.joinSession(session._id);
      
      setCurrentSession({
        ...session,
        status: 'active',
        startedAt: new Date().toISOString()
      });
      
      // Remove from available sessions
      setAvailableSessions(prev => prev.filter(s => s._id !== session._id));
    } catch (error) {
      console.error('Failed to accept session:', error);
      setError('Failed to accept session');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !currentSession) return;

    const messageText = newMessage.trim();
    setNewMessage("");

    try {
      // Send through Socket.IO for real-time delivery
      socket.sendMessage(messageText, 'text');
      
      // Also send through API for persistence
      await apiService.sendMessage({
        sessionId: currentSession._id,
        message: messageText,
        messageType: 'text'
      });
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message');
      // Restore message text on error
      setNewMessage(messageText);
    }
  }, [newMessage, currentSession, socket]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openCloseDialog = () => {
    setShowCloseDialog(true);
  };

  const endSession = async () => {
    if (!currentSession) return;

    try {
      setLoading(true);
      await apiService.closeSession(
        currentSession._id,
        closeRating || undefined,
        closeFeedback.trim() || "Session completed - professional support provided"
      );
      
      // Leave the Socket.IO room
      socket.leaveSession(currentSession._id);
      
      setCurrentSession(null);
      setNotes("");
      setCloseRating(0);
      setCloseFeedback("");
      setShowCloseDialog(false);
      await loadAvailableSessions();
    } catch (error) {
      console.error('Failed to end session:', error);
      setError('Failed to end session');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'counselor') {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You need to be logged in as a licensed counselor to access this page.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-full bg-background">
        {/* Session List Sidebar */}
        <div className="w-80 bg-white border-r border-border p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Available Sessions</h2>
              <Button variant="outline" size="sm" onClick={loadAvailableSessions}>
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading sessions...</p>
              </div>
            ) : availableSessions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No sessions available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableSessions.map((session) => (
                  <Card key={session._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-foreground">
                              Session #{session._id.slice(-6)}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Patient: {session.patientId.profile?.preferredName || 
                                       session.patientId.profile?.firstName || 
                                       session.patientId.username}
                            </p>
                          </div>
                          <Badge 
                            variant={session.severity === 'critical' ? 'destructive' : 
                                   session.severity === 'severe' ? 'destructive' : 
                                   session.severity === 'moderate' ? 'default' : 'secondary'}
                          >
                            {session.severity}
                          </Badge>
                        </div>
                        
                        <Button 
                          size="sm" 
                          onClick={() => acceptSession(session)}
                          className="w-full"
                          disabled={loading}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Accept Session
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentSession ? (
            <>
              {/* Header */}
              <div className="bg-white border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-lg font-semibold text-foreground">
                      Professional Session - Patient {currentSession.patientId.profile?.preferredName || 
                                                   currentSession.patientId.profile?.firstName || 
                                                   currentSession.patientId.username}
                    </h1>
                    <Badge variant="default" className="mt-2">
                      {currentSession.severity} severity
                    </Badge>
                  </div>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={openCloseDialog}
                  >
                    End Session
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {socket.messages.map((message) => (
                  <div key={message._id}>
                    <div className={`flex ${message.senderRole === 'counselor' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-2 max-w-[80%] ${message.senderRole === 'counselor' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.senderRole === 'counselor' ? 'bg-primary/10' : 'bg-blue-100'
                        }`}>
                          {message.senderRole === 'counselor' ? (
                            <FileText className="h-4 w-4 text-primary" />
                          ) : (
                            <User className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <ChatBubble
                          message={message.message}
                          sender={message.senderRole === 'counselor' ? 'assistant' : 'user'}
                          timestamp={new Date(message.createdAt).toLocaleTimeString()}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="bg-white border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type professional response..."
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Ready for Sessions</h2>
                <p className="text-muted-foreground mb-4">
                  Accept a session from the sidebar to begin professional counseling
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close Session Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Session</DialogTitle>
            <DialogDescription>
              You're about to end this counseling session. Please provide a rating and session summary.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rating">How would you rate this session?</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCloseRating(star)}
                    className={`w-8 h-8 flex items-center justify-center ${
                      star <= closeRating 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  >
                    <Star className={`w-6 h-6 ${star <= closeRating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="feedback">Session summary</Label>
              <Textarea
                id="feedback"
                value={closeFeedback}
                onChange={(e) => setCloseFeedback(e.target.value)}
                placeholder="Brief summary of the session outcome and next steps..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={endSession} disabled={loading}>
              {loading ? 'Ending...' : 'End Session'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
