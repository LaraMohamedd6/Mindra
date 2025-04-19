
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn, Key, AtSign, AlertCircle, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    
    // If no errors, proceed with login
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        // In a real app, you would redirect or update auth state
      }, 1500);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zenLightPink to-white p-4">
      <div className="w-full max-w-md">
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                  
                  <div className="relative">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                      />
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
                </div>
                
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-zenSage hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-zenSage hover:bg-zenSage/90 h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center flex-col space-y-4 pb-6">
              <div className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/signup" className="text-zenSage hover:underline font-medium">
                  Sign up now
                </Link>
              </div>

              <div className="relative w-full flex items-center justify-center">
                <div className="absolute border-t border-gray-200 w-full"></div>
                <span className="relative bg-white px-2 text-xs text-gray-400">or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 text-[#4285F4]" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 text-[#1877F2]" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <Link 
            to="/" 
            className="text-sm text-gray-500 hover:text-zenSage flex items-center justify-center"
          >
            Return to home page <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
