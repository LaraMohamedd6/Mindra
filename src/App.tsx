import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Meditation from "./pages/Meditation";
import Information from "./pages/Information";
import Emergency from "./pages/Emergency";
import MoodTracker from "./pages/MoodTracker";
import Analysis from "./pages/Analysis";
import K10Test from "./pages/K10Test";
import NotFound from "./pages/NotFound";
import Fitness from "./pages/Fitness";
import Yoga from "./pages/Yoga";
import Lifestyle from "./pages/Lifestyle";
import StudyHelper from "./pages/StudyHelper";
import ChatBot from "./pages/ChatBot";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import ChatRoomsList from "./pages/ChatRoomsList";
import ChatRoomView from "./pages/ChatRoomView";
import { VerificationStep } from "./pages/VerificationStep";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { VerifyResetCodePage } from "./pages/VerifyResetCodePage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import CompleteProfile from "./pages/CompleteProfile";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/meditation" element={<ProtectedRoute><Meditation /></ProtectedRoute>} />
            <Route path="/information" element={<Information />} />
            <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
            <Route path="/mood-tracker" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
            <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
            <Route path="/k10test" element={<ProtectedRoute><K10Test /></ProtectedRoute>} />
            <Route path="/fitness" element={<ProtectedRoute><Fitness /></ProtectedRoute>} />
            <Route path="/yoga" element={<ProtectedRoute><Yoga /></ProtectedRoute>} />
            <Route path="/lifestyle" element={<ProtectedRoute><Lifestyle /></ProtectedRoute>} />
            <Route path="/study-helper" element={<ProtectedRoute><StudyHelper /></ProtectedRoute>} />
            <Route path="/chatroom" element={<ProtectedRoute><ChatRoomsList /></ProtectedRoute>} />
            <Route path="/chat-room/:roomId" element={<ProtectedRoute><ChatRoomView /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><ChatBot /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-reset-code" element={<VerifyResetCodePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
            <Route path="/auth-callback" element={<AuthCallback />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
