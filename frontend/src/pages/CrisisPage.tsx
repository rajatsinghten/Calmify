import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle, ExternalLink, MapPin, Clock, AlertTriangle, Heart, Shield, Users, Stethoscope, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sage = '#A398C9';
const dusty = '#7A9BB0';
const coral = '#C9B398';

const CRISIS_HOTLINES = [
  {
    name: "Tele-MANAS Helpline (Govt of India)",
    number: "1800-891-4416",
    description: "Free, 24/7 mental health counseling and support",
    available: "24/7"
  },
  {
    name: "KIRAN Mental Health Helpline (Govt of India)",
    number: "1800-599-0019",
    description: "Professional rehabilitation & cognitive support",
    available: "24/7"
  },
  {
    name: "Vandrevala Foundation Helpline",
    number: "+91 9999 666 555",
    description: "Free and confidential emotional support for distress",
    available: "24/7"
  },
  {
    name: "AASRA Helpline",
    number: "+91 98204 66726",
    description: "Confidential suicide prevention support",
    available: "24/7"
  },
  {
    name: "National Emergency Helpline",
    number: "112",
    description: "All-in-one emergency helpline across India",
    available: "24/7"
  }
];

const EMERGENCY_ACTIONS = [
  {
    title: "Call Emergency Services (112)",
    description: "If you are in immediate danger of hurting yourself or others",
    action: "Call 112",
    urgent: true,
    handler: () => window.open('tel:112')
  },
  {
    title: "Tele-MANAS Helpline (1800-891-4416)",
    description: "Toll-free 24/7 national tele-mental health programme",
    action: "Call 1800-891-4416",
    urgent: true,
    handler: () => window.open('tel:18008914416')
  },
  {
    title: "KIRAN Helpline (1800-599-0019)",
    description: "Dedicated mental health helpline by Govt of India",
    action: "Call 1800-599-0019",
    urgent: false,
    handler: () => window.open('tel:18005990019')
  },
  {
    title: "Go to Nearest Hospital",
    description: "Emergency rooms are open 24/7 and equipped to help with psychiatric emergencies",
    action: "Find Emergency Room",
    urgent: false,
    handler: () => window.open('https://www.google.com/maps/search/nearest+hospital+emergency+room')
  }
];

const IMMEDIATE_RESOURCES = [
  {
    title: "Breathing Exercise",
    description: "Try 4-7-8 breathing: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times.",
    action: "Try Exercise",
    category: "Coping Tool"
  },
  {
    title: "Grounding Technique (5-4-3-2-1)",
    description: "Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
    action: "Practice Grounding",
    category: "Coping Tool"
  },
  {
    title: "Safety Plan Template",
    description: "Identify your warning signs, coping strategies, and people who can support you during a crisis.",
    action: "View Safety Plan",
    category: "Planning Tool"
  }
];

export default function CrisisPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCallNumber = (number: string) => {
    window.open(`tel:${number.replace(/[^0-9+]/g, '')}`);
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-background text-foreground transition-colors duration-500">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Emergency Alert */}
          <Alert 
            className="border shadow-lg duration-500 rounded-3xl bg-destructive/15 border-destructive/30"
          >
            <div className="flex items-start gap-4 p-2">
              <div className="rounded-full p-2.5 flex-shrink-0 bg-destructive/30">
                <AlertTriangle className="h-5 w-5 text-destructive" strokeWidth={1.5} />
              </div>
              <AlertDescription className="font-medium text-base flex-1 text-foreground">
                <strong className="block text-lg mb-1 font-heading text-destructive">Crisis Support Resources Available Now</strong>
                <p className="text-muted-foreground leading-relaxed">If you're having thoughts of hurting yourself or others, please reach out for immediate help. You are not alone, and support is available 24/7.</p>
              </AlertDescription>
            </div>
          </Alert>

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="rounded-2xl p-3 shadow-md bg-primary/20">
                <Heart className="h-9 w-9 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground">
              Crisis Support
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-muted-foreground">
              You matter. Your life has value. Help is available 24/7, and trained professionals are ready to support you right now.
            </p>
          </div>

          {/* Immediate Actions */}
          <Card className="rounded-3xl shadow-xl border border-border bg-card/90 backdrop-blur-md">
            <CardHeader className="border-b border-border bg-card/50">
              <CardTitle className="flex items-center gap-3 text-xl font-heading font-bold text-foreground">
                <div className="rounded-xl p-2.5 bg-destructive/15">
                  <AlertTriangle className="h-5 w-5 text-destructive" strokeWidth={1.5} />
                </div>
                Immediate Actions
              </CardTitle>
              <CardDescription className="text-sm mt-1 text-muted-foreground">
                If you're in crisis, here are your immediate options for getting help
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {EMERGENCY_ACTIONS.map((action, index) => (
                  <Card 
                    key={index} 
                    onClick={action.handler}
                    className={`transition-all duration-300 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 cursor-pointer bg-card/60 ${
                      action.urgent ? 'border-destructive/40 hover:border-destructive' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className={`font-heading font-bold text-base mb-2 ${action.urgent ? 'text-destructive' : 'text-foreground'}`}>
                            {action.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                        {action.urgent && (
                          <Badge className="ml-2 px-2.5 py-0.5 text-xs font-semibold rounded-full border-0 bg-destructive/20 text-destructive animate-pulse">
                            URGENT
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Crisis Hotlines */}
          <Card className="rounded-3xl shadow-xl border border-border bg-card/90 backdrop-blur-md">
            <CardHeader className="border-b border-border bg-card/50">
              <CardTitle className="flex items-center gap-3 text-xl font-heading font-bold text-foreground">
                <div className="rounded-xl p-2.5 bg-secondary/30">
                  <Phone className="h-5 w-5 text-secondary-foreground" strokeWidth={1.5} />
                </div>
                Crisis Hotlines
              </CardTitle>
              <CardDescription className="text-sm mt-1 text-muted-foreground">
                Free, confidential support available now - you can call or text anytime
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              {CRISIS_HOTLINES.map((hotline, index) => (
                <div 
                  key={index} 
                  className="border border-border rounded-2xl p-5 space-y-4 bg-card/50 hover:bg-card hover:border-primary/40 transition-all duration-300 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 space-y-1.5">
                      <h3 className="font-heading font-bold text-base text-foreground">{hotline.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{hotline.description}</p>
                      <div className="flex items-center gap-2 pt-1 text-muted-foreground">
                        <Clock className="h-4 w-4" strokeWidth={1.5} />
                        <span className="text-xs font-medium">{hotline.available}</span>
                      </div>
                    </div>
                    <div>
                      <Badge 
                        variant="outline" 
                        className="px-3 py-1 font-semibold rounded-full border-border text-xs bg-muted/40 text-foreground"
                      >
                        {hotline.available.includes('24/7') ? '24/7 Available' : 'Limited Hours'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button 
                      onClick={() => handleCallNumber(hotline.number)} 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-300 rounded-full px-6 py-2 h-auto text-sm font-semibold"
                    >
                      <Phone className="h-4 w-4 mr-2" strokeWidth={1.5} />
                      Call {hotline.number}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Immediate Resources */}
          <Card className="rounded-3xl shadow-xl border border-border bg-card/90 backdrop-blur-md">
            <CardHeader className="border-b border-border bg-card/50">
              <CardTitle className="text-xl font-heading font-bold flex items-center gap-3 text-foreground">
                <div className="rounded-xl p-2.5 bg-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                Immediate Resources
              </CardTitle>
              <CardDescription className="text-sm mt-1 text-muted-foreground">
                Tools and resources to help you right now
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {IMMEDIATE_RESOURCES.map((resource, index) => (
                  <Card 
                    key={index} 
                    className="group transition-all duration-300 rounded-2xl hover:shadow-lg bg-card/50 hover:bg-card border border-border hover:border-primary/40"
                  >
                    <CardContent className="p-6 text-center relative flex flex-col justify-between h-full min-h-[220px]">
                      <div>
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-primary/15 shadow-sm">
                          <ExternalLink className="h-5 w-5 text-primary" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-heading font-bold text-base mb-2 text-foreground">{resource.title}</h3>
                        <p className="text-xs mb-5 leading-relaxed text-muted-foreground">{resource.description}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full font-semibold rounded-full border-border hover:bg-primary/15 hover:text-primary"
                      >
                        {resource.action}
                        <ExternalLink className="h-3 w-3 ml-1.5" strokeWidth={1.5} />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Local Resources */}
          <Card className="rounded-3xl shadow-xl border border-border bg-card/90 backdrop-blur-md">
            <CardHeader className="border-b border-border bg-card/50">
              <CardTitle className="flex items-center gap-3 text-xl font-heading font-bold text-foreground">
                <div className="rounded-xl p-2.5 bg-secondary/30">
                  <MapPin className="h-5 w-5 text-secondary-foreground" strokeWidth={1.5} />
                </div>
                Find Local Help
              </CardTitle>
              <CardDescription className="text-sm mt-1 text-muted-foreground">
                Locate mental health services and emergency resources near you
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Emergency Rooms", text: "Find the nearest hospital", icon: AlertTriangle, color: '#e05252' },
                  { title: "Mental Health Centers", text: "Community mental health services", icon: Stethoscope, color: sage },
                  { title: "Crisis Centers", text: "Local crisis intervention", icon: Shield, color: '#e05252' },
                  { title: "Support Groups", text: "Peer support meetings", icon: Users, color: dusty },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Button 
                      key={idx}
                      variant="outline" 
                      className="h-auto p-5 justify-start border border-border transition-all duration-300 group rounded-2xl bg-card/50 hover:bg-card hover:border-primary/50"
                    >
                      <div className="text-left flex items-center gap-4 w-full">
                        <div className="rounded-xl p-3 bg-muted/60">
                          <Icon className="h-5 w-5" style={{ color: item.color }} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-heading font-bold text-sm mb-0.5 text-foreground">{item.title}</div>
                          <div className="text-xs truncate text-muted-foreground">{item.text}</div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Return to Safety */}
          <div 
            className="text-center space-y-6 p-8 rounded-3xl border border-primary/20 bg-primary/10 shadow-lg"
          >
            <div className="flex justify-center">
              <div className="rounded-full p-4 shadow-sm bg-card border border-border">
                <Heart className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Remember: This Will Pass
            </h2>
            <p className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed text-muted-foreground">
              Crisis feelings are temporary. With support and time, things can and do get better. 
              You've taken a brave step by seeking help. We're here for you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Button 
                onClick={() => navigate('/chatbot')} 
                variant="outline"
                className="px-6 py-2.5 h-auto text-sm font-semibold rounded-full border-border bg-card hover:bg-card/80 text-foreground"
              >
                <MessageCircle className="h-4 w-4 mr-2" strokeWidth={1.5} />
                Continue AI Support
              </Button>
              <Button 
                onClick={() => navigate('/peer/request')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm px-6 py-2.5 h-auto text-sm font-semibold rounded-full"
              >
                <Users className="h-4 w-4 mr-2" strokeWidth={1.5} />
                Talk to Peer Support
              </Button>
              <Button 
                onClick={() => navigate('/counselor/request')}
                className="bg-accent hover:bg-accent/80 text-accent-foreground shadow-sm px-6 py-2.5 h-auto text-sm font-semibold rounded-full"
              >
                <Stethoscope className="h-4 w-4 mr-2" strokeWidth={1.5} />
                Find Professional Help
              </Button>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center text-xs p-6 border border-border rounded-2xl bg-card/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <p className="font-semibold text-foreground">Important Safety Information</p>
            </div>
            <p className="max-w-2xl mx-auto leading-relaxed text-muted-foreground">
              If you're experiencing a medical emergency, call <strong className="text-destructive">112</strong> immediately. 
              This platform provides support but is not a substitute for professional emergency services.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
