import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated() && !["/", "/information", "/about", "/contact", "/emergency"].includes(location.pathname)) {
      setShowDialog(true);
    }
  }, [location]);

  const handleLogin = () => {
    setShowDialog(false);
    navigate("/login");
  };

  const handleClose = () => {
    setShowDialog(false);
    // Redirect to home or info hub when the dialog is closed
    if (!isAuthenticated()) {
      navigate("/");
    }
  };

  if (!isAuthenticated() && !["/", "/information", "/about", "/contact", "/emergency"].includes(location.pathname)) {
    return (
      <>
        {children}
        <Dialog open={showDialog} onOpenChange={handleClose}>
          <DialogContent>
            <DialogHeader>Welcome to Your Journey</DialogHeader>
            <p>To get started and enjoy the full experience, please log in.</p>
            <DialogFooter>
              <Button onClick={handleLogin}>Login</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      {children}
      <Dialog open={showDialog} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>Welcome to Your Journey</DialogHeader>
          <p>To get started and enjoy the full experience, please log in.</p>
          <DialogFooter>
            <Button onClick={handleLogin}>Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProtectedRoute;
