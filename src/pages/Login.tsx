import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES, Role } from '@/data/employees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import cognifyzLogo from '@/assets/cognifyz-logo.png';
import loginIllustration from '@/assets/login-illustration.jpg';
import { Building2, LogIn } from 'lucide-react';

export default function Login() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !role) {
      toast.error('Please enter your name and select a role');
      return;
    }

    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(name.trim(), role as Role);
    
    if (success) {
      toast.success('Welcome to Cognifyz!');
      navigate('/dashboard');
    } else {
      toast.error('Login failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src={loginIllustration} 
          alt="Team collaboration illustration" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="w-16 h-16 bg-card rounded-2xl shadow-lg flex items-center justify-center p-2 border border-border/50">
                <img src={cognifyzLogo} alt="Cognifyz" className="w-full h-full object-contain" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Sign in to Cognifyz
            </h1>
            <p className="text-muted-foreground">
              Access your employee management dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-muted/50 border-border/50 focus:border-primary/50 focus:bg-card transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-foreground font-medium">
                Select Your Role
              </Label>
              <Select value={role} onValueChange={(value) => setRole(value as Role)}>
                <SelectTrigger className="h-12 bg-muted/50 border-border/50 focus:border-primary/50 focus:bg-card transition-colors">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r} className="focus:bg-muted">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        {r}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-semibold bg-gradient-to-r from-primary to-chart-5 hover:from-primary/90 hover:to-chart-5/90 transition-all shadow-lg shadow-primary/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          {/* Footer Note */}
          <div className="pt-6 border-t border-border/50">
            <p className="text-sm text-center text-muted-foreground">
              Select any role to explore the system with role-based permissions
            </p>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground/70">
            By signing in, you agree to our{' '}
            <span className="text-primary hover:underline cursor-pointer">Terms</span>
            {' '}& our{' '}
            <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
