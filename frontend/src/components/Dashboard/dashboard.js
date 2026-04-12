import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ListingsPanel from './ListingsPanel';
import "./dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const {accessToken, refreshAccessToken} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = accessToken || localStorage.getItem("accessToken");      

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        //First request
        const res = await fetch("http://localhost:5000/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          credentials: "include"
        });

        if (res.status === 401 || res.status === 403) {
          const newToken = await refreshAccessToken();

          if(!newToken){
            navigate("/login");
            return;
          }

          //Try request again with no token
          res = await fetch("http://localhost:5000/api/dashboard", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
            credentials: "include"
          });
        }

        const data = await res.json();

        //Still fails then go to login page
        if (!res.ok) {
          setUser(null);
          navigate("/login");
          return;
        }

        //Succcess
        setUser(data.user);
      } catch (error) {
        console.log("Fetch Error:", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [accessToken, refreshAccessToken, navigate]);

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