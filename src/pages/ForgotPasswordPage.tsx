import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, AlertCircle, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f2] p-4">
      <div className="w-full max-w-lg"> {/* Increased width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-[#FFFFFF] backdrop-blur-sm w-full mx-auto">
            <div className="bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] h-2 w-full" />
            
            <CardHeader className="pb-4 pt-10 px-10"> {/* Increased padding */}
              <div className="flex flex-col items-center">
                {/* Replaced logo with email icon from original design */}
                <div className="bg-[#F8E8E9]/80 p-4 rounded-full mb-4">
                  <Mail className="h-8 w-8 text-[#E69EA2]" />
                </div>
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-[#7CAE9E]">Reset Your Password</h1>
                  <p className="text-gray-500 text-md mt-2">
                    Enter your email to receive a password reset code
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-10 pb-8"> {/* Increased padding */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-3 bg-[#F8E8E9]/80 text-[#E69EA2] rounded-lg border border-[#FEC0B3]/50 flex flex-col"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="font-medium text-sm">{error}</span>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-3 bg-[#EBFFF5]/80 text-[#7CAE9E] rounded-lg border border-[#CFECE0] flex flex-col"
                >
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="font-medium text-sm">{success}</span>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased spacing */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[#7CAE9E] font-medium text-md">
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-6 w-6 text-[#E69EA2]" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 rounded-xl text-md border-[#CFECE0] focus:ring-2 focus:ring-[#EBFFF5] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] hover:from-[#d18e92] hover:to-[#eeb0a5] text-white h-14 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-md font-medium"
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
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Code'
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center pb-8 px-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-[#7CAE9E] hover:text-[#6a9d8d] hover:bg-transparent text-md"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back to Login
              </Button>
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