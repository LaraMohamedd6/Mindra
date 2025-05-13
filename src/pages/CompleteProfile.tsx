import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";


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
  
    // Check if profile is already complete
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
          // Profile is complete - use this token and redirect to home
          localStorage.setItem('token', token);
          navigate('/');
        } else {
          // Profile incomplete - show form
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zenMint/10 to-white p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="flex justify-center items-center mb-8 text-2xl font-display font-semibold"
          >
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
                  <User className="h-6 w-6 text-zenSage" />
                </div>
                <h1 className="text-2xl font-semibold">Complete Your Profile</h1>
                <p className="text-gray-500">
                  Just a couple more details to get started
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Age */}
                <div>
                  <Label htmlFor="age" className="text-gray-700">
                    Age
                  </Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Your age"
                      value={formData.age}
                      onChange={(e) => {
                        const value = Math.max(
                          0,
                          parseInt(e.target.value) || 0
                        );
                        setFormData((prev) => ({
                          ...prev,
                          age: value.toString(),
                        }));
                        if (errors.age) setErrors((prev) => ({ ...prev, age: "" }));
                      }}
                      min="13"
                      max="120"
                      className={`pl-10 ${
                        errors.age ? "border-red-500" : "border-gray-300"
                      }`}
                      onKeyDown={(e) => {
                        if (["-", "+", "e", "E", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  {errors.age && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.age}
                    </div>
                  )}
                </div>

                {/* Gender */}
               <div>
                    <Label className="text-gray-700">Gender</Label>
                    <div className="flex gap-3 mt-1">
                      {genderOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`flex-1 cursor-pointer rounded-lg border p-3 transition-all ${
                            formData.gender === option.value
                              ? "border-zenSage bg-zenSage/10 ring-1 ring-zenSage"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              {option.label}
                            </span>
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                formData.gender === option.value
                                  ? "border-zenSage bg-zenSage"
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
                  </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-zenSage hover:bg-zenSage/90 h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Completing Profile...
                      </span>
                    ) : (
                      "Complete Profile"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="justify-center pb-2">
{/*               <Link
                to="/"
                className="text-sm text-zenSage hover:text-zenSage/80 flex items-center"
              >
                Skip for now <ChevronRight className="h-4 w-4 ml-1" />
              </Link> */}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 