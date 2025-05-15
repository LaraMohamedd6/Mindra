import { useEffect, useState } from "react";
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
  LogIn,
  Key,
  AtSign,
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle,
  Mail,
} from "lucide-react";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);

  const navigate = useNavigate();

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

  const handleGoogleLogin = () => {
    window.location.href = "https://localhost:7223/api/account/google-login";
  };

  // Add this useEffect to handle the callback
  useEffect(() => {
    // Check for token in URL after Google auth redirect
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Store token and redirect to home
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    // Check for token in URL after Google auth redirect
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (token && email) {
      // Store token and redirect to complete profile
      localStorage.setItem("tempToken", token);
      navigate("/complete-profile", { state: { email } });
    } else if (token) {
      // Profile is complete, store token and redirect to home
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [navigate]);

  const checkGoogleAuthStatus = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7223/api/account/google-response"
      );

      if (response.data.needsProfileCompletion) {
        // Redirect to complete profile page
        navigate("/complete-profile", { state: { fromGoogle: true } });
      } else {
        // If profile is already complete (shouldn't happen with this flow)
        const tokenResponse = await axios.post(
          "https://localhost:7223/api/account/complete-profile",
          {}, // Empty body since profile is complete
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        localStorage.setItem("token", tokenResponse.data.token);
        navigate("/");
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      // Handle error
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    const passwordErrors = passwordRequirements
      .filter((req) => !req.validator(formData.password))
      .map((req) => req.text);

    if (passwordErrors.length > 0) {
      newErrors.password = `Password must contain: ${passwordErrors.join(
        ", "
      )}`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        "https://localhost:7223/api/Account/resend-verification",
        {
          email: formData.email,
        }
      );

      // Redirect to verification page
      navigate("/verify-email", { state: { email: formData.email } });
    } finally {
      setIsLoading(false);
      setShowVerificationPrompt(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setShowVerificationPrompt(false);

    try {
      const response = await axios.post(
        "https://localhost:7223/api/Account/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      let showVerificationOption = false;

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;

        switch (status) {
          case 401: // Unauthorized - Invalid credentials
            errorMessage = "Invalid email or password. Please try again.";
            break;

          case 403: // Forbidden - Account not verified
            errorMessage =
              "Account not verified. Please check your email for verification instructions.";
            showVerificationOption = true;
            break;

          case 500: // Server Error
            errorMessage = "Server error. Please try again later.";
            break;

          default:
            // Handle other status codes or use the message from response if available
            if (typeof responseData === "string") {
              errorMessage = responseData;
            } else if (responseData?.message) {
              errorMessage = responseData.message;
            }
            break;
        }
      }

      setErrors({ general: errorMessage });

      if (showVerificationOption) {
        setShowVerificationPrompt(true);
      }
    } finally {
      setIsLoading(false);
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
            Mindra
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
                <p className="text-gray-500">
                  Sign in to continue your wellness journey
                </p>
              </div>
            </CardHeader>

            <CardContent>
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex flex-col"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{errors.general}</span>
                  </div>

                  {showVerificationPrompt && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <div className="flex items-start mb-2">
                        <Mail className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">
                          Didn't receive a verification email? We can send you a
                          new one.
                        </p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={handleResendVerification}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={isLoading}
                          size="sm"
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                              />
                              Sending...
                            </div>
                          ) : (
                            "Send New Code"
                          )}
                        </Button>
                        <Button
                          onClick={() => setShowVerificationPrompt(false)}
                          variant="outline"
                          size="sm"
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 ${
                        errors.email ? "border-red-500" : ""
                      }`}
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

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 pr-10 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

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

                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-zenSage hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-zenSage hover:bg-zenSage/90 h-11 transition-colors duration-200"
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
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>

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
                <span className="relative bg-white px-2 text-xs text-gray-400">
                  or continue with
                </span>
              </div>

              <div className="flex justify-center w-full">
                <Button
                  variant="outline"
                  className="flex items-center justify-center w-64" // Fixed width (16rem = 256px)
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg className="h-5 w-5 text-[#4285F4]" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  <span className="ml-2">Google</span>
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
            className="text-sm text-gray-500 hover:text-zenSage flex items-center justify-center transition-colors duration-200"
          >
            Return to home page <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
