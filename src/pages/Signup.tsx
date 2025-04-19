
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, User, AtSign, Key, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep2()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Account created!",
          description: "Welcome to ZenZone Connect.",
        });
        // In a real app, you would redirect or update auth state
      }, 1500);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zenMint to-white p-4">
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
                  <UserPlus className="h-6 w-6 text-zenSage" />
                </div>
                <h1 className="text-2xl font-semibold">Create Account</h1>
                <p className="text-gray-500">Join our community for better mental wellness</p>
                
                <div className="flex items-center w-full justify-between mt-4 px-8">
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                      step === 1 ? "bg-zenSage text-white" : "bg-gray-100"
                    }`}>
                      1
                    </div>
                    <span className="text-xs mt-1">Account</span>
                  </div>
                  
                  <div className={`h-0.5 flex-1 mx-2 ${
                    step > 1 ? "bg-zenSage" : "bg-gray-200"
                  }`} />
                  
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                      step === 2 ? "bg-zenSage text-white" : "bg-gray-100"
                    }`}>
                      2
                    </div>
                    <span className="text-xs mt-1">Security</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 ? (
                  // Step 1: Account information
                  <>
                    <div className="space-y-4">
                      <div className="relative">
                        <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="name"
                            name="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-1 flex items-center"
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.name}
                          </motion.p>
                        )}
                      </div>
                      
                      <div className="relative">
                        <Label htmlFor="email" className="text-gray-700">Email</Label>
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
                    </div>
                    
                    <Button 
                      type="button" 
                      onClick={handleNextStep}
                      className="w-full bg-zenSage hover:bg-zenSage/90 h-11"
                    >
                      Continue
                    </Button>
                  </>
                ) : (
                  // Step 2: Password and terms
                  <>
                    <div className="space-y-4">
                      <div className="relative">
                        <Label htmlFor="password" className="text-gray-700">Password</Label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
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
                      
                      <div className="relative">
                        <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                        <div className="relative">
                          <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-1 flex items-center"
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.confirmPassword}
                          </motion.p>
                        )}
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="terms" 
                          checked={agreedToTerms}
                          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                          className="mt-1"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="terms"
                            className="text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I agree to the Terms of Service and Privacy Policy
                          </label>
                          {errors.terms && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-xs flex items-center"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.terms}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-zenSage hover:bg-zenSage/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
            <CardFooter className="justify-center flex-col space-y-4 pb-6">
              <div className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-zenSage hover:underline font-medium">
                  Sign in
                </Link>
              </div>

              {step === 1 && (
                <>
                  <div className="relative w-full flex items-center justify-center">
                    <div className="absolute border-t border-gray-200 w-full"></div>
                    <span className="relative bg-white px-2 text-xs text-gray-400">or sign up with</span>
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
                </>
              )}
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
