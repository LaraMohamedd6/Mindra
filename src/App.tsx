
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/information" element={<Information />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/mood-tracker" element={<MoodTracker />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/k10test" element={<K10Test />} />
            <Route path="/fitness" element={<Fitness />} />
            <Route path="/yoga" element={<Yoga />} />
            <Route path="/lifestyle" element={<Lifestyle />} />
            <Route path="/study-helper" element={<StudyHelper />} />
            <Route path="/chatroom" element={<ChatRoomsList />} />
            <Route path="/chat-room/:roomId" element={<ChatRoomView />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
