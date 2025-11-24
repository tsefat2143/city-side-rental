import React, { useState } from 'react'
import "./forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!email) {
      setMessage("Please Enter Your Email");
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email})
      });

      const data = await response.json();
      setMessage(data.message || data.error);      
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong")
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <div className="forgot-password-div">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          {message && <p>{message}</p>}
          <input type='email' placeholder="Enter Your Email Address" value={email} onChange={handleChange}/>
          <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword;