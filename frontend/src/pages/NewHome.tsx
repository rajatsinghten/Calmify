/* Hallmark · theme: dusk (by request) · genre: modern-minimal · posture: committed */
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Users, MessageCircle, Brain, Heart, ArrowRight, Lock, Phone, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function useFadeInOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

export default function NewHome() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'peer' | 'counselor'>('ai');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features_fade = useFadeInOnScroll();
  const howItWorks_fade = useFadeInOnScroll();
  const trust_fade = useFadeInOnScroll();

  const previewContent = {
    ai: {
      tag: "Immediate AI companion",
      title: "Active listening and grounding whenever you need an ear",
      message: "It sounds like you've been carrying a heavy weight lately. Would you like to try a 2-minute 4-7-8 breathing exercise together, or simply talk through what happened today?",
      options: ["Start 2-min breathing exercise", "I just want to vent", "Connect me to a real person"],
      meta: "Always on · Completely confidential · Crisis-trained"
    },
    peer: {
      tag: "Trained peer volunteers",
      title: "Shared lived experience with someone who understands",
      message: "Hey there. I'm Alex — I went through severe academic anxiety during my college years. You're completely safe here, and you can share as much or as little as you feel comfortable with.",
      options: ["Request a peer match", "View volunteer profiles", "Learn how peers are vetted"],
      meta: "Anonymous chat · Trained listeners · Community support"
    },
    counselor: {
      tag: "Licensed therapists",
      title: "Professional mental healthcare for structured guidance",
      message: "Welcome to confidential counseling. We work together on evidence-based strategies (CBT, DBT, mindfulness) tailored to your personal goals and mental wellness plan.",
      options: ["Book initial intake session", "Browse licensed specialists", "Emergency support"],
      meta: "Verified credentials · Encrypted clinical notes · Crisis escalation"
    }
  };

  const capabilities = [
    {
      step: "01",
      icon: Brain,
      title: "Empathetic AI companion",
      description: "Available 24 hours a day for crisis de-escalation, guided mindfulness, and active listening without judgment or appointment delays."
    },
    {
      step: "02",
      icon: Users,
      title: "Peer volunteer network",
      description: "Connect 1-on-1 with trained community volunteers who understand the reality of burnout, isolation, and academic or career pressure."
    },
    {
      step: "03",
      icon: MessageCircle,
      title: "Licensed counseling",
      description: "Access certified therapists and clinical counselors for comprehensive psychotherapy, personalized wellness plans, and crisis intervention."
    },
    {
      step: "04",
      icon: Shield,
      title: "Complete privacy protection",
      description: "Anonymous sessions with zero identity verification required. End-to-end encrypted chats and automated session wiping upon exit."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] selection:bg-[var(--color-accent)] selection:text-[var(--color-accent-ink)]">

      {/* ── Top Navigation ── */}
      <nav
        className={`fixed w-full z-50 transition-colors duration-200 ${
          isScrolled
            ? 'bg-[var(--glass)] backdrop-blur-[22px] border-b border-[var(--color-rule)] shadow-[var(--shadow-card)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/meditation-white.png" alt="Calmify" className="h-6 w-6 object-contain" />
            <span className="font-display text-lg tracking-tight text-[var(--color-ink)] font-medium">
              Calmify
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-[var(--color-muted)]">
            <a href="#capabilities" className="hover:text-[var(--color-ink)] transition-colors">Capabilities</a>
            <a href="#how-it-works" className="hover:text-[var(--color-ink)] transition-colors">How it works</a>
            <a href="#privacy" className="hover:text-[var(--color-ink)] transition-colors">Privacy & safety</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] px-3 py-2 transition-colors font-medium"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[var(--color-accent)] text-[var(--color-accent-ink)] px-4 py-2 rounded-[var(--radius-pill)] hover:bg-[var(--color-accent-hi)] transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
            >
              <span>Get started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden">
        {/* Dusk Landscape Wallpaper Background */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <img
            src="/dusk-bg.jpg"
            alt="Dusk landscape"
            className="w-full h-full object-cover object-center opacity-40 scale-100"
          />
          {/* Natural Dusk Scrim: Fades gently into slate paper */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-paper)]/30 via-[var(--color-paper)]/75 to-[var(--color-paper)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_35%,transparent_20%,var(--color-paper)_90%)]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-[4rem] font-display font-medium tracking-[-0.025em] text-[var(--color-ink)] leading-[1.08] mb-6">
            Your mental health, supported at the calm end of the day.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[var(--color-ink-2)] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            A quiet space combining immediate crisis-trained AI companionship, vetted peer listeners, and licensed therapists whenever life feels heavy.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-accent-ink)] px-7 py-3 rounded-[var(--radius-pill)] font-semibold text-sm hover:bg-[var(--color-accent-hi)] transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
            >
              <span>Start free and anonymous</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/crisis')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[oklch(22%_0.05_25)] text-[oklch(84%_0.10_25)] border border-[oklch(38%_0.08_25)] px-6 py-3 rounded-[var(--radius-pill)] font-medium text-sm hover:bg-[oklch(26%_0.06_25)] transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Crisis helpline (988)</span>
            </button>
          </div>

          {/* Signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--color-muted)]">
            <span>Anonymous sessions</span>
            <span className="text-[var(--color-rule)]">/</span>
            <span>Zero waitlist</span>
            <span className="text-[var(--color-rule)]">/</span>
            <span>End-to-end encrypted</span>
          </div>
        </div>

        {/* ── Hero Smoked Glass Interactive Preview ── */}
        <div className="max-w-3xl mx-auto mt-14 relative z-10">
          <div className="glass p-6 sm:p-8">
            
            {/* Header row with tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[var(--color-rule)] gap-4">
              

              {/* Tabs as a ruled list with active dot */}
              <div className="flex items-center gap-1.5 bg-[var(--color-paper-3)] p-1 rounded-[var(--radius-pill)] border border-[var(--color-rule)]">
                {(['ai', 'peer', 'counselor'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-[var(--radius-pill)] text-xs font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold shadow-sm'
                        : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                    }`}
                  >
                    {tab === 'ai' ? 'AI Bot' : tab === 'peer' ? 'Peer' : 'Counselor'}
                  </button>
                ))}
              </div>
            </div>

            {/* Content for active level */}
            <div className="pt-6 space-y-4">
              <span className="text-xs text-[var(--color-accent-2)] font-medium block">
                {previewContent[activeTab].tag}
              </span>

              <h3 className="font-display text-xl sm:text-2xl text-[var(--color-ink)] font-medium">
                {previewContent[activeTab].title}
              </h3>

              {/* Message block in smoked glass tier */}
              <div className="bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded-[var(--radius-inner)] p-4 sm:p-5 text-sm text-[var(--color-ink-2)] leading-relaxed">
                "{previewContent[activeTab].message}"
              </div>

              {/* Action pill rows */}
              <div className="flex flex-wrap gap-2 pt-2">
                {previewContent[activeTab].options.map((option, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-pill)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-xs text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                    onClick={() => navigate('/register')}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    {option}
                  </span>
                ))}
              </div>

              {/* Card footer */}
              <div className="pt-4 border-t border-[var(--color-rule)] flex items-center justify-between text-xs text-[var(--color-muted)]">
                <span>{previewContent[activeTab].meta}</span>
                <span
                  onClick={() => navigate('/register')}
                  className="text-[var(--color-accent)] hover:underline cursor-pointer inline-flex items-center gap-1 font-medium"
                >
                  Try now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ruled Tally / System Strip ── */}
      <section className="border-y border-[var(--color-rule)] bg-[var(--color-paper-2)]">
        <div className="max-w-6xl mx-auto px-6 py-9">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-display text-3xl md:text-4xl text-[var(--color-ink)] font-medium mb-1 num">24/7</div>
              <div className="text-xs text-[var(--color-muted)]">Immediate AI companion</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl text-[var(--color-ink)] font-medium mb-1 num">100%</div>
              <div className="text-xs text-[var(--color-muted)]">Anonymous session option</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl text-[var(--color-ink)] font-medium mb-1 num">&lt; 1 min</div>
              <div className="text-xs text-[var(--color-muted)]">Average connection speed</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl text-[var(--color-ink)] font-medium mb-1">Licensed</div>
              <div className="text-xs text-[var(--color-muted)]">Therapists and trained peers</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities Section ── */}
      <section id="capabilities" className="py-24 px-6" ref={features_fade.ref}>
        <div
          className={`max-w-6xl mx-auto transition-opacity duration-300 ${
            features_fade.isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="max-w-2xl mb-14">
            <span className="text-xs text-[var(--color-accent)] font-medium block mb-2">Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-display font-medium text-[var(--color-ink)] mb-3">
              Care designed around what you need right now.
            </h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Mental health support should never be rigid. Calmify gives you three clear levels of guidance, from silent exercises to professional psychotherapy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {capabilities.map((item) => (
              <div
                key={item.step}
                className="glass p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-[var(--radius-inner)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[var(--color-accent)]" />
                    </div>
                    <span className="text-xs text-[var(--color-muted)] font-medium">{item.step}</span>
                  </div>
                  <h3 className="font-display text-xl text-[var(--color-ink)] font-medium mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-[var(--color-paper-2)] border-t border-[var(--color-rule)]" ref={howItWorks_fade.ref}>
        <div
          className={`max-w-6xl mx-auto transition-opacity duration-300 ${
            howItWorks_fade.isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="max-w-2xl mb-14">
            <span className="text-xs text-[var(--color-accent-2)] font-medium block mb-2">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-display font-medium text-[var(--color-ink)] mb-3">
              Support without friction, in three steps.
            </h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              No mandatory legal names, and no payment forms before you can even speak with someone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Open an anonymous chat",
                desc: "Choose an alias or enter as a guest to immediately share what is on your mind with our AI companion."
              },
              {
                step: "02",
                title: "Choose your level of care",
                desc: "Stay with the AI for breathing and grounding, or request to be connected with a peer or licensed therapist."
              },
              {
                step: "03",
                title: "Leave or stay connected",
                desc: "Save your progress securely with an encrypted account or wipe the conversation clean as soon as you close the tab."
              }
            ].map((step) => (
              <div
                key={step.step}
                className="bg-[var(--color-paper)] border border-[var(--color-rule)] rounded-[var(--radius-card)] p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs text-[var(--color-accent)] font-medium mb-3">
                    Step {step.step}
                  </div>
                  <h3 className="font-display text-lg text-[var(--color-ink)] font-medium mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Privacy & Trust Card ── */}
      <section id="privacy" className="py-24 px-6" ref={trust_fade.ref}>
        <div
          className={`max-w-5xl mx-auto glass p-8 sm:p-12 transition-opacity duration-300 ${
            trust_fade.isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs text-[var(--color-accent)] font-medium block mb-2">Safety and ethics</span>
              <h2 className="text-3xl font-display font-medium text-[var(--color-ink)] leading-tight mb-4">
                Your vulnerability deserves absolute privacy.
              </h2>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-6">
                Calmify is built on the standard that mental health support must be safe to explore. We never sell behavioral data, we support full anonymity, and our clinical protocols follow HIPAA guidelines.
              </p>

              <div className="space-y-3">
                {[
                  "End-to-end encrypted messaging",
                  "Anonymous sessions with one click",
                  "Crisis protocol with immediate helpline routing",
                  "Zero advertising and no data brokerage"
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[var(--color-ink-2)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to action card */}
            <div className="bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded-[var(--radius-card)] p-8 text-center shadow-[var(--shadow-card)]">
              <div className="w-12 h-12 rounded-full bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center mx-auto mb-4">
                <Heart className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <h3 className="font-display text-2xl text-[var(--color-ink)] font-medium mb-2">
                Ready to take a breath?
              </h3>
              <p className="text-xs text-[var(--color-muted)] mb-6 max-w-xs mx-auto leading-relaxed">
                Start speaking with someone in under a minute. No credit card, no personal details required.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-accent-ink)] py-3 px-6 rounded-[var(--radius-pill)] text-xs font-semibold hover:bg-[var(--color-accent-hi)] transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
              >
                <span>Get started anonymously</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--color-rule)] bg-[var(--color-paper)] py-14 px-6 text-xs text-[var(--color-muted)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/meditation-white.png" alt="Calmify" className="h-6 w-6 object-contain" />
              <span className="font-display text-base text-[var(--color-ink)] font-medium">Calmify</span>
            </div>
            <p className="max-w-sm leading-relaxed">
              Quiet, confidential mental healthcare for students, individuals, and communities.
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <a href="#capabilities" className="hover:text-[var(--color-ink)] transition-colors">Capabilities</a>
            <a href="#how-it-works" className="hover:text-[var(--color-ink)] transition-colors">How it works</a>
            <a href="#privacy" className="hover:text-[var(--color-ink)] transition-colors">Privacy</a>
            <span
              onClick={() => navigate('/crisis')}
              className="text-[oklch(84%_0.10_25)] hover:underline cursor-pointer font-medium"
            >
              Emergency Helpline (988)
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[var(--color-rule)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 Calmify. Built with care for human wellbeing.</span>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypted and confidential</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
