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
              <div className="flex flex-col items-center space-y-2">
                <h1 className="text-3xl font-bold text-[#7CAE9E]">You're Almost There!</h1>
                <p className="text-gray-500 text-md">
                  Verify your email to complete your account setup
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-10 pb-8">
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

            <div className="flex justify-center pb-10">
              <Link
                to="/"
                className="text-md text-[#7CAE9E] hover:text-[#6a9d8d] flex items-center justify-center transition-colors duration-200"
              >
                Return to home page
                <ChevronRight className="h-5 w-5 ml-1.5 mt-0.5" />
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}