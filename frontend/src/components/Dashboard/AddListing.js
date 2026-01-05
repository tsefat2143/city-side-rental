import React, { useState } from 'react';
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./addListing.css";

const AddListing = () => {
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [rent, setRent] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [squareFeet, setSquareFeet] = useState("");
    const [address, setAddress] = useState("");
    const [petPolicy, setPetPolicy] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {accessToken} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setIsSubmitting(true);
        try {
            e.preventDefault();
            setMessage("");

            if (!title || !details || !rent || !bedrooms || !bathrooms || !squareFeet || !address || !email || !petPolicy) {
                setMessage("Please Complete The Entire Form");
                return;
            }

            let response = await fetch("http://localhost:5000/api/listings", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({title, details, rent, bedrooms, bathrooms, squareFeet, address, email, petPolicy})
            });

            let data = await response.json();

            if (response.ok) {
                setMessage("Added Listing Successfully!")
                setTitle("");
                setDetails("");
                setRent("");
                setBedrooms("");
                setBathrooms("");
                setSquareFeet("");
                setAddress("");
                setEmail("");
                setPetPolicy("");

                setTimeout(() => navigate("/dashboard"), 1000);
            }
            else {
                setMessage("Error when adding listing");
                console.log("Listing error:", data);
                
            }
            
        } catch (error) {
            console.log(error);
            setMessage("server error");
        } finally {
            setIsSubmitting(false);
        }
    }


  return (
    <div className="listing-wrapper">
        <div className="listing-div">
            <h2>Add Listing</h2>
            
            {message && <p style={{color: isSubmitting ? "green" : "red"}}>{message}</p>}

            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
                <textarea name="details" placeholder="Details" onChange={(e) => setDetails(e.target.value)} />
                <input name="rent" type="number" placeholder="Monthly Rent" onChange={(e) => setRent(e.target.value)} />
                <input name="bedrooms" type="number" placeholder="Bedrooms" onChange={(e) => setBedrooms(e.target.value)} />
                <input name="bathrooms" type="number" placeholder="Bathrooms" onChange={(e) => setBathrooms(e.target.value)} />
                <input name="square_feet" type="number" placeholder="Square Feet" onChange={(e) => setSquareFeet(e.target.value)} />
                <input name="address" placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
                <input name="contact_email" placeholder="Contact Email" onChange={(e) => setEmail(e.target.value)} />
              
                <p>Are Pets Allowed</p>
                <div className="pet-policy">
                <label>
                    <input
                    type="radio"
                    name="pet_policy"
                    value="yes"
                    checked={petPolicy === "yes"}
                    onChange={(e) => setPetPolicy(e.target.value)}
                    />
                    Yes
                </label>
                <label>
                    <input
                    type="radio"
                    name="pet_policy"
                    value="no"
                    checked={petPolicy === "no"}
                    onChange={(e) => setPetPolicy(e.target.value)}
                    />
                    No
                </label>
                </div>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding Listing..." : "Add Listing"}</button>
            </form>
        </div>
    </div>
  )
}

export default AddListing