import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VerificationStep } from "./VerificationStep";
import axios from "axios";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationError, setVerificationError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  const email = location.state?.email || "";

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    setVerificationError("");
    setVerificationSuccess("");

    try {
      const response = await axios.post(
        "https://localhost:7223/api/Account/verify",
        { email, code }
      );

      setVerificationSuccess("Verification successful! Redirecting...");
      setTimeout(() => navigate("/login?verified=true"), 1500);
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
      await axios.post("https://localhost:7223/api/Account/resend-verification", { email });
      setVerificationSuccess("New verification code sent to your email");
      setResendTimer(30);
    } catch (err) {
      setVerificationError("Failed to resend code. Please try again.");
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
              <div className="flex flex-col items-center space-y-2">
                <h1 className="text-3xl font-bold text-[#7CAE9E]">You're Almost There!</h1>
                <p className="text-gray-500 text-sm">
                  Verify your email to complete your account setup
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-6">
              <VerificationStep
                email={email}
                onBack={() => navigate(-1)}
                onVerify={handleVerify}
                onResendCode={handleResendCode}
                verificationError={verificationError}
                verificationSuccess={verificationSuccess}
                resendTimer={resendTimer}
                isLoading={isLoading}
              />
            </CardContent>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pb-8 px-8"
            >
              <Link
                to="/"
                className="text-xs text-[#7CAE9E] hover:text-[#6a9d8d] flex items-center justify-center transition-colors duration-200"
              >
                Return to home page
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );

}