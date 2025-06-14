import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  User,
  Calendar,
  AlertCircle,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/assets/images/UpdatedLOGO.jpg";

export default function CompleteProfile() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(formData.age))) {
      newErrors.age = "Age must be a number";
    } else if (Number(formData.age) < 13) {
      newErrors.age = "You must be at least 13 years old";
    } else if (Number(formData.age) > 120) {
      newErrors.age = "Please enter a valid age";
    }
    
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/login');
      return;
    }
  
    const checkProfile = async () => {
      try {
        const response = await axios.get(
          'https://localhost:7223/api/account/check-profile',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data.isComplete) {
          localStorage.setItem('token', token);
          navigate('/');
        } else {
          localStorage.setItem('tempToken', token);
        }
      } catch (error) {
        console.error('Profile check failed:', error);
        navigate('/login');
      }
    };
  
    checkProfile();
  }, [navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!validateForm()) return;
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://localhost:7223/api/Account/complete-google-profile",
        {
          age: Number(formData.age),
          gender: formData.gender
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tempToken')}`
          }
        }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.removeItem('tempToken');
      navigate('/');
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] p-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-[#FFFFFF] backdrop-blur-sm w-full max-w-xl">
            <div className="bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] h-2 w-full" />
            <CardHeader className="pb-2 pt-8 px-10">
              <div className="flex items-center gap-3">
                <img
                  src={Logo}
                  alt="Mindra Logo"
                  className="h-24 w-24 object-contain rounded-full border-4 border-white"
                />
                <div>
                  <h1 className="text-2xl font-bold text-[#7CAE9E]">Complete Your Profile</h1>
                  <p className="text-gray-500 text-sm mt-1 ml-1">
                    Just a few more details to get started
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-[#7CAE9E] font-medium text-sm">
                    Age
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-[#E69EA2]" />
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Your age"
                      value={formData.age}
                      onChange={(e) => {
                        const value = Math.max(0, parseInt(e.target.value) || 0);
                        setFormData((prev) => ({
                          ...prev,
                          age: value.toString(),
                        }));
                        if (errors.age) setErrors((prev) => ({ ...prev, age: "" }));
                      }}
                      min="13"
                      max="120"
                      className={`pl-10 h-14 rounded-lg text-sm ${
                        errors.age ? "border-[#E69EA2] focus:ring-[#F8E8E9]" : "border-[#CFECE0] focus:ring-[#EBFFF5]"
                      }`}
                      onKeyDown={(e) => {
                        if (["-", "+", "e", "E", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  {errors.age && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[#E69EA2] text-xs mt-1 flex items-start"
                    >
                      <AlertCircle className="h-3.5 w-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
                      {errors.age}
                    </motion.p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label className="text-[#7CAE9E] font-medium text-sm">Gender</Label>
                  <div className="flex gap-3 mt-1">
                    {genderOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex-1 cursor-pointer rounded-lg border p-3 transition-all ${
                          formData.gender === option.value
                            ? "border-[#7CAE9E] bg-[#7CAE9E]/10 ring-1 ring-[#7CAE9E]"
                            : "border-[#CFECE0] hover:border-[#7CAE9E]/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {option.label}
                          </span>
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                              formData.gender === option.value
                                ? "border-[#7CAE9E] bg-[#7CAE9E]"
                                : "border-gray-400"
                            }`}
                          >
                            {formData.gender === option.value && (
                              <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                            )}
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="gender"
                          value={option.value}
                          checked={formData.gender === option.value}
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>
                    ))}
                  </div>
                  {errors.gender && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[#E69EA2] text-xs mt-1 flex items-start"
                    >
                      <AlertCircle className="h-3.5 w-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
                      {errors.gender}
                    </motion.p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] hover:from-[#d18e92] hover:to-[#eeb0a5] text-white h-14 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-6 w-6 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Completing Profile...
                    </div>
                  ) : (
                    "Complete Profile"
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center pb-8 px-8">
              <p className="text-xs text-gray-500 text-center">
                Need help?{" "}
                <Link
                  to="/contact"
                  className="text-[#7CAE9E] hover:text-[#6a9d8d] hover:underline font-medium transition-colors"
                >
                  Contact support
                </Link>
              </p>
            </CardFooter>
          </Card>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <Link
              to="/"
              className="text-xs text-[#7CAE9E] hover:text-[#6a9d8d] flex items-center justify-center transition-colors duration-200"
            >
              Return to home page
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}