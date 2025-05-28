import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Mail, Hash } from "lucide-react";

interface VerificationStepProps {
  email: string;
  onBack: () => void;
  onVerify: (code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  verificationError: string;
  verificationSuccess: string;
  resendTimer: number;
  isLoading: boolean;
}

export function VerificationStep({
  email,
  onBack,
  onVerify,
  onResendCode,
  verificationError,
  verificationSuccess,
  resendTimer,
  isLoading,
}: VerificationStepProps) {
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if (verificationCode.length === 6) {
      handleVerify();
    }
  }, [verificationCode]);

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) return;
    await onVerify(verificationCode);
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
                <div className="bg-[#F8E8E9]/80 p-4 rounded-full mb-4">
                  <Hash className="h-8 w-8 text-[#E69EA2]" strokeWidth={2} />
                </div>
                <h1 className="text-3xl font-bold text-[#7CAE9E]">Verify Your Email</h1>
                <div className="flex items-center text-md text-gray-600">
                  <Mail className="h-5 w-5 mr-2 text-[#E69EA2]" />
                  <span className="font-medium">{email}</span>
                </div>
                <p className="text-gray-500 text-md">
                  Enter the 6-digit verification code sent to your email
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-10 pb-8">
              {verificationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-[#F8E8E9]/80 text-[#E69EA2] rounded-lg flex items-center border border-[#FEC0B3]/50"
                >
                  <AlertCircle className="h-6 w-6 mr-3" />
                  <span className="font-medium text-md">{verificationError}</span>
                </motion.div>
              )}

              {verificationSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-[#EBFFF5]/80 text-[#7CAE9E] rounded-lg flex items-center border border-[#CFECE0]"
                >
                  <CheckCircle className="h-6 w-6 mr-3" />
                  <span className="font-medium text-md">{verificationSuccess}</span>
                </motion.div>
              )}

              <div className="space-y-3">
                <Label htmlFor="code" className="text-[#7CAE9E] font-medium text-md">
                  Verification Code
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Hash className="h-6 w-6 text-[#E69EA2]" />
                  </div>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    placeholder="••••••"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setVerificationCode(value);
                    }}
                    maxLength={6}
                    className="pl-12 text-lg font-mono tracking-widest h-14 rounded-xl border-[#CFECE0] focus:ring-2 focus:ring-[#7CAE9E]/50 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 h-14 rounded-xl border-[#CFECE0] hover:bg-[#EBFFF5] text-[#7CAE9E] hover:text-[#6a9d8d]"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  <span className="text-md">Back</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleVerify}
                  className="flex-1 h-14 rounded-xl bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] hover:from-[#d18e92] hover:to-[#eeb0a5] text-white"
                  disabled={isLoading || verificationCode.length !== 6}
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
                    <span className="font-medium">Verify Account</span>
                  )}
                </Button>
              </div>

              <div className="text-center text-md text-gray-500 mt-6">
                <p>
                  Didn't receive a code?{" "}
                  <button
                    onClick={onResendCode}
                    className={`font-medium ${
                      resendTimer > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#7CAE9E] hover:underline hover:text-[#6a9d8d]"
                    }`}
                    disabled={resendTimer > 0}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}