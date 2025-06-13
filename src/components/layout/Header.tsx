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
import UpdatedLogo from "@/assets/images/UpdatedLOGO.jpg";

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
    <header className="py-1 bg-white border-b border-gray-100 sticky top-0 z-50"> {/* Reduced padding */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14"> {/* Fixed height */}
          {/* Larger Logo - Negative margin to make it appear bigger without increasing header height */}
          <Link to="/" className="flex items-center gap-1 -my-2">
            <img
              src={UpdatedLogo}
              alt="Mindra Logo"
              className="h-16 w-auto"
            />
            <span className="text-[1.8rem] font-extrabold font-['Nunito'] text-gray-800 tracking-tight">
              Mindra
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-zenPink h-8 text-sm">
                    Wellness
                  </NavigationMenuTrigger>
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
                  <NavigationMenuTrigger className="text-gray-700 hover:text-zenPink h-8 text-sm">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {[
                        { title: "Mental Health Info", href: "/information", description: "Evidence-based resources" },
                        { title: "Emergency Support", href: "/emergency", description: "Crisis resources" },
                        { title: "Study Helper", href: "/study-helper", description: "Tools for academic success" },
                        { title: "Depression Severity Test", href: "/DST-9", description: "Mental wellbeing check" }
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
                  <NavigationMenuTrigger className="text-gray-700 hover:text-zenPink h-8 text-sm">
                    Connect
                  </NavigationMenuTrigger>
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
                  <NavigationMenuTrigger className="text-gray-700 hover:text-zenPink h-8 text-sm">
                    Tracking
                  </NavigationMenuTrigger>
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

          {/* Auth Buttons - Made more compact */}
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <>
                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      asChild
                      className="border-zenSage text-zenSage hover:bg-zenSage/10 h-8 px-3 text-sm"
                    >
                      <Link to="/login">Log In</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-zenSage hover:bg-zenSage/90 text-white h-8 px-3 text-sm"
                    >
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="border-zenPink text-zenPink hover:bg-zenPink/10 h-8 px-3 text-sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Logout
                  </Button>
                )}
              </>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                aria-label="Toggle Menu"
                className="h-8 w-8"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
            className="mt-1"
          >
            <nav className="py-1">
              <div className="mb-3">
                <div className="text-sm font-semibold text-gray-500 mb-1 px-3">Wellness</div>
                {[
                  { text: "Meditation", path: "/meditation" },
                  { text: "Yoga", path: "/yoga" },
                  { text: "Fitness", path: "/fitness" },
                  { text: "Lifestyle", path: "/lifestyle" }
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-1 px-3 text-sm ${pathname === link.path ? "text-zenPink" : "text-gray-700"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>

              <div className="mb-3">
                <div className="text-sm font-semibold text-gray-500 mb-1 px-3">Resources</div>
                {[
                  { text: "Mental Health Info", path: "/information" },
                  { text: "Emergency Support", path: "/emergency" },
                  { text: "Study Helper", path: "/study-helper" },
                  { text: "Depression Test", path: "/DST-9" }
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-1 px-3 text-sm ${pathname === link.path ? "text-zenPink" : "text-gray-700"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>

              <div className="mb-3">
                <div className="text-sm font-semibold text-gray-500 mb-1 px-3">Connect</div>
                {[
                  { text: "Chat Room", path: "/chatroom" },
                  { text: "Chat Bot", path: "/chatbot" },
                  { text: "About Us", path: "/about" },
                  { text: "Contact Us", path: "/contact" }
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-1 px-3 text-sm ${pathname === link.path ? "text-zenPink" : "text-gray-700"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>

              <div className="mb-3">
                <div className="text-sm font-semibold text-gray-500 mb-1 px-3">Tracking</div>
                {[
                  { text: "Analysis", path: "/analysis" },
                  { text: "Profile", path: "/profile" }
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-1 px-3 text-sm ${pathname === link.path ? "text-zenPink" : "text-gray-700"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>

              <div className="pt-3 flex flex-col space-y-2 border-t border-gray-100 px-3">
                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      asChild
                      className="border-zenSage text-zenSage hover:bg-zenSage/10 h-8 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/login">Log In</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-zenSage hover:bg-zenSage/90 text-white h-8 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="border-zenPink text-zenPink hover:bg-zenPink/10 h-8 text-sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-3 w-3 mr-1" />
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