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
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import React from "react";
import { VerificationStep } from "./VerificationStep";
import Logo from "@/assets/images/UpdatedLOGO.jpg";

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
  const [showTermsModal, setShowTermsModal] = useState(false);

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
    if (!formData.username && !formData.email) {
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

      setStep(3);
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

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    setVerificationError("");
    setVerificationSuccess("");

    try {
      const response = await axios.post(
        "https://localhost:7223/api/Account/verify",
        {
          email: formData.email,
          code: code,
        }
      );

      setVerificationSuccess("Verification successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/login?verified=true";
      }, 1500);
    } catch (err) {
      setVerificationError(
        axios.isAxiosError(err)
          ? err.response?.data || "Verification failed. Please try again."
          : "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    try {
      await axios.post("https://localhost:7223/api/Account/resend-verification", { 
        email: formData.email 
      });
      setVerificationSuccess("New verification code sent to your email");
      setResendTimer(30);
    } catch (err) {
      setVerificationError("Failed to resend code. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://localhost:7223/api/account/google-login';
  };

  const StepIndicator = () => (
    <div className="flex items-center w-full justify-between mt-4 px-8">
      {[1, 2, 3].map((stepNumber) => (
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
              {stepNumber === 1 ? "Details" : 
               stepNumber === 2 ? "Security" : "Verify"}
            </span>
          </div>
          
          {stepNumber < 3 && (
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

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-start mt-1 text-sm text-[#E69EA2]">
      <AlertCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );

  const SuccessMessage = ({ message }: { message: string }) => (
    <div className="flex items-start mt-1 text-sm text-[#7CAE9E]">
      <CheckCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );

  const TermsModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-[#7CAE9E]">Terms and Conditions</h3>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>1. Acceptance of Terms</h5>
          <p>By accessing or using our services, you agree to be bound by these terms and all applicable laws and regulations.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>2. User Responsibilities</h5>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>3. Privacy Policy</h5>
          <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>4. Intellectual Property</h5>
          <p>All content, trademarks, and data on this website are the property of our company and are protected by intellectual property laws.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>5. Prohibited Activities</h5>
          <p>You agree not to engage in any illegal activities, spamming, hacking, or any activity that disrupts the service.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>6. Account Termination</h5>
          <p>We may terminate or suspend your account immediately for any violation of these terms without prior notice.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>7. Limitation of Liability</h5>
          <p>In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages arising from your use of the service.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>8. Governing Law</h5>
          <p>These terms shall be governed by and construed in accordance with the laws of the jurisdiction where our company is registered.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>9. Changes to Terms</h5>
          <p>We reserve the right to modify these terms at any time. Your continued use constitutes acceptance of the modified terms.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>10. Contact Information</h5>
          <p>For any questions about these Terms, please contact us at legal@example.com or through our contact page.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>11. User Content</h5>
          <p>You retain ownership of any content you submit, but grant us a worldwide license to use, reproduce, and display such content.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>12. Third-Party Services</h5>
          <p>We may use third-party services to provide our services, and you agree to their terms where applicable.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>13. Dispute Resolution</h5>
          <p>Any disputes shall first attempt to be resolved through mediation before pursuing legal action.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>14. Refund Policy</h5>
          <p>Refunds will be processed within 30 days of request, subject to our refund policy conditions.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>15. Service Availability</h5>
          <p>We do not guarantee uninterrupted service and may perform maintenance that temporarily limits access.</p>
          
          <h5 style={{ color: '#E69EA2', fontSize: '1rem' }}>16. Age Restrictions</h5>
          <p>Users must be at least 13 years old to use our services, or older depending on local regulations.</p>
        </div>
        <div className="p-3 border-t text-center" style={{ flexShrink: 0 }}>
          <button
            onClick={onClose}
            className="btn py-2 px-4 fw-bold border-0"
            style={{ 
              backgroundColor: '#E69EA2', 
              color: 'white',
              fontSize: '0.9rem'
            }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );

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
                  <h1 className="text-2xl font-bold text-[#7CAE9E]">
                    {step === 1 && "Join MINDRA Today"}
                    {step === 2 && "Secure Your Account"}
                    {step === 3 && "Verify Your Email"}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1 ml-1">
                    {step === 1 && "Create your account to start your wellness journey"}
                    {step === 2 && "Set up your account security"}
                    {step === 3 && "Enter the code sent to your email"}
                  </p>
                </div>
              </div>
              <StepIndicator />
            </CardHeader>

            <CardContent className="px-8 pb-6">
              {errors.form && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-3 bg-[#F8E8E9]/80 text-[#E69EA2] rounded-lg border border-[#FEC0B3]/50 flex flex-col"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="font-medium text-sm">{errors.form}</span>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-[#7CAE9E] font-medium text-sm">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-[#E69EA2]" />
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`pl-10 h-14 rounded-lg text-sm ${errors.fullName ? "border-[#E69EA2] focus:ring-[#F8E8E9]" : "border-[#CFECE0] focus:ring-[#EBFFF5]"}`}
                      />
                    </div>
                    {errors.fullName && <ErrorMessage message={errors.fullName} />}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-[#7CAE9E] font-medium text-sm">
                      Username
                    </Label>
                    <div className="relative">
                      <Hash className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-[#E69EA2]" />
                      <Input
                        id="username"
                        name="username"
                        placeholder="yourusername"
                        value={formData.username}
                        onChange={handleChange}
                        className={`pl-10 h-14 rounded-lg text-sm ${errors.username ? "border-[#E69EA2] focus:ring-[#F8E8E9]" : "border-[#CFECE0] focus:ring-[#EBFFF5]"}`}
                      />
                    </div>
                    {errors.username && <ErrorMessage message={errors.username} />}
                  </div>

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
                        className={`pl-10 h-14 rounded-lg text-sm ${errors.age ? "border-[#E69EA2] focus:ring-[#F8E8E9]" : "border-[#CFECE0] focus:ring-[#EBFFF5]"}`}
                        onKeyDown={(e) => {
                          if (["-", "+", "e", "E", "."].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                    {errors.age && <ErrorMessage message={errors.age} />}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#7CAE9E] font-medium text-sm">Gender</Label>
                    <div className="flex gap-3 mt-1">
                      {genderOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`flex-1 cursor-pointer rounded-lg border p-3 transition-all ${
                            formData.gender === option.value
                              ? "border-[#7CAE9E] bg-[#7CAE9E]/10 ring-1 ring-[#7CAE9E]"
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
                    {errors.gender && <ErrorMessage message={errors.gender} />}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#7CAE9E] font-medium text-sm">
                      Email
                    </Label>
                    <div className="relative">
                      <AtSign className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-[#E69EA2]" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 h-14 rounded-lg text-sm ${errors.email ? "border-[#E69EA2] focus:ring-[#F8E8E9]" : "border-[#CFECE0] focus:ring-[#EBFFF5]"}`}
                      />
                    </div>
                    {errors.email && <ErrorMessage message={errors.email} />}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#7CAE9E] font-medium text-sm">
                      Password
                    </Label>
                    <div className="relative">
                      <Key className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-[#E69EA2]" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className={`pl-10 pr-10 h-14 rounded-lg text-sm ${errors.password ? "border-[#E69EA2] focus:ring-[#F8E8E9]" : "border-[#CFECE0] focus:ring-[#EBFFF5]"}`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#E69EA2] hover:text-[#d18e92] transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <div className="mt-2 grid grid-cols-5 gap-1">
                      {passwordRequirements.map((req) => (
                        <div key={req.id} className="flex flex-col items-center">
                          <div className="flex items-center space-x-1">
                            {req.validator(formData.password) ? (
                              <CheckCircle className="h-4 w-4 text-[#7CAE9E]" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-[#CFECE0]" />
                            )}
                          </div>
                          <span className={`text-[10px] mt-0.5 ${
                            req.validator(formData.password)
                              ? "text-[#7CAE9E]"
                              : "text-gray-400"
                          }`}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {errors.password && <ErrorMessage message={errors.password} />}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#7CAE9E] font-medium text-sm">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Key className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-[#E69EA2]" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`pl-10 pr-10 h-14 rounded-lg text-sm ${errors.confirmPassword ? "border-[#E69EA2] focus:ring-[#F8E8E9]" : "border-[#CFECE0] focus:ring-[#EBFFF5]"}`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#E69EA2] hover:text-[#d18e92] transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}
                  </div>

                  <div className="flex items-start space-x-2 mt-4">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) =>
                        setAgreedToTerms(checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <span
                          className="text-[#7CAE9E] hover:underline cursor-pointer"
                          onClick={() => setShowTermsModal(true)}
                        >
                          Terms of Service
                        </span>{" "}
                        and Privacy Policy
                      </label>
                      {errors.terms && <ErrorMessage message={errors.terms} />}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <VerificationStep
                  email={formData.email}
                  onBack={() => setStep(2)}
                  onVerify={handleVerify}
                  onResendCode={handleResendCode}
                  verificationError={verificationError}
                  verificationSuccess={verificationSuccess}
                  resendTimer={resendTimer}
                  isLoading={isLoading}
                />
              )}

              {step !== 3 && (
                <div className="mt-6">
                  <Button
                    onClick={handleNextStep}
                    className="w-full bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] hover:from-[#d18e92] hover:to-[#eeb0a5] text-white h-14 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium"
                    disabled={isLoading || checkingAvailability}
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
                        {step === 1 ? "Checking..." : "Creating..."}
                      </div>
                    ) : checkingAvailability ? (
                      "Checking availability..."
                    ) : step === 1 ? (
                      "Continue to Security"
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  {step === 1 && (
                    <>
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-[#CFECE0]" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-2 bg-white text-xs text-gray-500">
                            or sign up with
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full h-11 rounded-lg border-[#CFECE0] hover:bg-[#EBFFF5] flex items-center justify-center space-x-2 transition-colors text-[#7CAE9E] text-md"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                      >
                        <svg
                          className="h-5 w-5"
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
                        <span>Google</span>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>

            {step === 1 && (
              <CardFooter className="justify-center pb-8 px-8">
                <p className="text-xs text-gray-500 text-center">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#7CAE9E] hover:text-[#6a9d8d] hover:underline font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            )}
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

      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
    </div>
  );
}