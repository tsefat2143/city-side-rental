import React, { useState } from 'react';
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./addListing.css";

const AddListing = () => {
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [monthly_rent, setRent] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [square_feet, setSquareFeet] = useState("");
    const [address, setAddress] = useState("");
    const [pet_policy, setPetPolicy] = useState(null);
    const [contact_email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {accessToken} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!title || !details || !monthly_rent || !bedrooms || !bathrooms || !square_feet || !address || !contact_email || pet_policy === null) {
            setMessage("Please Complete The Entire Form");
            return;
        }

        console.log(images.length);
        
        if (images.length === 0) {
            setMessage("Please add at least one image");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("details", details);
            formData.append("monthly_rent", monthly_rent);
            formData.append("bedrooms", bedrooms);
            formData.append("bathrooms", bathrooms);
            formData.append("square_feet", square_feet);
            formData.append("address", address);
            formData.append("contact_email", contact_email);
            formData.append("pet_policy", pet_policy);

            for (let i=0; i < images.length; i++) {
                formData.append("images", images[i]);
            }

            const response = await fetch("http://localhost:5000/api/listings", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.error || "Error adding listing");
                return;
            }

            setMessage("Listing added Successfully");
            setTimeout(() => navigate("/dashboard"), 1000);
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
            
            {message && <p className="form-message">{message}</p>}

            <form onSubmit={handleSubmit}>
                <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)}/>
                <input name="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea name="details" placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} />
                <input name="monthly_rent" type="number" value={monthly_rent} placeholder="Monthly Rent" onChange={(e) => setRent(e.target.value)} />
                <input name="bedrooms" type="number" value={bedrooms} placeholder="Bedrooms" onChange={(e) => setBedrooms(e.target.value)} />
                <input name="bathrooms" type="number" value={bathrooms} placeholder="Bathrooms" onChange={(e) => setBathrooms(e.target.value)} />
                <input name="square_feet" type="number" value={square_feet} placeholder="Square Feet" onChange={(e) => setSquareFeet(e.target.value)} />
                <input name="address" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <input name="contact_email" placeholder="Contact Email" value={contact_email} onChange={(e) => setEmail(e.target.value)} />
              
                <p>Are Pets Allowed</p>
                <div className="pet-policy">
                <label>
                    <input
                        type="radio"
                        name="pet_policy"
                        checked={pet_policy === 1}
                        onChange={() => setPetPolicy(1)}
                    />
                    Yes
                </label>
                <label>
                    <input
                        type="radio"
                        name="pet_policy"
                        checked={pet_policy === 0}
                        onChange={() => setPetPolicy(0)}
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