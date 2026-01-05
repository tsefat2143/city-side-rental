import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ListingsPanel from './ListingsPanel';
import "./dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const {accessToken} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = accessToken || localStorage.getItem("accessToken");
      console.log("TOKEN:", token);
      

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
          },
          credentials: "include"
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("accessToken");
          navigate("/login");
          return;
        }

        const data = await res.json();
        console.log("DASHBOARD RESPONSE:",data);
                
        if (!res.ok) {
          console.log("Dashboard Fetch Error:", data);
          setUser(null);
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.log("Fetch Error:", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [accessToken, navigate]);

  if (!user) return <p id="loading">Loading...</p>;

  return (
    <div className="dashboard-wrapper">
        <div className="dashboard-div">
            <h1>Hello {user.full_name}</h1>
            <button class="add-btn" onClick={() => navigate("/add-listing")}>+ Add Listing</button>
            <ListingsPanel />
        </div>
    </div>
  )
}

export default Dashboard;