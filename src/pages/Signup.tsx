import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
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
  UserPlus,
  User,
  AtSign,
  Key,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Calendar,
  Hash,
  ChevronLeft,
  RotateCw,
  Mail,
  X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import React from "react";
import Logo from "@/assets/images/LOGO.jpg";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState(1);
  const [verificationError, setVerificationError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [availability, setAvailability] = useState({
    username: { exists: null as boolean | null, message: "" },
    email: { exists: null as boolean | null, message: "" },
  });
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);

  const navigate = useNavigate();

  const passwordRequirements = [
    { id: 1, text: "8+ chars", validator: (pass: string) => pass.length >= 8 },
    { id: 2, text: "A-Z", validator: (pass: string) => /[A-Z]/.test(pass) },
    { id: 3, text: "a-z", validator: (pass: string) => /[a-z]/.test(pass) },
    { id: 4, text: "0-9", validator: (pass: string) => /[0-9]/.test(pass) },
    { id: 5, text: "!@#", validator: (pass: string) => /[^A-Za-z0-9]/.test(pass) },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  useEffect(() => {
    if (resendTimer > 0 && step === 3) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer, step]);

  const handleGoogleLogin = () => {
    window.location.href = "https://localhost:7223/api/account/google-login";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const checkAvailability = async () => {
    if ((!formData.username && !formData.email) || 
        (formData.username.length < 3 && !formData.email)) {
      return false;
    }

    setCheckingAvailability(true);
    try {
      const response = await axios.post(
        "https://localhost:7223/api/Account/check-availability",
        {
          Username: formData.username,
          Email: formData.email
        }
      );

      setAvailability({
        username: {
          exists: response.data.usernameExists,
          message: response.data.usernameMessage
        },
        email: {
          exists: response.data.emailExists,
          message: response.data.emailMessage
        }
      });
      
      return {
        usernameAvailable: !response.data.usernameExists,
        emailAvailable: !response.data.emailExists
      };
    } catch (error) {
      console.error("Error checking availability:", error);
      return false;
    } finally {
      setCheckingAvailability(false);
    }
  };

  const validateStep1 = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(formData.age))) {
      newErrors.age = "Age must be a number";
    } else if (Number(formData.age) < 13) {
      newErrors.age = "You must be at least 13 years old";
    } else if (Number(formData.age) > 120) {
      newErrors.age = "Please enter a valid age";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    } else if (!genderOptions.some((opt) => opt.value === formData.gender)) {
      newErrors.gender = "Please select a valid gender";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    const availabilityResult = await checkAvailability();
    
    if (!availabilityResult) {
      setErrors(prev => ({
        ...prev,
        form: "Failed to check availability. Please try again."
      }));
      return false;
    }

    if (!availabilityResult.usernameAvailable || !availabilityResult.emailAvailable) {
      const availabilityErrors: { [key: string]: string } = {};
      
      if (!availabilityResult.usernameAvailable) {
        availabilityErrors.username = "Username is already registered";
      }
      
      if (!availabilityResult.emailAvailable) {
        availabilityErrors.email = "Email is already registered";
      }
      
      setErrors(prev => ({ ...prev, ...availabilityErrors }));
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};

    const passwordErrors = passwordRequirements
      .filter((req) => !req.validator(formData.password))
      .map((req) => req.text);

    if (passwordErrors.length > 0) {
      newErrors.password = `Password must contain: ${passwordErrors.join(", ")}`;
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

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await validateStep1();
      if (isValid) {
        setStep(2);
      }
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        "https://localhost:7223/api/Account/register",
        {
          fullName: formData.fullName,
          username: formData.username,
          age: Number(formData.age),
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
        }
      );

      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;

        if (error.response?.status === 400) {
          if (error.response.data.errors?.Email) {
            errorMessage = error.response.data.errors.Email[0];
          } else if (error.response.data.errors?.Username) {
            errorMessage = error.response.data.errors.Username[0];
          }
        } else if (error.response?.status === 409) {
          errorMessage = "Email or username already exists";
        }
      }

      setErrors({ ...errors, form: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const ErrorMessage = ({ message }: { message: string }) => (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-[#E69EA2] text-sm mt-2 flex items-center"
    >
      <AlertCircle className="h-4 w-4 mr-2" />
      {message}
    </motion.p>
  );

  const SuccessMessage = ({ message }: { message: string }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-[#7CAE9E] text-sm mt-2 flex items-center"
    >
      <CheckCircle className="h-4 w-4 mr-2" />
      {message}
    </motion.div>
  );

  const StepIndicator = () => (
    <div className="flex items-center w-full justify-between mt-4 px-8">
      {[1, 2].map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center ${
                step === stepNumber
                  ? "bg-[#7CAE9E] text-white"
                  : step > stepNumber
                  ? "bg-[#7CAE9E]/30 text-white"
                  : "bg-gray-100"
              }`}
            >
              {stepNumber}
            </div>
            <span className="text-xs mt-1">
              {stepNumber === 1 ? "Details" : "Security"}
            </span>
          </div>
          
          {stepNumber < 2 && (
            <div 
              className={`h-0.5 flex-1 mx-2 ${
                step > stepNumber ? "bg-[#7CAE9E]" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F8E8E9] to-[#EBFFF5] p-4">
      {/* Terms & Conditions Popup */}
      {showTermsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] h-3 w-full" />
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-[#7CAE9E]">Terms & Conditions</h3>
                <button 
                  onClick={() => setShowTermsPopup(false)}
                  className="text-[#E69EA2] hover:text-[#d18e92]"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">1. Acceptance of Terms</h5>
                  <p className="mt-1">By accessing or using our services, you agree to be bound by these terms and all applicable laws and regulations.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">2. User Responsibilities</h5>
                  <p className="mt-1">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">3. Privacy Policy</h5>
                  <p className="mt-1">Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">4. Intellectual Property</h5>
                  <p className="mt-1">All content, trademarks, and data on this website are the property of our company and are protected by intellectual property laws.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">5. Prohibited Activities</h5>
                  <p className="mt-1">You agree not to engage in any illegal activities, spamming, hacking, or any activity that disrupts the service.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">6. Account Termination</h5>
                  <p className="mt-1">We may terminate or suspend your account immediately for any violation of these terms without prior notice.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">7. Limitation of Liability</h5>
                  <p className="mt-1">In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages arising from your use of the service.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">8. Governing Law</h5>
                  <p className="mt-1">These terms shall be governed by and construed in accordance with the laws of the jurisdiction where our company is registered.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">9. Changes to Terms</h5>
                  <p className="mt-1">We reserve the right to modify these terms at any time. Your continued use constitutes acceptance of the modified terms.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">10. Contact Information</h5>
                  <p className="mt-1">For any questions about these Terms, please contact us at legal@example.com or through our contact page.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">11. User Content</h5>
                  <p className="mt-1">You retain ownership of any content you submit, but grant us a worldwide license to use, reproduce, and display such content.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">12. Third-Party Services</h5>
                  <p className="mt-1">We may use third-party services to provide our services, and you agree to their terms where applicable.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">13. Dispute Resolution</h5>
                  <p className="mt-1">Any disputes shall first attempt to be resolved through mediation before pursuing legal action.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">14. Refund Policy</h5>
                  <p className="mt-1">Refunds will be processed within 30 days of request, subject to our refund policy conditions.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">15. Service Availability</h5>
                  <p className="mt-1">We do not guarantee uninterrupted service and may perform maintenance that temporarily limits access.</p>
                </div>
                
                <div>
                  <h5 className="text-[#E69EA2] text-lg font-medium">16. Age Restrictions</h5>
                  <p className="mt-1">Users must be at least 13 years old to use our services, or older depending on local regulations.</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[#CFECE0] flex justify-end">
              <Button
                onClick={() => setShowTermsPopup(false)}
                className="bg-[#7CAE9E] hover:bg-[#6a9d8d] text-white"
              >
                I Understand
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white w-full max-w-lg mx-auto">
            <div className="bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] h-3 w-full" />
            <CardHeader className="pb-6 px-10">
              <div className="flex items-center space-x-6">
                <img 
                  src={Logo} 
                  alt="Mindra Logo" 
                  className="h-20 object-contain" 
                />
                <div className="flex flex-col space-y-2">
                  <h1 className="text-3xl font-bold text-[#7CAE9E]">
                    {step === 1 ? "Create Account" : "Account Security"}
                  </h1>
                  <p className="text-gray-500 text-md mt-2">
                    {step === 1 
                      ? "Join our community for better mental wellness" 
                      : "Set up your account security"}
                  </p>
                </div>
              </div>
              <StepIndicator />
            </CardHeader>

            <CardContent className="px-10 pb-8">
              {errors.form && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-[#F8E8E9]/80 text-[#E69EA2] rounded-lg flex flex-col border border-[#FEC0B3]/50"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-6 w-6 mr-3" />
                    <span className="font-medium text-md">{errors.form}</span>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-3">
                    <Label htmlFor="fullName" className="text-[#7CAE9E] font-medium text-md">
                      Full Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-6 w-6 text-[#E69EA2]" />
                      </div>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`pl-12 h-14 rounded-xl text-md ${
                          errors.fullName ? "border-[#E69EA2]" : "border-[#CFECE0]"
                        } focus:ring-2 focus:ring-[#7CAE9E]/50 focus:border-transparent`}
                      />
                    </div>
                    {errors.fullName && <ErrorMessage message={errors.fullName} />}
                  </div>

                  {/* Username */}
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-[#7CAE9E] font-medium text-md">
                      Username
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Hash className="h-6 w-6 text-[#E69EA2]" />
                      </div>
                      <Input
                        id="username"
                        name="username"
                        placeholder="yourusername"
                        value={formData.username}
                        onChange={handleChange}
                        className={`pl-12 h-14 rounded-xl text-md ${
                          errors.username ? "border-[#E69EA2]" : "border-[#CFECE0]"
                        } focus:ring-2 focus:ring-[#7CAE9E]/50 focus:border-transparent`}
                      />
                    </div>
                    {errors.username && <ErrorMessage message={errors.username} />}
                  </div>

                  {/* Age */}
                  <div className="space-y-3">
                    <Label htmlFor="age" className="text-[#7CAE9E] font-medium text-md">
                      Age
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-6 w-6 text-[#E69EA2]" />
                      </div>
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
                        className={`pl-12 h-14 rounded-xl text-md ${
                          errors.age ? "border-[#E69EA2]" : "border-[#CFECE0]"
                        } focus:ring-2 focus:ring-[#7CAE9E]/50 focus:border-transparent`}
                        onKeyDown={(e) => {
                          if (["-", "+", "e", "E", "."].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                    {errors.age && <ErrorMessage message={errors.age} />}
                  </div>

                  {/* Gender */}
                  <div className="space-y-3">
                    <Label className="text-[#7CAE9E] font-medium text-md">
                      Gender
                    </Label>
                    <div className="flex gap-3 mt-1">
                      {genderOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`flex-1 cursor-pointer rounded-lg border p-3 transition-all h-14 flex items-center justify-center ${
                            formData.gender === option.value
                              ? "border-[#7CAE9E] bg-[#7CAE9E]/10 ring-1 ring-[#7CAE9E]"
                              : "border-[#CFECE0] hover:border-[#7CAE9E]/50"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full px-2">
                            <span className="text-md font-medium text-[#7CAE9E]">
                              {option.label}
                            </span>
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                formData.gender === option.value
                                  ? "border-[#7CAE9E] bg-[#7CAE9E]"
                                  : "border-[#CFECE0]"
                              }`}
                            >
                              {formData.gender === option.value && (
                                <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
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
                    {errors.gender && <ErrorMessage message={errors.gender} />}
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[#7CAE9E] font-medium text-md">
                      Email
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <AtSign className="h-6 w-6 text-[#E69EA2]" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-12 h-14 rounded-xl text-md ${
                          errors.email ? "border-[#E69EA2]" : "border-[#CFECE0]"
                        } focus:ring-2 focus:ring-[#7CAE9E]/50 focus:border-transparent`}
                      />
                    </div>
                    {errors.email && <ErrorMessage message={errors.email} />}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* Password */}
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-[#7CAE9E] font-medium text-md">
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Key className="h-6 w-6 text-[#E69EA2]" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className={`pl-12 pr-12 h-14 rounded-xl text-md ${
                          errors.password ? "border-[#E69EA2]" : "border-[#CFECE0]"
                        } focus:ring-2 focus:ring-[#7CAE9E]/50 focus:border-transparent`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#E69EA2] hover:text-[#d18e92] transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-6 w-6" />
                        ) : (
                          <Eye className="h-6 w-6" />
                        )}
                      </button>
                    </div>

                    {/* Password Requirements */}
                    {formData.password && (
                      <div className="mt-3 grid grid-cols-5 gap-1">
                        {passwordRequirements.map((req) => (
                          <div key={req.id} className="flex flex-col items-center">
                            <div className="flex items-center space-x-1">
                              {req.validator(formData.password) ? (
                                <CheckCircle className="h-4 w-4 text-[#7CAE9E]" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-[#CFECE0]" />
                              )}
                            </div>
                            <span className={`text-xs mt-1 ${
                              req.validator(formData.password)
                                ? "text-[#7CAE9E]"
                                : "text-gray-400"
                            }`}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {errors.password && <ErrorMessage message={errors.password} />}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-[#7CAE9E] font-medium text-md">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Key className="h-6 w-6 text-[#E69EA2]" />
                      </div>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`pl-12 pr-12 h-14 rounded-xl text-md ${
                          errors.confirmPassword ? "border-[#E69EA2]" : "border-[#CFECE0]"
                        } focus:ring-2 focus:ring-[#7CAE9E]/50 focus:border-transparent`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#E69EA2] hover:text-[#d18e92] transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-6 w-6" />
                        ) : (
                          <Eye className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <ErrorMessage message={errors.confirmPassword} />
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start space-x-3 mt-4">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) =>
                        setAgreedToTerms(checked as boolean)
                      }
                      className="mt-1 data-[state=checked]:bg-[#7CAE9E] data-[state=checked]:border-[#7CAE9E]"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm text-[#7CAE9E] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{' '}
                        <button 
                          type="button" 
                          onClick={() => setShowTermsPopup(true)}
                          className="underline hover:text-[#6a9d8d]"
                        >
                          Terms of Service and Privacy Policy
                        </button>
                      </label>
                      {errors.terms && <ErrorMessage message={errors.terms} />}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="justify-center flex-col space-y-6 pb-10 px-10">
              <Button
                onClick={handleNextStep}
                className="w-full bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] hover:from-[#d18e92] hover:to-[#eeb0a5] text-white h-14 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-md"
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
                      className="h-6 w-6 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    {step === 1 ? "Checking..." : "Creating Account..."}
                  </div>
                ) : step === 1 ? (
                  "Continue to Security"
                ) : (
                  "Create Account"
                )}
              </Button>

              {step === 1 && (
                <>
                  <div className="text-md text-gray-500">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-[#7CAE9E] hover:text-[#6a9d8d] hover:underline font-medium transition-colors"
                    >
                      Sign in
                    </Link>
                  </div>

                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#CFECE0]" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 bg-white text-md text-gray-500">
                        or continue with
                      </span>
                    </div>
                  </div>

                  <div className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-14 rounded-xl border-[#CFECE0] hover:bg-[#EBFFF5] flex items-center justify-center space-x-3 transition-colors text-[#7CAE9E] text-md"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                    >
                      <svg
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                          <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                          <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                          <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                          <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                        </g>
                      </svg>
                      <span className="font-medium">Google</span>
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
          className="mt-10 text-center"
        >
          <Link
            to="/"
            className="text-md text-[#7CAE9E] hover:text-[#6a9d8d] flex items-center justify-center transition-colors duration-200"
          >
            Return to home page
            <ChevronRight className="h-5 w-5 ml-1.5 mt-0.5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}