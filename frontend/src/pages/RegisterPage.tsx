/* Hallmark · theme: dusk (by request) · genre: modern-minimal · posture: committed */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' as 'patient' | 'peer',
    profile: {
      firstName: '',
      lastName: '',
      age: '',
      preferredName: '',
      phoneNumber: '',
      emergencyContact: { name: '', relationship: '', phone: '' }
    },
    agreedToTerms: false,
    agreedToPrivacy: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && !isLoading) navigate('/');
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (!formData.agreedToTerms || !formData.agreedToPrivacy) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profile: {
          firstName: formData.profile.firstName,
          lastName: formData.profile.lastName,
          age: formData.profile.age ? parseInt(formData.profile.age) : undefined,
          preferredName: formData.profile.preferredName || undefined,
          phoneNumber: formData.profile.phoneNumber || undefined,
          emergencyContact: formData.profile.emergencyContact.name ? formData.profile.emergencyContact : undefined
        },
        agreedToTerms: formData.agreedToTerms,
        agreedToPrivacy: formData.agreedToPrivacy
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: grandchild
            ? { ...(prev[parent as keyof typeof prev] as any)[child], [grandchild]: type === 'checkbox' ? checked : value }
            : (type === 'checkbox' ? checked : value)
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleRoleChange = (value: 'patient' | 'peer') => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)]">
        <div className="flex items-center gap-2.5 text-xs text-[var(--color-muted)]">
          <Loader2 className="h-4 w-4 animate-spin text-[var(--color-accent)]" />
          <span>Setting up your confidential space…</span>
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

      {/* Brand Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/meditation-white.png" alt="Calmify" className="h-6 w-6 object-contain" />
          <span className="font-display text-lg text-[var(--color-ink)] font-medium">Calmify</span>
        </Link>
        <Link to="/login" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
          Already have an account? Sign in →
        </Link>
      </div>

      {/* Main Glass Form Card */}
      <div className="w-full max-w-xl mx-auto my-auto py-10 relative z-10">
        <div className="glass p-8 sm:p-10">

          {/* Heading */}
          <div className="mb-8">
            <span className="text-xs text-[var(--color-accent)] font-medium block mb-1">Create account</span>
            <h1 className="text-3xl font-display text-[var(--color-ink)] font-medium leading-tight mb-2">
              Join Calmify.
            </h1>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Takes less than two minutes. Your information is strictly protected and never shared.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-[var(--radius-inner)] bg-[oklch(22%_0.05_25)] border border-[oklch(38%_0.08_25)] text-xs text-[oklch(84%_0.10_25)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Account Credentials */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs font-medium text-[var(--color-ink-2)]">
                    Username *
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="e.g. calm_river"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-[var(--color-ink-2)]">
                    Email address *
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-medium text-[var(--color-ink-2)]">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs font-medium text-[var(--color-ink-2)]">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-xs font-medium text-[var(--color-ink-2)]">
                  I am joining Calmify as a *
                </Label>
                <Select value={formData.role} onValueChange={handleRoleChange} disabled={isLoading}>
                  <SelectTrigger className="h-11 rounded-[var(--radius-inner)] border-[var(--color-rule)] bg-[var(--color-paper-2)] text-[var(--color-ink)]">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--color-paper-2)] border-[var(--color-rule)] text-[var(--color-ink)] rounded-[var(--radius-inner)] shadow-lg">
                    <SelectItem value="patient" className="focus:bg-[var(--color-paper-3)]">
                      <div className="flex flex-col text-left py-1">
                        <span className="font-medium text-xs text-[var(--color-ink)]">Patient / Community member</span>
                        <span className="text-[11px] text-[var(--color-muted)]">Looking for support, self-care, or therapy</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="peer" className="focus:bg-[var(--color-paper-3)]">
                      <div className="flex flex-col text-left py-1">
                        <span className="font-medium text-xs text-[var(--color-ink)]">Peer volunteer</span>
                        <span className="text-[11px] text-[var(--color-muted)]">Trained to listen and help others</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Optional Personal Information */}
            <div className="pt-4 border-t border-[var(--color-rule)] space-y-4">
              <span className="text-xs text-[var(--color-muted)] block">
                Optional profile details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="profile.preferredName" className="text-xs font-medium text-[var(--color-ink-2)]">
                    Preferred name / alias
                  </Label>
                  <Input
                    id="profile.preferredName"
                    name="profile.preferredName"
                    placeholder="How we should address you"
                    value={formData.profile.preferredName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile.age" className="text-xs font-medium text-[var(--color-ink-2)]">
                    Age
                  </Label>
                  <Input
                    id="profile.age"
                    name="profile.age"
                    type="number"
                    min="13"
                    max="120"
                    placeholder="Your age"
                    value={formData.profile.age}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Consents */}
            <div className="pt-3 space-y-2.5 text-xs text-[var(--color-muted)]">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="mt-0.5 w-3.5 h-3.5 rounded-[4px] border-[var(--color-rule)] bg-[var(--color-paper-2)] accent-[var(--color-accent)]"
                />
                <span>
                  I agree to the <Link to="/terms" className="text-[var(--color-accent)] underline">Terms of Service</Link>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreedToPrivacy"
                  checked={formData.agreedToPrivacy}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="mt-0.5 w-3.5 h-3.5 rounded-[4px] border-[var(--color-rule)] bg-[var(--color-paper-2)] accent-[var(--color-accent)]"
                />
                <span>
                  I agree to the <Link to="/privacy" className="text-[var(--color-accent)] underline">Privacy Policy</Link>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-accent-ink)] h-11 rounded-[var(--radius-pill)] text-xs font-semibold hover:bg-[var(--color-accent-hi)] transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating your space…</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--color-muted)] mt-6">
            Prefer not to sign up?{' '}
            <Link to="/login" className="text-[var(--color-accent)] font-medium hover:underline">
              Enter anonymously instead
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto text-center py-2 text-xs text-[var(--color-muted)]">
        <span>Calmify · Zero data selling · 24/7 crisis protocol ready</span>
      </div>
    </div>
  );
}
