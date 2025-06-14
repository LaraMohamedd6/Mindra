import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle, ChevronLeft, RotateCw, Mail, Hash } from "lucide-react";

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

  // Auto-submit when 6 digits are entered
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
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="bg-zenSage/20 p-3 rounded-full">
          <Hash className="h-7 w-7 text-zenSage" strokeWidth={2} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Verify Your Email</h2>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-1" />
          <span className="font-medium">{email}</span>
        </div>
        <p className="text-sm text-gray-500">
          Enter the 6-digit verification code sent to your email
        </p>
      </div>

      {verificationError && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm flex items-start">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{verificationError}</span>
        </div>
      )}

      {verificationSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-md text-sm flex items-start">
          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{verificationSuccess}</span>
        </div>
      )}

      <div>
        <Label htmlFor="code" className="text-gray-700 font-medium">
          Verification Code
        </Label>
        <div className="relative mt-1">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
            className="pl-10 text-lg font-mono tracking-widest h-12 focus:border-zenSage border-gray-300"
            autoFocus
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-11 gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleVerify}
          className="flex-1 h-11 bg-zenSage hover:bg-zenSage/90 text-white"
          disabled={isLoading || verificationCode.length !== 6}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <RotateCw className="h-4 w-4 animate-spin" />
              Verifying...
            </span>
          ) : (
            "Verify Account"
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>
          Didn't receive a code?{" "}
          <button
            onClick={onResendCode}
            className={`font-medium ${
              resendTimer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-zenSage hover:underline"
            }`}
            disabled={resendTimer > 0}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
          </button>
        </p>
      </div>
    </div>
  );
}