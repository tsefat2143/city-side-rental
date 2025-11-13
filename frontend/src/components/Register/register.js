import { useState } from 'react'
import './register.css'

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  let validateInputs = () => {
    if (!fullName || !email || !password || !confirmPassword) {
        setMessage("Please Enter All Fields");
        return false;
    }

    if (password !== confirmPassword) {
        setMessage("Passwords Do Not Match");
        return false;
    }

    if(password.length < 8) {
        setMessage("Password Must be More than 8 Characters Long");
        return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
        setMessage("Password must include uppercase, lowercase, number, and special character.");
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email format");
      return false;
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if(!validateInputs()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({fullName, email, password, confirmPassword}),
        });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); //Registered Successfully
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
      else {
        setMessage(data.error || "Something went wrong");
      }
      
    } catch (error) {
      console.log(error);
      setMessage("Unable to connect to server")
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="register-wrapper">
        <div className="register-div">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>

              {message && (<p style={{ color: message.includes("successfully") ? "green" : "red" }}>{message}</p>)}
              
                <input type="text" placeholder="Enter Your Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                <input type="email" placeholder="Enter Your Email Address" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="Create Password. Minimum of 8 characters" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <input type="password" placeholder="Verify Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Registering..." : "Register"}</button>
            </form>
            <p>If You Have An Account <span>Click Here</span></p>
        </div>
    </div>
  )
}

export default Register;