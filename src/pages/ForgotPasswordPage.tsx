import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, AlertCircle, ChevronLeft } from "lucide-react";
import axios from "axios";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "https://localhost:7223/api/Account/forgot-password",
        { email }
      );

      setSuccess("Reset code sent to your email. Redirecting...");
      setTimeout(() => navigate("/verify-reset-code", { state: { email } }), 1500);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to send reset code. Please try again."
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
                  <Mail className="h-6 w-6 text-zenSage" />
                </div>
                <h1 className="text-2xl font-semibold">Reset Your Password</h1>
                <p className="text-gray-500">
                  Enter your email to receive a password reset code
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
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
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
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Code'
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-zenSage hover:text-zenEmerald"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}