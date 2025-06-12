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
import Logo from "@/assets/images/UpdatedLOGO.jpg";

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
    { id: 1, text: "8+ chars", validator: (pass: string) => pass.length >= 8 },
    { id: 2, text: "A-Z", validator: (pass: string) => /[A-Z]/.test(pass) },
    { id: 3, text: "a-z", validator: (pass: string) => /[a-z]/.test(pass) },
    { id: 4, text: "0-9", validator: (pass: string) => /[0-9]/.test(pass) },
    { id: 5, text: "!@#", validator: (pass: string) => /[^A-Za-z0-9]/.test(pass) },
  ];

  const handleGoogleLogin = () => {
    window.location.href = "https://localhost:7223/api/account/google-login";
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (token && email) {
      localStorage.setItem("tempToken", token);
      navigate("/complete-profile", { state: { email } });
    } else if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [navigate]);

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
      newErrors.password = `Password requirements not met`;
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
        { email: formData.email }
      );
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
        { email: formData.email, password: formData.password }
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
          case 401:
            errorMessage = "Invalid email or password. Please try again.";
            break;
          case 403:
            errorMessage = "Account not verified. Please check your email for verification instructions.";
            showVerificationOption = true;
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            if (typeof responseData === "string") {
              errorMessage = responseData;
            } else if (responseData?.message) {
              errorMessage = responseData.message;
            }
            break;
        }
      }

      setErrors({ general: errorMessage });
      if (showVerificationOption) setShowVerificationPrompt(true);
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
              <div className="flex flex-col items-start"> {/* Changed to items-start */}
                <div className="flex items-start gap-4"> {/* Horizontal alignment */}
                  {/* Logo on the left */}
                  <img
                    src={Logo}
                    alt="Mindra Logo"
                    className="h-24 w-24 object-contain rounded-full border-4 border-white"
                  />
                  {/* Header and paragraph stacked to the right */}
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-[#7CAE9E] mt-3">Welcome Back to MINDRA</h1>
                    <p className="text-gray-500 text-sm mt-1">
                      Sign in to continue your wellness journey
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-6">
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-3 bg-[#F8E8E9]/80 text-[#E69EA2] rounded-lg border border-[#FEC0B3]/50 flex flex-col"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="font-medium text-sm">{errors.general}</span>
                  </div>

                  {showVerificationPrompt && (
                    <div className="mt-3 p-3 bg-[#EBFFF5]/80 rounded-md border border-[#CFECE0]">
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-[#7CAE9E] mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#7CAE9E]">
                          Didn't receive a verification email? We can send you a new one.
                        </p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={handleResendVerification}
                          className="bg-[#7CAE9E] hover:bg-[#6a9d8d] text-white text-sm h-9 px-4"
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
                          className="border-[#CFECE0] text-[#7CAE9E] hover:bg-[#EBFFF5] h-9 px-4"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#7CAE9E] font-medium text-sm">
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AtSign className="h-5 w-5 text-[#E69EA2]" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 h-14 rounded-lg text-sm ${errors.email ? "border-[#E69EA2] focus:ring-[#F8E8E9]" : "border-[#CFECE0] focus:ring-[#EBFFF5]"
                        } focus:ring-2 focus:border-transparent`}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[#E69EA2] text-xs mt-1 flex items-start"
                    >
                      <AlertCircle className="h-3.5 w-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[#7CAE9E] font-medium text-sm">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-[#7CAE9E] hover:text-[#6a9d8d] hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-[#E69EA2]" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 pr-10 h-14 rounded-lg text-sm ${errors.password ? "border-[#E69EA2] focus:ring-[#F8E8E9]" : "border-[#CFECE0] focus:ring-[#EBFFF5]"
                        } focus:ring-2 focus:border-transparent`}
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

                  {formData.password && (
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
                          <span className={`text-[10px] mt-0.5 ${req.validator(formData.password)
                            ? "text-[#7CAE9E]"
                            : "text-gray-400"
                            }`}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[#E69EA2] text-xs mt-1 flex items-start"
                    >
                      <AlertCircle className="h-3.5 w-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
                      {errors.password}
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
                      Signing In...
                    </div>
                  ) : (
                    <span className="flex items-center">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </span>
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#CFECE0]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-xs text-gray-500">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
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
              </div>
            </CardContent>

            <CardFooter className="justify-center pb-8 px-8">
              <p className="text-xs text-gray-500 text-center">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#7CAE9E] hover:text-[#6a9d8d] hover:underline font-medium transition-colors"
                >
                  Sign up now
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