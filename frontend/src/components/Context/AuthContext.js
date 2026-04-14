import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  //Refresh access token using cookie
  const refreshAccessToken = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/refresh", {
        method: "POST",
        credentials: "include", // IMPORTANT: sends cookie
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();

      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);

      const decoded = jwtDecode(data.accessToken);
      setUser(decoded);

      return data.accessToken;
    } catch (error) {
      console.log("Refresh error:", error);
      logout(); // if refresh fails → log out
      return null;
    }
  };

  //Initialize auth on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("accessToken");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(storedToken);

        //Check if expired
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          // Try refreshing
          await refreshAccessToken();
        } 
        else {
          setUser(decoded);
          setAccessToken(storedToken);
        }
      } catch (err) {
        console.log("Token invalid:", err);
        logout();
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  //Login
  const login = (newAccessToken) => {
    try {
      const decoded = jwtDecode(newAccessToken);

      setUser(decoded);
      setAccessToken(newAccessToken);

      localStorage.setItem("accessToken", newAccessToken);
    } catch (error) {
      console.error("Login decode error:", error);
    }
  };

  //Logout
  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout request failed");
    }

    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        refreshAccessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);