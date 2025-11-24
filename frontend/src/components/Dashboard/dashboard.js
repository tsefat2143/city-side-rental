import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const {accessToken} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = accessToken || localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("accessToken");
          navigate("/login");
          return;
        }

        const data = await res.json();
        console.log("DASHBOARD RESPONSE:", data);
        
        if (!res.ok) {
          console.log("Dashboard Fetch Error:", data);
          setUser(null);
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.log("Fetch Error:", error);
        navigate(".login");
      }
      fetchUser();
    }
  }, [accessToken, navigate]);

  if (!user) return <p id="loading">Loading...</p>;

  return (
    <div className="dashboard-wrapper">
        <div className="dashboard-div">
            <h2>Welcome {user.full_name}</h2>
        </div>
    </div>
  )
}

export default Dashboard;