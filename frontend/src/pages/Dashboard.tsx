/* Hallmark · theme: dusk (by request) · genre: modern-minimal · posture: committed */
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { MessageCircle, AlertTriangle, Brain, BookOpen, Clock, UserPlus, ArrowRight, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, createAnonymousSession } = useAuth();

  const handleAnonymousStart = async () => {
    try {
      await createAnonymousSession();
      navigate('/chatbot');
    } catch (error) {
      console.error('Failed to create anonymous session:', error);
    }
  };

  const handleStartChatbot = () => {
    if (isAuthenticated) {
      navigate('/chatbot');
    } else {
      navigate('/login');
    }
  };

  const handleTakeAssessment = () => {
    if (isAuthenticated) {
      navigate('/questionnaire/PHQ-9');
    } else {
      navigate('/login');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 px-6 border-b border-[var(--color-rule)] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,var(--color-paper-3),transparent_70%)]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-5xl font-display font-medium text-[var(--color-ink)] mb-4 tracking-tight">
              Welcome to your personal space.
            </h1>
            <p className="text-base text-[var(--color-muted)] mb-8 max-w-xl mx-auto leading-relaxed">
              Connect with our AI companion, trained community peers, or licensed counselors in a private, unhurried setting.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button size="lg" className="px-7 py-3 text-sm font-semibold" onClick={handleStartChatbot}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Start chat with AI
              </Button>
              <Button size="lg" variant="destructive" className="px-6 py-3 text-sm font-medium" onClick={() => navigate('/crisis')}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Crisis helpline (988)
              </Button>
              {!isAuthenticated && (
                <Button size="lg" variant="outline" className="px-6 py-3 text-sm font-medium" onClick={() => navigate('/register')}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create account
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Quick Actions for Authenticated Users */}
        {isAuthenticated && (
          <section className="py-14 px-6 border-b border-[var(--color-rule)]">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-display font-medium text-[var(--color-ink)]">
                    Quick actions
                  </h2>
                  <p className="text-xs text-[var(--color-muted)] mt-1">
                    Select a resource to begin today's session.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  className="glass p-6 cursor-pointer hover:border-[var(--color-accent)] transition-colors group flex flex-col justify-between"
                  onClick={handleTakeAssessment}
                >
                  <div>
                    <div className="w-10 h-10 rounded-[var(--radius-inner)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center mb-4 group-hover:border-[var(--color-accent)] transition-colors">
                      <BookOpen className="h-5 w-5 text-[var(--color-accent)]" />
                    </div>
                    <h3 className="text-base font-display font-medium text-[var(--color-ink)] mb-1">
                      Clinical assessment
                    </h3>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                      PHQ-9 screening and depression tracker
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--color-rule)] text-xs text-[var(--color-accent)] font-medium flex items-center justify-between">
                    <span>Begin test</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>

                <div
                  className="glass p-6 cursor-pointer hover:border-[var(--color-accent)] transition-colors group flex flex-col justify-between"
                  onClick={() => navigate('/peer/request')}
                >
                  <div>
                    <div className="w-10 h-10 rounded-[var(--radius-inner)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center mb-4 group-hover:border-[var(--color-accent)] transition-colors">
                      <MessageCircle className="h-5 w-5 text-[var(--color-accent-2)]" />
                    </div>
                    <h3 className="text-base font-display font-medium text-[var(--color-ink)] mb-1">
                      Peer support
                    </h3>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                      Connect with trained volunteer listeners
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--color-rule)] text-xs text-[var(--color-accent-2)] font-medium flex items-center justify-between">
                    <span>Find peer</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>

                <div
                  className="glass p-6 cursor-pointer hover:border-[var(--color-accent)] transition-colors group flex flex-col justify-between"
                  onClick={() => navigate('/counselor/request')}
                >
                  <div>
                    <div className="w-10 h-10 rounded-[var(--radius-inner)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center mb-4 group-hover:border-[var(--color-accent)] transition-colors">
                      <Clock className="h-5 w-5 text-[var(--color-accent)]" />
                    </div>
                    <h3 className="text-base font-display font-medium text-[var(--color-ink)] mb-1">
                      Professional help
                    </h3>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                      Consult with verified licensed therapists
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--color-rule)] text-xs text-[var(--color-accent)] font-medium flex items-center justify-between">
                    <span>Book session</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>

                <div
                  className="glass p-6 cursor-pointer hover:border-[var(--color-accent)] transition-colors group flex flex-col justify-between"
                  onClick={() => navigate('/meditation')}
                >
                  <div>
                    <div className="w-10 h-10 rounded-[var(--radius-inner)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center mb-4 group-hover:border-[var(--color-accent)] transition-colors">
                      <Brain className="h-5 w-5 text-[var(--color-accent-2)]" />
                    </div>
                    <h3 className="text-base font-display font-medium text-[var(--color-ink)] mb-1">
                      Meditation
                    </h3>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                      Guided breathing and grounding soundscapes
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--color-rule)] text-xs text-[var(--color-accent-2)] font-medium flex items-center justify-between">
                    <span>Start practice</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Support Capabilities Grid */}
        <section className="py-14 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-display font-medium text-[var(--color-ink)] mb-8">
              How we support your wellness
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded-[var(--radius-card)] p-7">
                <div className="w-10 h-10 rounded-[var(--radius-inner)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center mb-4">
                  <Brain className="h-5 w-5 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-lg font-display font-medium text-[var(--color-ink)] mb-2">
                  24/7 AI companion
                </h3>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  Always-available crisis-trained chatbot for immediate reflection, journaling, and grounding.
                </p>
              </div>

              <div className="bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded-[var(--radius-card)] p-7">
                <div className="w-10 h-10 rounded-[var(--radius-inner)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center mb-4">
                  <BookOpen className="h-5 w-5 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-lg font-display font-medium text-[var(--color-ink)] mb-2">
                  Validated screenings
                </h3>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  Standardized tools including PHQ-9 and GAD-7 to help you track emotional patterns over time.
                </p>
              </div>

              <div className="bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded-[var(--radius-card)] p-7">
                <div className="w-10 h-10 rounded-[var(--radius-inner)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center mb-4">
                  <Clock className="h-5 w-5 text-[oklch(84%_0.10_25)]" />
                </div>
                <h3 className="text-lg font-display font-medium text-[var(--color-ink)] mb-2">
                  Immediate crisis routing
                </h3>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  Instant connections to crisis lifelines and emergency intervention when you are in distress.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action for Guests */}
        {!isAuthenticated && (
          <section className="py-14 px-6 border-t border-[var(--color-rule)] bg-[var(--color-paper-2)]">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-display font-medium text-[var(--color-ink)] mb-3">
                Ready to begin your journey?
              </h2>
              <p className="text-xs text-[var(--color-muted)] mb-6 leading-relaxed">
                Join a quiet, private community dedicated to listening and mental health support.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button size="lg" className="px-7 py-3 text-xs font-semibold" onClick={() => navigate('/register')}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create account
                </Button>
                <Button size="lg" variant="outline" className="px-6 py-3 text-xs font-medium" onClick={handleAnonymousStart}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Try anonymously
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
