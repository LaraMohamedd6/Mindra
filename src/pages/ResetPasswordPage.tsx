import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Key, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import axios from "axios";

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
    { id: 1, text: "Minimum 8 characters", validator: (pass: string) => pass.length >= 8 },
    { id: 2, text: "At least one uppercase letter", validator: (pass: string) => /[A-Z]/.test(pass) },
    { id: 3, text: "At least one lowercase letter", validator: (pass: string) => /[a-z]/.test(pass) },
    { id: 4, text: "At least one number", validator: (pass: string) => /[0-9]/.test(pass) },
    { id: 5, text: "At least one special character", validator: (pass: string) => /[^A-Za-z0-9]/.test(pass) }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zenLightPink to-white p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="bg-zenSage/10 p-3 rounded-full">
                  <Key className="h-6 w-6 text-zenSage" />
                </div>
                <h1 className="text-2xl font-semibold">Create New Password</h1>
                <p className="text-gray-500">
                  Choose a strong new password for your account
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 text-red-600 rounded-md flex items-center"
                  >
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-50 text-green-600 rounded-md flex items-center"
                  >
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{success}</span>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map(req => (
                      <div key={req.id} className="flex items-center">
                        {req.validator(newPassword) ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                        )}
                        <span className={`text-xs ${req.validator(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-zenSage hover:bg-zenSage/90 h-11 transition-colors duration-200"
                  disabled={isLoading || !newPassword || !confirmPassword}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Resetting...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}