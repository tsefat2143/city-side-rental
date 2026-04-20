import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useParams } from 'react-router-dom';
import "./editListing.css"

const EditListing = () => {
    const {id} = useParams();

    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [monthly_rent, setRent] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [square_feet, setSquareFeet] = useState("");
    const [street_address, setStreetAddress] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [borough, setBorough] = useState("");
    const [zip_code, setZipCode] = useState("");
    const [pet_policy, setPetPolicy] = useState(null);
    const [contact_email, setEmail] = useState("");

    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    const [newImages, setNewImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const fileInputRef = useRef();
    const navigate = useNavigate();
    const {accessToken} = useAuth(); 

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                //Redirect unathorized or not found
                if (res.status === 403 || res.status === 404) {
                    navigate("/dashboard");
                    return;
                }

                if (!res.ok) {
                    setMessage("Failed to Load Listing");
                    return;
                }

                const data = await res.json();

                setTitle(data.title);
                setDetails(data.details);
                setRent(data.monthly_rent);
                setBedrooms(data.bedrooms);
                setBathrooms(data.bathrooms);
                setSquareFeet(data.square_feet);
                
                setStreetAddress(data.street_address);
                setNeighborhood(data.neighborhood);
                setBorough(data.borough);
                setZipCode(data.zip_code);

                setPetPolicy(data.pet_policy);
                setEmail(data.contact_email);
                setExistingImages(data.images)                
            } catch (error) {
                console.log("Fetch Error:", error);
                setMessage("Server Error")
            }
        };
        fetchListing();
    }, [id, accessToken, navigate]);

    //Delete existing Image
    const handleDeleteExisting = (filename) => {
        setExistingImages(prev => prev.filter(img => img.photo_url !== filename));
        setImagesToDelete(prev => [...prev, filename]);
    }

    //Add new images
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const totalImages = existingImages.length + newImages.length + files.length;

        if (totalImages > 10) {
            setMessage("Maximum of 10 images allowed");
            return;
        }

        const newFiles = [...newImages, ...files];
        const newPreviews = [
            ...previewUrls,
            ...files.map(file => URL.createObjectURL(file))
        ];

        setNewImages(newFiles);
        setPreviewUrls(newPreviews);
        setMessage("");
    };

    //Remove new image (like AddListing) 
    const handleRemoveNewImage = (indexToRemove) => { 
        const updatedImages = newImages.filter((_, i) => i !== indexToRemove); 
        const updatedPreviews = previewUrls.filter((_, i) => i !== indexToRemove); 
        
        setNewImages(updatedImages); 
        setPreviewUrls(updatedPreviews); 
        
        if (fileInputRef.current) { 
            fileInputRef.current.value = ""; 
        } 
    };

    //Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!title || !details || !monthly_rent || !bedrooms || !bathrooms || !square_feet || !street_address || !neighborhood || !borough || !zip_code || !contact_email || pet_policy === null) {
            setMessage("Please Complete The Entire Form");
            return;
        }
        
        if (existingImages.length === 0 && newImages.length === 0) {
            setMessage("Please add at least one image");
            return;
        }

        if (!/^[0-9]{5}$/.test(zip_code)) {
            setMessage("Zip code must be 5 digits");
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
            formData.append("street_address", street_address);
            formData.append("neighborhood", neighborhood);
            formData.append("borough", borough);
            formData.append("zip_code", zip_code);
            formData.append("contact_email", contact_email);
            formData.append("pet_policy", pet_policy);

            formData.append("deleteImages", JSON.stringify(imagesToDelete));

            for (const img of newImages) {
                formData.append("images", img);
            }


            const res = await fetch (`http://localhost:5000/api/listings/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                body: formData
            })

            const data = await res.json();

            if (res.ok) {
                setMessage("Updated Listing Successfully")
                setTimeout(() => navigate("/dashboard"), 1000);
            }
            else {
                console.log("PUT method error:", data.error);
            }
        } catch (error) {
            console.log("Server error", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="edit-wrapper">
            <div className="edit-div">
                <h2>Edit Listing</h2>

                {message && <p className="form-message">{message}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Image Upload */}
                    <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageChange} />

                    {/* Image Count */}
                    <p>{existingImages.length + newImages.length} image(s) selected</p>

                    {/* Existing Images */}
                    <div className="preview-container">
                        {existingImages.map((img, index) => (
                            <div key={index} className="preview-item">
                                <img src={`http://localhost:5000/uploads/${img.photo_url}`} alt="preview" />
                                <button type="button" onClick={() => handleDeleteExisting(img.photo_url)} className="remove-btn">
                                    ✕
                                </button>
                            </div>
                    ))}
                    </div>

                    {/* New Image Previews */}
                    <div className="preview-container">
                        {previewUrls.map((url, index) => ( 
                            <div key={index} className="preview-item">
                                <img src={url} alt="preview" />
                                <button type="button" className="remove-btn" onClick={() => handleRemoveNewImage(index)}>
                                    ✕ 
                                </button>
                            </div>
                        ))}
                    </div>

                    <input name="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <textarea name="details" placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} />
                    <input name="monthly_rent" type="number" value={monthly_rent} placeholder="Monthly Rent" onChange={(e) => setRent(e.target.value)} />
                    <input name="bedrooms" type="number" value={bedrooms} placeholder="Bedrooms" onChange={(e) => setBedrooms(e.target.value)} />
                    <input name="bathrooms" type="number" value={bathrooms} placeholder="Bathrooms" onChange={(e) => setBathrooms(e.target.value)} />
                    <input name="square_feet" type="number" value={square_feet} placeholder="Square Feet" onChange={(e) => setSquareFeet(e.target.value)} />
                    <input name="street_address" placeholder="Street Address" value={street_address} onChange={(e) => setStreetAddress(e.target.value)} />
                    <input name="neighborhood" placeholder="Neighborhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                    
                    {/* Borough Dropdown */}
                    <select name="borough" value={borough} onChange={(e) => setBorough(e.target.value)}>
                        <option value="" disabled>Select Borough</option>
                        <option value="Manhattan">Manhattan</option>
                        <option value="Bronx">Bronx</option>
                        <option value="Brooklyn">Brooklyn</option>
                        <option value="Queens">Queens</option>
                        <option value="Staten Island">Staten Island</option>
                    </select>
                    
                    <input name="zip_code" placeholder="Zip Code" value={zip_code} maxLength={5} onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))} />
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
                    <button type="submit" disabled={isSubmitting} className="submit-btn">{isSubmitting ? "Updating Listing..." : "Update Listing"}</button>
                    <button type="button" onClick={() => navigate("/dashboard")} className="cancel-btn">Cancel</button>
                </form>
            </div>
        </div>
    )
}

export default EditListing