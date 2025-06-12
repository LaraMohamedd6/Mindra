import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import UpdatedLogo from "@/assets/images/UpdatedLOGO.jpg"; // Import the new logo

export default function Header() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
    localStorage.clear();
    setMobileMenuOpen(false);
  };

  return (
    <header className="py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={UpdatedLogo} 
              alt="Mindra Logo" 
              className="h-12 w-auto" 
            />
            <span className="text-xl font-display font-semibold">Mindra</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-zenPink">Wellness</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {[
                        { title: "Meditation", href: "/meditation", description: "Guided mindfulness practices" },
                        { title: "Yoga", href: "/yoga", description: "Simple poses for small spaces" },
                        { title: "Fitness", href: "/fitness", description: "Student-friendly workouts" },
                        { title: "Lifestyle", href: "/lifestyle", description: "Healthy habits for students" }
                      ].map((item) => (
                        <li key={item.title}>
                          <Link
                            to={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === item.href ? "bg-zenLightPink/50" : ""
                            )}
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{item.description}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-zenPink">Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {[
                        { title: "Mental Health Info", href: "/information", description: "Evidence-based resources" },
                        { title: "Emergency Support", href: "/emergency", description: "Crisis resources" },
                        { title: "Study Helper", href: "/study-helper", description: "Tools for academic success" },
                        { title: "Depression Severity Test", href: "/k10test", description: "Mental wellbeing check" }
                      ].map((item) => (
                        <li key={item.title}>
                          <Link
                            to={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === item.href ? "bg-zenLightPink/50" : ""
                            )}
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{item.description}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-zenPink">Connect</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {[
                        { title: "Chat Room", href: "/chatroom", description: "Connect with other students" },
                        { title: "Chat Bot", href: "/chatbot", description: "AI wellness assistant" },
                        { title: "About Us", href: "/about", description: "Our mission and team" },
                        { title: "Contact Us", href: "/contact", description: "Get in touch with us" }
                      ].map((item) => (
                        <li key={item.title}>
                          <Link
                            to={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === item.href ? "bg-zenLightPink/50" : ""
                            )}
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{item.description}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-zenPink">Tracking</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {[
                        { title: "Analysis", href: "/analysis", description: "Visualize your progress" },
                        { title: "Profile", href: "/profile", description: "Your personal dashboard" }
                      ].map((item) => (
                        <li key={item.title}>
                          <Link
                            to={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === item.href ? "bg-zenLightPink/50" : ""
                            )}
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{item.description}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <>
                {!isAuthenticated ? (
                  <>
                    <Button variant="outline" asChild className="border-zenSage text-zenSage hover:bg-zenSage/10">
                      <Link to="/login">Log In</Link>
                    </Button>
                    <Button asChild className="bg-zenSage hover:bg-zenSage/90 text-white">
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    className="border-zenPink text-zenPink hover:bg-zenPink/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                )}
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
            <nav className="py-4">
              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-500 mb-2 px-3">Wellness</div>
                {[
                  { text: "Meditation", path: "/meditation" },
                  { text: "Yoga", path: "/yoga" },
                  { text: "Fitness", path: "/fitness" },
                  { text: "Lifestyle", path: "/lifestyle" }
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 px-3 text-base ${pathname === link.path ? "text-zenPink" : "text-gray-700"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
              
              {/* Other menu sections... */}
              
              <div className="pt-4 flex flex-col space-y-3 border-t border-gray-100">
                {!isAuthenticated ? (
                  <>
                    <Button variant="outline" asChild className="w-full border-zenSage text-zenSage hover:bg-zenSage/10">
                      <Link to="/login">Log In</Link>
                    </Button>
                    <Button asChild className="w-full bg-zenSage hover:bg-zenSage/90 text-white">
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full border-zenPink text-zenPink hover:bg-zenPink/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}