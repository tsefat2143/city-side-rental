import { useState } from "react";
import './newsletter.css'

const Newsletter = () => {
    const [message, setMessage] = useState(false);
    const [email, setEmail] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
    } 

    return (
        <div className="newsletter-div">
            <form>
                <h2>Subscribe To Our Newsletter</h2>
                <p>Thank you. You are subscribed to our email</p>
                <input type="email" placeholder="Enter Your Email" value={email} onChange={handleChange}/>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Newsletter;