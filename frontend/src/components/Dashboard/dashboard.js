import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { authFetch } from '../Utils/AuthFetch';
import ListingsPanel from './ListingsPanel';
import "./dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authFetch("http://localhost:5000/api/dashboard",
          { method: "GET" },
          auth
        );

        const data = await res.json();

        //Still fails then go to login page
        if (!res.ok) {
          navigate("/login");
          return;
        }

        //Succcess
        setUser(data.user);
      } catch (error) {
        console.log("Auth Error:", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [auth, navigate]);

  if (!user) return <p id="loading">Loading...</p>;

  return (
    <div className="dashboard-wrapper">
        <div className="dashboard-div">
            <h1>Hello {user.full_name}</h1>
            <button className="add-btn" onClick={() => navigate("/add-listing")}>+ Add Listing</button>
            
            <ListingsPanel />
        </div>
    </div>
  )
}

export default Dashboard;