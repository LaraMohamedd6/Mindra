import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Key, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

export function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
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

  const handleVerify = async () => {
    setIsLoading(true);
    setVerificationError("");
    setVerificationSuccess("");

    try {
      await axios.post("https://localhost:7223/api/Account/verify", { email, code });
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden border border-[#CFECE0]" // Changed max-w-md to max-w-lg
      >
        {/* Header accent - made slightly thicker */}
        <div className="bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] h-3 w-full" />
        
        {/* Increased padding from p-8 to p-10 */}
        <div className="p-10">
          {/* Increased text size for heading */}
          <h1 className="text-3xl font-bold text-[#7CAE9E] mb-4">Verify Your Email</h1>
          
          {/* Slightly larger text */}
          <p className="text-gray-600 text-lg mb-8">
            We've sent a 6-digit code to <span className="font-medium text-[#7CAE9E]">{email}</span>.
            Please enter it below to verify your account.
          </p>

          {/* Verification code input - increased size */}
          <div className="space-y-6 mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="pl-12 h-16 text-lg rounded-xl border-[#CFECE0] focus:ring-2 focus:ring-[#7CAE9E]/50" // Increased height and text size
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key className="h-6 w-6 text-[#E69EA2]" /> {/* Slightly larger icon */}
              </div>
            </div>

            {verificationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center p-4 bg-[#F8E8E9]/80 text-[#E69EA2] rounded-lg text-lg" // Increased padding and text size
              >
                <AlertCircle className="h-6 w-6 mr-3" />
                <span>{verificationError}</span>
              </motion.div>
            )}

            {verificationSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center p-4 bg-[#EBFFF5]/80 text-[#7CAE9E] rounded-lg text-lg" // Increased padding and text size
              >
                <CheckCircle className="h-6 w-6 mr-3" />
                <span>{verificationSuccess}</span>
              </motion.div>
            )}
          </div>

          {/* Verify button - increased size */}
          <Button
            onClick={handleVerify}
            className="w-full h-16 text-lg bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] hover:from-[#d18e92] hover:to-[#eeb0a5] text-white rounded-xl shadow-md mb-6" // Increased height
            disabled={isLoading || !code}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-7 w-7 border-2 border-white border-t-transparent rounded-full mr-3" // Slightly larger spinner
                />
                Verifying...
              </div>
            ) : (
              "Verify Email"
            )}
          </Button>

          {/* Resend code - slightly larger text */}
          <div className="text-center">
            <button
              onClick={handleResendCode}
              disabled={resendTimer > 0}
              className={`text-lg ${resendTimer > 0 ? 'text-gray-400' : 'text-[#7CAE9E] hover:text-[#6a9d8d]'} transition-colors`}
            >
              {resendTimer > 0 ? (
                `Resend code in ${resendTimer}s`
              ) : (
                "Didn't receive a code? Resend"
              )}
            </button>
          </div>
        </div>

        {/* Footer link - slightly larger */}
        <div className="border-t border-[#CFECE0] p-5 text-center">
          <Link
            to="/"
            className="text-lg text-[#7CAE9E] hover:text-[#6a9d8d] inline-flex items-center"
          >
            Return to home page
            <ChevronRight className="h-6 w-6 ml-2" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}