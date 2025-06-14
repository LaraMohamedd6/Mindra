import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VerificationStep } from "./VerificationStep";
import axios from "axios";
import { Card } from "@/components/ui/card";
/* import { Logo } from "@/components/Logo";
 */import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-lg border-0 rounded-xl bg-white/90 backdrop-blur-sm">
          <div className="flex flex-col items-center mb-8">
{/*             <Logo className="h-14 w-auto mb-4 text-zenSage" />
 */}            
 
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-zenSage to-zenEmerald bg-clip-text ">
              You're almost there !
            </h1>
          </div>
          
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
        </Card>

        <motion.div 
          className="mt-6 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>
            Need help?{" "}
            <a href="/contact" className="font-medium text-zenSage hover:text-zenEmerald transition-colors hover:underline">
              Contact support
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}