import { useState } from "react";
import {useAuth} from "../Context/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import './login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {login} = useAuth();
  const navigate = useNavigate(); // navigate after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please Enter All Fields");
      return
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password})
      });

      const data = await response.json();

      if (response.ok) {
        login(data.accessToken, data.refreshToken);
        setMessage("Login Successful");
        setEmail("");
        setPassword("");

        setTimeout(() => navigate("/dashboard"), 1000);
      }
      else {
        setMessage(data.error || "Login Failed");
      }
    } catch (error) {
      console.log(error);
      setMessage("Server Error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-wrapper">
        <div className="login-div">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>

              {message && (<p style={{ color: message.includes("success") ? "green" : "red" }}>{message}</p>)}

                <input type="email" placeholder="Enter Your Email Address" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Logging In..." : "Log In"}</button>
            </form>
            <p>Forgot Your Password <span><Link to="/forgot-password">Click Here</Link></span></p>
            <p>Need To Register <span><Link to="/register">Click Here</Link></span></p>
        </div>
    </div>
  )
}

export default Login