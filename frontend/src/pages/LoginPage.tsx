/* Hallmark · theme: dusk (by request) · genre: modern-minimal · posture: committed */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

interface ErrorResponse { message: string; }

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, createAnonymousSession, isLoading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && !isLoading) navigate('/');
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email: formData.email, password: formData.password, rememberMe: formData.rememberMe });
      navigate('/');
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      setError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleAnonymousLogin = async () => {
    setError('');
    try {
      await createAnonymousSession();
      navigate('/chatbot');
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      setError(error.message || 'Anonymous session creation failed.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)]">
        <div className="flex items-center gap-2.5 text-xs text-[var(--color-muted)]">
          <Loader2 className="h-4 w-4 animate-spin text-[var(--color-accent)]" />
          <span>Opening your safe space…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] relative flex flex-col justify-between p-6 text-[var(--color-ink)] overflow-hidden">
      {/* Background wallpaper with dusk scrim */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-20" aria-hidden="true">
        <img src="/dusk-bg.jpg" alt="" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-paper)]/70 via-[var(--color-paper)]/90 to-[var(--color-paper)]" />
      </div>

      {/* Top Brand Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/meditation-white.png" alt="Calmify" className="h-6 w-6 object-contain" />
          <span className="font-display text-lg text-[var(--color-ink)] font-medium">Calmify</span>
        </Link>
        <Link to="/" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
          ← Back to overview
        </Link>
      </div>

      {/* Main Glass Card */}
      <div className="w-full max-w-md mx-auto my-auto py-10 relative z-10">
        <div className="glass p-8 sm:p-9">

          {/* Heading */}
          <div className="mb-7">
            <span className="text-xs text-[var(--color-accent)] font-medium block mb-1">Sign in</span>
            <h1 className="text-3xl font-display text-[var(--color-ink)] font-medium leading-tight mb-2">
              Welcome back.
            </h1>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Continue your journey to mental clarity and quiet peace.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-[var(--radius-inner)] bg-[oklch(22%_0.05_25)] border border-[oklch(38%_0.08_25)] text-xs text-[oklch(84%_0.10_25)]">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-[var(--color-ink-2)]">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-[var(--color-ink-2)]">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your confidential password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-3.5 h-3.5 rounded-[4px] border-[var(--color-rule)] bg-[var(--color-paper-2)] accent-[var(--color-accent)]"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-accent-ink)] h-11 rounded-[var(--radius-pill)] text-xs font-semibold hover:bg-[var(--color-accent-hi)] transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-rule)]" />
            </div>
            <span className="relative bg-[var(--color-paper-2)] px-3 text-xs text-[var(--color-muted)]">
              or enter quietly
            </span>
          </div>

          {/* Anonymous Session CTA */}
          <button
            type="button"
            onClick={handleAnonymousLogin}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ink)] h-11 rounded-[var(--radius-pill)] text-xs font-medium hover:bg-[var(--color-paper-3)] transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Continue 100% anonymously</span>
          </button>

          {/* Switch to Register */}
          <p className="text-center text-xs text-[var(--color-muted)] mt-6">
            New here?{' '}
            <Link to="/register" className="text-[var(--color-accent)] font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Subtle Footer */}
      <div className="max-w-6xl w-full mx-auto text-center py-2 text-xs text-[var(--color-muted)]">
        <span>Confidential · HIPAA-compliant practices · No data selling</span>
      </div>
    </div>
  );
}
