import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Only these paths are restricted
const restrictedPaths = [
  "/chatbot",
  "/chatroom",
  "/meditation",
  "/yoga",
  "/userprofile",
  "/fitness",
  "/lifestyle",
  "/studyhelper",
  "/depression-test",
];

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const isRestricted = restrictedPaths.includes(location.pathname);

  useEffect(() => {
    if (!loggedIn && isRestricted) {
      navigate("/login");
    }
  }, [location.pathname, loggedIn, isRestricted, navigate]);

  // If user is not logged in and trying to access a restricted page,
  // don't render the protected content
  if (!loggedIn && isRestricted) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
