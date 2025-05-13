import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      // Store the token and redirect to home
      localStorage.setItem("token", token);
      navigate("/");
    } else {
      // No token found - show error and redirect to login
      toast({
        title: "Authentication Failed",
        description: "No authentication token found",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [navigate, searchParams, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-zenSage" />
      <h1 className="text-2xl font-semibold">Authenticating...</h1>
      <p className="text-gray-500">Please wait while we log you in</p>
    </div>
  );
}