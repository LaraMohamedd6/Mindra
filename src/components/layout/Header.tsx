
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Menu, X, Brain, Heart } from "lucide-react";

export default function Header() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { text: "Home", path: "/" },
    { text: "Information", path: "/information" },
    { text: "Meditation", path: "/meditation" },
    { text: "K10 Test", path: "/k10test" },
    { text: "Emergency", path: "/emergency" },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="py-4 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-8 h-8 rounded-full bg-zenPink flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-zenSeafoam flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="text-xl font-display font-semibold">ZenZone Connect</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${pathname === link.path ? "active" : ""}`}
                >
                  {link.text}
                </Link>
              ))}
            </nav>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <>
                <Button variant="outline" asChild className="border-zenSage text-zenSage hover:bg-zenSage/10">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild className="bg-zenSage hover:bg-zenSage/90 text-white">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg py-2 ${pathname === link.path ? "text-zenPink" : "text-gray-700"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.text}
                </Link>
              ))}
              <div className="pt-4 flex flex-col space-y-3 border-t border-gray-100">
                <Button variant="outline" asChild className="w-full border-zenSage text-zenSage hover:bg-zenSage/10">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild className="w-full bg-zenSage hover:bg-zenSage/90 text-white">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}
