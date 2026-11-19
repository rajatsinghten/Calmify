import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Eye, EyeOff, Info } from "lucide-react";

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
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    },
    agreedToTerms: false,
    agreedToPrivacy: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
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
      const userData = {
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
          emergencyContact: formData.profile.emergencyContact.name ? {
            name: formData.profile.emergencyContact.name,
            relationship: formData.profile.emergencyContact.relationship,
            phone: formData.profile.emergencyContact.phone
          } : undefined
        }
      };

      await register(userData);
      navigate('/');
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('profile.emergencyContact.')) {
      const field = name.split('.')[2];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          emergencyContact: {
            ...prev.profile.emergencyContact,
            [field]: value
          }
        }
      }));
    } else if (name.startsWith('profile.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleRoleChange = (value: 'patient' | 'peer') => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-background text-foreground">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/meditation-white.png" alt="Calmify Logo" className="h-12 w-auto object-contain" />
            <h1 className="text-3xl font-heading font-bold text-foreground">Calmify</h1>
          </div>
          <p className="text-muted-foreground">
            Join our supportive community for mental health
          </p>
        </div>

        <div className="rounded-3xl shadow-2xl p-8 bg-card/90 border border-border backdrop-blur-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold mb-2 text-foreground">Create Your Account</h2>
            <p className="text-muted-foreground text-sm">
              Start your journey to better mental health with us
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-destructive/15 border border-destructive/30 rounded-xl">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-heading font-semibold text-foreground">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="font-medium text-foreground">Username *</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium text-foreground">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-medium text-foreground">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-medium text-foreground">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="font-medium text-foreground">Role *</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={handleRoleChange} 
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      <SelectItem value="patient">
                        <div className="flex flex-col text-left">
                          <span className="font-medium">Patient/Student</span>
                          <span className="text-xs text-muted-foreground">Seeking mental health support</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="peer">
                        <div className="flex flex-col text-left">
                          <span className="font-medium">Peer Volunteer</span>
                          <span className="text-xs text-muted-foreground">Trained to provide peer support</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-heading font-semibold text-foreground">Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile.firstName" className="font-medium text-foreground">First Name</Label>
                    <Input
                      id="profile.firstName"
                      name="profile.firstName"
                      placeholder="Your first name"
                      value={formData.profile.firstName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile.lastName" className="font-medium text-foreground">Last Name</Label>
                    <Input
                      id="profile.lastName"
                      name="profile.lastName"
                      placeholder="Your last name"
                      value={formData.profile.lastName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile.preferredName" className="font-medium text-foreground">Preferred Name</Label>
                    <Input
                      id="profile.preferredName"
                      name="profile.preferredName"
                      placeholder="What should we call you?"
                      value={formData.profile.preferredName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile.age" className="font-medium text-foreground">Age</Label>
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
                      className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-heading font-semibold text-foreground">Emergency Contact</h3>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Optional but recommended for crisis situations
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile.emergencyContact.name" className="font-medium text-foreground">Contact Name</Label>
                    <Input
                      id="profile.emergencyContact.name"
                      name="profile.emergencyContact.name"
                      placeholder="Emergency contact name"
                      value={formData.profile.emergencyContact.name}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile.emergencyContact.relationship" className="font-medium text-foreground">Relationship</Label>
                    <Input
                      id="profile.emergencyContact.relationship"
                      name="profile.emergencyContact.relationship"
                      placeholder="e.g., Parent, Sibling, Friend"
                      value={formData.profile.emergencyContact.relationship}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile.emergencyContact.phone" className="font-medium text-foreground">Contact Phone</Label>
                  <Input
                    id="profile.emergencyContact.phone"
                    name="profile.emergencyContact.phone"
                    type="tel"
                    placeholder="Emergency contact phone number"
                    value={formData.profile.emergencyContact.phone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              {/* Terms and Privacy */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      id="agreedToTerms"
                      name="agreedToTerms"
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={handleInputChange}
                      className="rounded border-border text-primary focus:ring-primary bg-background"
                      disabled={isLoading}
                      required
                    />
                    <Label htmlFor="agreedToTerms" className="text-sm text-muted-foreground cursor-pointer">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="agreedToPrivacy"
                      name="agreedToPrivacy"
                      type="checkbox"
                      checked={formData.agreedToPrivacy}
                      onChange={handleInputChange}
                      className="rounded border-border text-primary focus:ring-primary bg-background"
                      disabled={isLoading}
                      required
                    />
                    <Label htmlFor="agreedToPrivacy" className="text-sm text-muted-foreground cursor-pointer">
                      I agree to the{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <button 
                type="submit" 
                className="w-full px-8 py-3.5 text-primary-foreground bg-primary hover:bg-primary/90 text-base font-semibold rounded-full transition-all duration-300 ease-out hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
