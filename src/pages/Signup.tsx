import { useState, useEffect } from "react";
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
import { VerificationStep } from "./VerificationStep"; // Import the new component

export default function Signup() {
  // Form state
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

  // Password requirements
  const passwordRequirements = [
    {
      id: 1,
      text: "Minimum 8 characters",
      validator: (pass: string) => pass.length >= 8,
    },
    {
      id: 2,
      text: "At least one uppercase letter",
      validator: (pass: string) => /[A-Z]/.test(pass),
    },
    {
      id: 3,
      text: "At least one lowercase letter",
      validator: (pass: string) => /[a-z]/.test(pass),
    },
    {
      id: 4,
      text: "At least one number",
      validator: (pass: string) => /[0-9]/.test(pass),
    },
    {
      id: 5,
      text: "At least one special character",
      validator: (pass: string) => /[^A-Za-z0-9]/.test(pass),
    },
  ];

  // Gender options
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0 && step === 3) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer, step]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Check availability of username and email
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

  // Validate Step 1 (Personal Info)
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
    } else if (Number(formData.age) < 10) {
      newErrors.age = "You must be at least 10 years old";
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
    
    // If there are basic validation errors, don't proceed to check availability
    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    // Check availability only if basic validation passes
    const availabilityResult = await checkAvailability();
    
    if (!availabilityResult) {
      setErrors(prev => ({
        ...prev,
        form: "Failed to check availability. Please try again."
      }));
      return false;
    }

    // Check if username or email is taken
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

  // Validate Step 2 (Security Info)
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

  // Handle next step
  const handleNextStep = async () => {
    if (step === 1) {
      // Validate step 1 and check availability
      const isValid = await validateStep1();
      if (isValid) {
        setStep(2);
      }
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  // Handle form submission
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

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center w-full justify-between mt-4 px-8">
      {[1, 2, 3].map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center ${
                step === stepNumber
                  ? "bg-zenSage text-white"
                  : step > stepNumber
                  ? "bg-zenSage/30 text-white"
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
                step > stepNumber ? "bg-zenSage" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Error message component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-start mt-1 text-sm text-red-600">
      <AlertCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );

  // Success message component
  const SuccessMessage = ({ message }: { message: string }) => (
    <div className="flex items-start mt-1 text-sm text-green-600">
      <CheckCircle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );

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
                  <UserPlus className="h-6 w-6 text-zenSage" />
                </div>
                <h1 className="text-2xl font-semibold">
                  {step === 1 && "Create Account"}
                  {step === 2 && "Account Security"}
                  {step === 3 && "You're Almost There!"}
                </h1>
                <p className="text-gray-500">
                  {step === 1 && "Join our community for better mental wellness"}
                  {step === 2 && "Set up your account security"}
                  {step === 3 && "Enter the code sent to your email"}
                </p>
                <StepIndicator />
              </div>
            </CardHeader>

            <CardContent>
              {errors.form && (
                <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700">
                      Full Name
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`pl-10 ${
                          errors.fullName ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.fullName && <ErrorMessage message={errors.fullName} />}
                  </div>

                  {/* Username */}
                  <div>
                    <Label htmlFor="username" className="text-gray-700">
                      Username
                    </Label>
                    <div className="relative mt-1">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="username"
                        name="username"
                        placeholder="yourusername"
                        value={formData.username}
                        onChange={handleChange}
                        className={`pl-10 ${
                          errors.username ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.username && <ErrorMessage message={errors.username} />}
                  </div>

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
                        min="10"
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
                    {errors.age && <ErrorMessage message={errors.age} />}
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
                    {errors.gender && <ErrorMessage message={errors.gender} />}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-gray-700">
                      Email
                    </Label>
                    <div className="relative mt-1">
                      <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.email && <ErrorMessage message={errors.email} />}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {/* Password */}
                  <div>
                    <Label htmlFor="password" className="text-gray-700">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className={`pl-10 pr-10 ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Password Requirements */}
                    <div className="mt-2 space-y-1">
                      {passwordRequirements.map((req) => (
                        <div key={req.id} className="flex items-center">
                          {req.validator(formData.password) ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                          )}
                          <span
                            className={`text-xs ${
                              req.validator(formData.password)
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {errors.password && <ErrorMessage message={errors.password} />}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className="text-gray-700"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative mt-1">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`pl-10 pr-10 ${
                          errors.confirmPassword ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <ErrorMessage message={errors.confirmPassword} />
                    )}
                  </div>

                  {/* Terms Checkbox */}
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
                        I agree to the Terms of Service and Privacy Policy
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
            </CardContent>

            {step !== 3 && (
              <CardFooter className="justify-center flex-col space-y-4 pb-6">
                <div className="w-full">
                  <Button
                    onClick={handleNextStep}
                    className="w-full bg-zenSage hover:bg-zenSage/90 h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RotateCw className="h-4 w-4 animate-spin" />
                    ) : checkingAvailability ? (
                      "Checking availability..."
                    ) : step === 1 ? (
                      "Continue to Security"
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>

                {step === 1 && (
                  <>
                    <div className="text-sm text-gray-500">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-zenSage hover:underline font-medium"
                      >
                        Sign in
                      </Link>
                    </div>
                    <div className="relative w-full flex items-center justify-center">
                      <div className="absolute border-t border-gray-200 w-full"></div>
                      <span className="relative bg-white px-2 text-xs text-gray-400">
                        or sign up with
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2"
                      >
                        <svg
                          className="h-5 w-5 text-[#4285F4]"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                          />
                        </svg>
                        Google
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2"
                      >
                        <svg
                          className="h-5 w-5 text-[#1877F2]"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
                          />
                        </svg>
                        Facebook
                      </Button>
                    </div>
                  </>
                )}
              </CardFooter>
            )}
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