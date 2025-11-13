import { useState } from "react";
import './newsletter.css'

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
    } 

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!email) {
            setMessage("Please Enter Your Email");
            return
        }

        if (!validateEmail(email)) {
            setMessage("Invalid email format");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:5000/api/newsletter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message); //Subscribed Successfully!
                setEmail("");
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
        <div className="newsletter-div">
            <form onSubmit={handleSubmit}>
                <h2>Subscribe To Our Newsletter</h2>
                
                {message && (<p style={{ color: message.includes("successfully") ? "green" : "red" }}>{message}</p>)}

                <input type="email" placeholder="Enter Your Email" value={email} onChange={handleChange}/>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Subscribing..." : "Subscribe"}</button>
            </form>
        </div>
    )
}

export default Newsletter;