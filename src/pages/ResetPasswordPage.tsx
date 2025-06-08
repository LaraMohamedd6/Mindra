import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Key, AlertCircle, Eye, EyeOff, CheckCircle, ChevronRight } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

export function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { email, code } = location.state || {};

  if (!email || !code) {
    navigate("/forgot-password");
  }

  const passwordRequirements = [
    { id: 1, text: "8+ chars", validator: (pass: string) => pass.length >= 8 },
    { id: 2, text: "A-Z", validator: (pass: string) => /[A-Z]/.test(pass) },
    { id: 3, text: "a-z", validator: (pass: string) => /[a-z]/.test(pass) },
    { id: 4, text: "0-9", validator: (pass: string) => /[0-9]/.test(pass) },
    { id: 5, text: "!@#", validator: (pass: string) => /[^A-Za-z0-9]/.test(pass) }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7223/api/Account/reset-password",
        { email, code, newPassword }
      );

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to reset password. Please try again."
          : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] p-4">
      <div className="w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white w-full max-w-lg mx-auto">
            <div className="bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] h-3 w-full" />
            <CardHeader className="pb-6 px-10">
              <div className="flex flex-col items-center space-y-2">
                <div className="bg-[#F8E8E9]/80 p-4 rounded-full mb-4">
                  <Key className="h-8 w-8 text-[#E69EA2]" />
                </div>
                <h1 className="text-3xl font-bold text-[#7CAE9E]">Create New Password</h1>
                <p className="text-gray-500 text-md">
                  Choose a strong new password for your account
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-10 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-[#F8E8E9]/80 text-[#E69EA2] rounded-lg flex flex-col border border-[#FEC0B3]/50"
                  >
                    <div className="flex items-center">
                      <AlertCircle className="h-6 w-6 mr-3" />
                      <span className="font-medium text-md">{error}</span>
                    </div>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-[#EBFFF5]/80 text-[#7CAE9E] rounded-lg flex flex-col border border-[#CFECE0]"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 mr-3" />
                      <span className="font-medium text-md">{success}</span>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-3">
                  <Label htmlFor="newPassword" className="text-[#7CAE9E] font-medium text-md">
                    New Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key className="h-6 w-6 text-[#E69EA2]" />
                    </div>
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-12 pr-12 h-14 rounded-xl text-md border-[#CFECE0] focus:ring-2 focus:ring-[#7CAE9E]/50 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#E69EA2] hover:text-[#d18e92] transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                    </button>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-5 gap-1">
                    {passwordRequirements.map(req => (
                      <div key={req.id} className="flex flex-col items-center">
                        <div className="flex items-center space-x-1">
                          {req.validator(newPassword) ? (
                            <CheckCircle className="h-4 w-4 text-[#7CAE9E]" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-[#CFECE0]" />
                          )}
                        </div>
                        <span className={`text-xs mt-1 ${
                          req.validator(newPassword) ? 'text-[#7CAE9E]' : 'text-gray-400'
                        }`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

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
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 h-14 rounded-xl text-md border-[#CFECE0] focus:ring-2 focus:ring-[#7CAE9E]/50 focus:border-transparent"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] hover:from-[#d18e92] hover:to-[#eeb0a5] text-white h-14 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-md"
                  disabled={isLoading || !newPassword || !confirmPassword}
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
                      Resetting...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center pb-10">
              <Link
                to="/"
                className="text-md text-[#7CAE9E] hover:text-[#6a9d8d] flex items-center justify-center transition-colors duration-200"
              >
                Return to home page
                <ChevronRight className="h-5 w-5 ml-1.5 mt-0.5" />
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}