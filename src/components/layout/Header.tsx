
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, Info, BookOpen, Music, YogaIcon, Heart, Brain, 
  Activity, Calendar, Clock, User, MessageCircle, 
  Bot, LifeBuoy, Menu, X
} from "lucide-react";

const navLinks = [
  { name: "Home", icon: <Home className="w-4 h-4 mr-1" />, path: "/" },
  { name: "Information Hub", icon: <Info className="w-4 h-4 mr-1" />, path: "/information" },
  { name: "Resources", icon: <BookOpen className="w-4 h-4 mr-1" />, path: "/resources" },
  { name: "Entertainment", icon: <Music className="w-4 h-4 mr-1" />, path: "/entertainment" },
  { name: "Yoga", icon: <YogaIcon className="w-4 h-4 mr-1" />, path: "/yoga" },
  { name: "Meditation", icon: <Brain className="w-4 h-4 mr-1" />, path: "/meditation" },
  { name: "Fitness", icon: <Activity className="w-4 h-4 mr-1" />, path: "/fitness" },
  { name: "Lifestyle", icon: <Calendar className="w-4 h-4 mr-1" />, path: "/lifestyle" },
  { name: "Study Helper", icon: <Clock className="w-4 h-4 mr-1" />, path: "/study" },
  { name: "K10 Test", icon: <Heart className="w-4 h-4 mr-1" />, path: "/k10test" },
  { name: "Chat Room", icon: <MessageCircle className="w-4 h-4 mr-1" />, path: "/chatroom" },
  { name: "Chat Bot", icon: <Bot className="w-4 h-4 mr-1" />, path: "/chatbot" },
  { name: "Emergency", icon: <LifeBuoy className="w-4 h-4 mr-1" />, path: "/emergency" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 mx-auto px-4">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
          <div className="rounded-full bg-gradient-to-br from-zenPink to-zenPeach p-1.5">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-semibold text-xl">ZenZone</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.slice(0, 7).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link flex items-center ${
                location.pathname === link.path ? "active" : ""
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          <Button 
            asChild
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:text-zenPink"
          >
            <Link to="/profile">
              <User className="w-5 h-5 mr-1" />
              Profile
            </Link>
          </Button>
          
          <Button 
            asChild
            className="bg-zenPink hover:bg-zenPink/90 text-white"
            size="sm"
          >
            <Link to="/login">Sign In</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-800" />
          ) : (
            <Menu className="w-6 h-6 text-gray-800" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container py-3 px-4">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center p-3 rounded-lg ${
                    location.pathname === link.path
                      ? "bg-zenLightPink text-zenPink"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
              <Link
                to="/profile"
                className={`flex items-center p-3 rounded-lg ${
                  location.pathname === "/profile"
                    ? "bg-zenLightPink text-zenPink"
                    : "hover:bg-gray-100"
                }`}
              >
                <User className="w-4 h-4 mr-3" />
                <span>Profile</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center p-3 bg-zenPink text-white rounded-lg"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
