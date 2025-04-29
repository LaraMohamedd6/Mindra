import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn, Key, AtSign, AlertCircle, ChevronRight, Eye, EyeOff, User, Calendar, Hash, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export default function Login() {
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Password requirements
  const passwordRequirements = [
    { id: 1, text: "Minimum 8 characters", validator: (pass: string) => pass.length >= 8 },
    { id: 2, text: "At least one uppercase letter", validator: (pass: string) => /[A-Z]/.test(pass) },
    { id: 3, text: "At least one lowercase letter", validator: (pass: string) => /[a-z]/.test(pass) },
    { id: 4, text: "At least one number", validator: (pass: string) => /[0-9]/.test(pass) },
    { id: 5, text: "At least one special character", validator: (pass: string) => /[^A-Za-z0-9]/.test(pass) }
  ];

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    const passwordErrors = passwordRequirements
      .filter(req => !req.validator(formData.password))
      .map(req => req.text);

    if (passwordErrors.length > 0) {
      newErrors.password = `Password must contain: ${passwordErrors.join(", ")}`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post('https://localhost:7223/api/Account/login', {
        email: formData.email,
        password: formData.password
      });

      // Store the authentication token
      localStorage.setItem('authToken', response.data.token);
      
      // Show success message
      toast({
        title: "Login Successful",
        description: "Welcome back to ZenZone Connect!",
        variant: "default",
      });

      // Redirect to dashboard or home page
      navigate('/');

    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
        
        // Handle specific error cases
        if (error.response?.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (error.response?.status === 400) {
          errorMessage = "Please check your input and try again";
        }
      }

      setErrors({
        general: errorMessage
      });

      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zenLightPink to-white p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex justify-center items-center mb-8 text-2xl font-display font-semibold">
            <div className="flex space-x-1 mr-2">
              <div className="w-8 h-8 rounded-full bg-zenPink flex items-center justify-center">
                <span className="text-white text-sm">Z</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-zenSeafoam flex items-center justify-center">
                <span className="text-white text-sm">Z</span>
              </div>
            </div>
            ZenZone Connect
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-zenSeafoam shadow-lg">
            <CardHeader>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="bg-zenSage/10 p-3 rounded-full">
                  <LogIn className="h-6 w-6 text-zenSage" />
                </div>
                <h1 className="text-2xl font-semibold">Welcome Back</h1>
                <p className="text-gray-500">Sign in to continue your wellness journey</p>
              </div>
            </CardHeader>

            <CardContent>
              {/* Error message for general errors */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center"
                >
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {errors.general}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1 flex items-center"
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map(req => (
                      <div key={req.id} className="flex items-center">
                        {req.validator(formData.password) ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                        )}
                        <span className={`text-xs ${req.validator(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1 flex items-center"
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-zenSage hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-zenSage hover:bg-zenSage/90 h-11 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>

            {/* Footer with Sign Up and Social Options */}
            <CardFooter className="justify-center flex-col space-y-4 pb-6">
              <div className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-zenSage hover:underline font-medium"
                >
                  Sign up now
                </Link>
              </div>

              <div className="relative w-full flex items-center justify-center">
                <div className="absolute border-t border-gray-200 w-full"></div>
                <span className="relative bg-white px-2 text-xs text-gray-400">or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => {
                    // Implement Google OAuth here
                    toast({
                      title: "Coming Soon",
                      description: "Google login will be available soon",
                    });
                  }}
                >
                  <svg className="h-5 w-5 text-[#4285F4]" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => {
                    // Implement Facebook OAuth here
                    toast({
                      title: "Coming Soon",
                      description: "Facebook login will be available soon",
                    });
                  }}
                >
                  <svg className="h-5 w-5 text-[#1877F2]" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62,13.56 9.39,13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10.04,10.04 0 0,0 22,12.06C22,6.53 17.5,2.04 12,2.04Z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Home Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <Link 
            to="/" 
            className="text-sm text-gray-500 hover:text-zenSage flex items-center justify-center transition-colors duration-200"
          >
            Return to home page <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}