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
import Logo from "@/assets/images/LOGO.jpg";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F8E8E9] to-[#EBFFF5] p-4">
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
                  <h1 className="text-3xl font-bold text-[#7CAE9E]">Welcome Back</h1>
                  <p className="text-gray-500 text-md mt-2">
                    Sign in to continue your wellness journey
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-10 pb-8">
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-[#F8E8E9]/80 text-[#E69EA2] rounded-lg flex flex-col border border-[#FEC0B3]/50"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-6 w-6 mr-3" />
                    <span className="font-medium text-md">{errors.general}</span>
                  </div>

                  {showVerificationPrompt && (
                    <div className="mt-4 p-4 bg-[#EBFFF5]/80 rounded-md border border-[#CFECE0]">
                      <div className="flex items-start mb-3">
                        <Mail className="h-6 w-6 text-[#7CAE9E] mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-md text-[#7CAE9E]">
                          Didn't receive a verification email? We can send you a new one.
                        </p>
                      </div>
                      <div className="flex gap-3 mt-3">
                        <Button
                          onClick={handleResendVerification}
                          className="bg-[#7CAE9E] hover:bg-[#6a9d8d] text-white shadow-sm text-md h-11"
                          disabled={isLoading}
                          size="lg"
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
                                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"
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
                          size="lg"
                          disabled={isLoading}
                          className="border-[#CFECE0] text-[#7CAE9E] hover:bg-[#EBFFF5] h-11 text-md"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[#7CAE9E] font-medium text-md">
                    Email Address
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
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#E69EA2] text-sm mt-2 flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {errors.email}
                    </motion.p>
                  )}
                </div>

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

                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#E69EA2] text-sm mt-2 flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3">
                  <Link
                    to="/forgot-password"
                    className="text-md text-[#7CAE9E] hover:text-[#6a9d8d] hover:underline font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
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
                      Signing In...
                    </div>
                  ) : (
                    <span className="font-medium">Sign In</span>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center flex-col space-y-6 pb-10 px-10">
              <div className="text-md text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#7CAE9E] hover:text-[#6a9d8d] hover:underline font-medium transition-colors"
                >
                  Sign up now
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