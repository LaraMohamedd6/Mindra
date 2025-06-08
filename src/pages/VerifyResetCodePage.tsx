import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, ChevronLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export function VerifyResetCodePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [email, setEmail] = useState(location.state?.email || "");

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }

    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer, email, navigate]);

  const handleVerify = async () => {
    setIsLoading(true);
    setError("");

    try {
      await axios.post("https://localhost:7223/api/Account/verify-reset-code", {
        email,
        code,
      });

      navigate("/reset-password", { state: { email, code } });
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data || "Invalid or expired code. Please try again."
          : "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    try {
      setIsLoading(true);
      await axios.post("https://localhost:7223/api/Account/forgot-password", {
        email,
      });
      setResendTimer(30);
    } catch (err) {
      setError("Failed to resend code. Please try again.");
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
                  <Mail className="h-8 w-8 text-[#E69EA2]" />
                </div>
                <h1 className="text-3xl font-bold text-[#7CAE9E]">Enter Reset Code</h1>
                <p className="text-gray-500 text-md">
                  We sent a 6-digit code to {email}
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-10 pb-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-[#F8E8E9]/80 text-[#E69EA2] rounded-lg flex items-center border border-[#FEC0B3]/50"
                >
                  <AlertCircle className="h-6 w-6 mr-3" />
                  <span className="font-medium text-md">{error}</span>
                </motion.div>
              )}

              <div className="space-y-3">
                <Label htmlFor="code" className="text-[#7CAE9E] font-medium text-md">
                  Verification Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="text-center text-lg font-mono tracking-widest h-14 rounded-xl border-[#CFECE0] focus:ring-2 focus:ring-[#7CAE9E]/50 focus:border-transparent"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleVerify}
                className="w-full bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] hover:from-[#d18e92] hover:to-[#eeb0a5] text-white h-14 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-md mt-6"
                disabled={isLoading || code.length !== 6}
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
                    Verifying...
                  </div>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="text-center text-md text-gray-500 mt-6">
                <p>
                  Didn't receive a code?{" "}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendTimer > 0}
                    className={`font-medium ${
                      resendTimer > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#7CAE9E] hover:underline hover:text-[#6a9d8d]"
                    }`}
                  >
                    {resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : "Resend now"}
                  </button>
                </p>
              </div>
            </CardContent>

            <CardFooter className="justify-center pb-10">
              <Button
                variant="ghost"
                onClick={() => navigate("/forgot-password")}
                className="text-[#7CAE9E] hover:text-[#6a9d8d] hover:bg-transparent"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                <span className="text-md">Back to Email Entry</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
