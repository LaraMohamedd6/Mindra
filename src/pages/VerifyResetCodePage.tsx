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
      const response = await axios.post(
        "https://localhost:7223/api/Account/verify-reset-code",
        { email, code }
      );

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
      await axios.post("https://localhost:7223/api/Account/forgot-password", { email });
      setResendTimer(30);
    } catch (err) {
      setError("Failed to resend code. Please try again.");
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
                <h1 className="text-2xl font-semibold">Enter Reset Code</h1>
                <p className="text-gray-500">
                  We sent a 6-digit code to {email}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg font-mono tracking-widest"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleVerify}
                className="w-full bg-zenSage hover:bg-zenSage/90 h-11 transition-colors duration-200"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Verifying...
                  </div>
                ) : (
                  'Verify Code'
                )}
              </Button>

              <div className="text-center text-sm text-gray-500">
                <p>
                  Didn't receive a code?{" "}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendTimer > 0}
                    className={`font-medium ${resendTimer > 0 ? 'text-gray-400' : 'text-zenSage hover:underline'}`}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend now'}
                  </button>
                </p>
              </div>
            </CardContent>

            <CardFooter className="justify-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/forgot-password")}
                className="text-zenSage hover:text-zenEmerald"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Email Entry
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}