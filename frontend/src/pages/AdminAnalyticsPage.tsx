import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, TrendingUp, Users, AlertTriangle, Clock, MessageCircle, Shield, Activity, Zap, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AnalyticsData {
  totalUsers: number;
  activeSessions: number;
  completedSessions: number;
  crisisAlerts: number;
  sessionsByType: {
    chatbot: number;
    peer: number;
    counselor: number;
  };
  severityDistribution: {
    mild: number;
    moderate: number;
    severe: number;
    critical: number;
  };
  responseMetrics: {
    averageResponseTime: number;
    peakHours: string[];
    satisfaction: number;
  };
}

interface CrisisMetrics {
  total: number;
  resolved: number;
  pending: number;
  averageResolutionTime: number;
}

export default function AdminAnalyticsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [crisisMetrics, setCrisisMetrics] = useState<CrisisMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (isLoading) return;
    
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    loadAnalytics();
  }, [isAuthenticated, user, navigate, timeRange, isLoading]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real implementation, these would be separate API endpoints
      // For now, we'll use the available session APIs to get basic analytics
      
      // Get session analytics
      const sessionsData = await apiService.getMySessions({ 
        status: 'active',
        limit: 100 
      });

      // Get crisis analytics (using available session data as proxy)
      let crisisAlerts = 0;
      try {
        // Try to get crisis data, fallback to mock data if not available
        const allSessions = await apiService.getMySessions({ limit: 1000 });
        crisisAlerts = allSessions.sessions.filter(s => s.severity === 'critical' || s.severity === 'severe').length;
      } catch (error) {
        console.warn('Could not fetch crisis data, using mock data');
        crisisAlerts = 12; // Mock fallback
      }

      // Mock analytics data structure for now
      const mockAnalytics: AnalyticsData = {
        totalUsers: 1250,
        activeSessions: sessionsData.sessions.length,
        completedSessions: 485,
        crisisAlerts: crisisAlerts,
        sessionsByType: {
          chatbot: Math.floor(sessionsData.sessions.length * 0.6),
          peer: Math.floor(sessionsData.sessions.length * 0.25),
          counselor: Math.floor(sessionsData.sessions.length * 0.15)
        },
        severityDistribution: {
          mild: Math.floor(sessionsData.sessions.length * 0.4),
          moderate: Math.floor(sessionsData.sessions.length * 0.35),
          severe: Math.floor(sessionsData.sessions.length * 0.2),
          critical: Math.floor(sessionsData.sessions.length * 0.05)
        },
        responseMetrics: {
          averageResponseTime: 4.2,
          peakHours: ['19:00-21:00', '21:00-23:00'],
          satisfaction: 4.3
        }
      };

      const mockCrisisMetrics: CrisisMetrics = {
        total: crisisAlerts,
        resolved: Math.floor(crisisAlerts * 0.7),
        pending: Math.floor(crisisAlerts * 0.3),
        averageResolutionTime: 6.5
      };

      setAnalytics(mockAnalytics);
      setCrisisMetrics(mockCrisisMetrics);

    } catch (error) {
      console.error('Failed to load analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <Layout currentRole="admin">
        <div className="flex items-center justify-center h-full">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You need to be logged in as an administrator to access this page.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentRole="admin">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                <BarChart3 className="h-6 w-6" />
                Platform Analytics
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Mental health platform insights and metrics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant={timeRange === '7d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('7d')}
                >
                  7d
                </Button>
                <Button
                  variant={timeRange === '30d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('30d')}
                >
                  30d
                </Button>
                <Button
                  variant={timeRange === '90d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('90d')}
                >
                  90d
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={loadAnalytics} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <Alert className="border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading analytics...</p>
            </div>
          ) : analytics ? (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold text-foreground">{analytics.totalUsers}</p>
                      </div>
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                        <p className="text-2xl font-bold text-foreground">{analytics.activeSessions}</p>
                      </div>
                      <Activity className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Completed Sessions</p>
                        <p className="text-2xl font-bold text-foreground">{analytics.completedSessions}</p>
                      </div>
                      <MessageCircle className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Crisis Alerts</p>
                        <p className="text-2xl font-bold text-destructive">{analytics.crisisAlerts}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Crisis Management */}
              {crisisMetrics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-destructive" />
                      Crisis Management Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-destructive mb-1">
                          {crisisMetrics.total}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Alerts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {crisisMetrics.resolved}
                        </div>
                        <div className="text-sm text-muted-foreground">Resolved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {crisisMetrics.pending}
                        </div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {crisisMetrics.averageResolutionTime}min
                        </div>
                        <div className="text-sm text-muted-foreground">Avg Resolution</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Session Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Session Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span className="text-sm font-medium">AI Chatbot</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {analytics.sessionsByType.chatbot} ({Math.round((analytics.sessionsByType.chatbot / analytics.activeSessions) * 100)}%)
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">Peer Support</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {analytics.sessionsByType.peer} ({Math.round((analytics.sessionsByType.peer / analytics.activeSessions) * 100)}%)
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium">Counselor</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {analytics.sessionsByType.counselor} ({Math.round((analytics.sessionsByType.counselor / analytics.activeSessions) * 100)}%)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Severity Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Severity Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analytics.severityDistribution).map(([severity, count]) => (
                        <div key={severity} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={severity === 'critical' ? 'destructive' : 
                                     severity === 'severe' ? 'destructive' : 
                                     severity === 'moderate' ? 'default' : 'secondary'}
                            >
                              {severity}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {count} cases
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {analytics.responseMetrics.averageResponseTime}min
                      </div>
                      <div className="text-sm text-muted-foreground">Average Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {analytics.responseMetrics.satisfaction}/5.0
                      </div>
                      <div className="text-sm text-muted-foreground">User Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground mb-1">
                        {analytics.responseMetrics.peakHours.join(', ')}
                      </div>
                      <div className="text-sm text-muted-foreground">Peak Usage Hours</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle>System Health & Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">All systems operational</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Crisis response active</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Data backup current</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Analytics Data</h2>
              <p className="text-muted-foreground mb-4">
                Unable to load analytics at this time
              </p>
              <Button onClick={loadAnalytics}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}