// src/components/routes/PrivateRoutes.js
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import RootLayout from "../../pages/Root";
import { isLoggedIn } from "../../components/utils/auth";
import { useUser } from "../../contexts/UserContext";

const PrivateRoutes = () => {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await isLoggedIn();
        setUser(userData);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return user ? <RootLayout /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
