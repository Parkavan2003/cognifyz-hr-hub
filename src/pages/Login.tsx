import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { initialEmployees, Role } from '@/data/employees';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import cognifyzLogo from '@/assets/cognifyz-logo.png';
import loginIllustration from '@/assets/login-illustration.jpg';
import { Building2, LogIn, ChevronsUpDown, Check, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Login() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const selectedEmployee = initialEmployees.find(emp => emp.id === selectedEmployeeId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(selectedEmployee.name, selectedEmployee.role as Role);
    
    if (success) {
      toast.success('Welcome to Cognifyz!');
      navigate('/dashboard');
    } else {
      toast.error('Login failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
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
              <Label htmlFor="employee" className="text-foreground font-medium">
                Select Employee
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-12 justify-between bg-muted/50 border-border/50 hover:bg-card hover:border-primary/50 transition-colors"
                  >
                    {selectedEmployee ? (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedEmployee.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Choose an employee...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-card border-border z-50" align="start">
                  <Command className="bg-card">
                    <CommandInput placeholder="Search employee..." className="h-10" />
                    <CommandList>
                      <CommandEmpty>No employee found.</CommandEmpty>
                      <CommandGroup>
                        {initialEmployees.map((employee) => (
                          <CommandItem
                            key={employee.id}
                            value={employee.name}
                            onSelect={() => {
                              setSelectedEmployeeId(employee.id);
                              setOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedEmployeeId === employee.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{employee.name}</span>
                              <span className="text-xs text-muted-foreground">{employee.role} • {employee.department}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Auto-selected Role Display */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">
                Role
              </Label>
              <div className="h-12 px-3 flex items-center gap-2 rounded-md bg-muted/30 border border-border/50">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                {selectedEmployee ? (
                  <span className="text-foreground">{selectedEmployee.role}</span>
                ) : (
                  <span className="text-muted-foreground">Role will be auto-selected</span>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-semibold bg-gradient-to-r from-primary to-chart-5 hover:from-primary/90 hover:to-chart-5/90 transition-all shadow-lg shadow-primary/25"
              disabled={isLoading || !selectedEmployee}
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
              Select any employee to explore the system with role-based permissions
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
