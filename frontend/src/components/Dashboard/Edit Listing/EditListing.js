import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditListing = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [monthly_rent, setRent] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [square_feet, setSquareFeet] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [borough, setBorough] = useState("");
    const [zip, setZip] = useState("");
    const [pet_policy, setPetPolicy] = useState(null);
    const [contact_email, setEmail] = useState("");

    const [message, setMessage] = useState("");

    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    const [newImages, setNewImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const fileInputRef = useRef();

    useEffect(() => {
        const fetchListing = async () => {
            const token = localStorage.getItem("accessToken")

            const res = await fetch(`https://localhost:5000/api/listing/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const data = await res.json();

            setTitle(data.title);
            setDetails(data.details);
            setRent(data.monthly_rent);
            setBedrooms(data.bedrooms);
            setBathrooms(data.bathrooms);
            setSquareFeet(data.square_feet);
            
            //Split Address
            const parts = data.address.split(",");
            setAddress(parts[0].trim());
            setCity(parts[1].trim());
            setBorough(parts[2].trim());
            setZip(parts[3].trim());

            setPetPolicy(data.pet_policy);
            setEmail(data.contact_email);
            setExistingImages(data.images)
        };
        fetchListing();
    }, [id]);

    //Delete existing Image
    const handleDeleteExisting = (filename) => {
        setExistingImages(prev => prev.filter(img => img.photo_url !== filename));
        setImagesToDelete(prev => [...prev, filename]);
    }

    //Add new images
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);

        const previews = fileInputRef.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...previews]);
    }

    //Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!title || !details || !monthly_rent || !bedrooms || !bathrooms || !square_feet || !address || !city || !borough || !zip || !contact_email || pet_policy === null) {
            setMessage("Please Complete The Entire Form");
            return;
        }
        
        if (images.length === 0) {
            setMessage("Please add at least one image");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("details", details);
            formData.append("monthly_rent", monthly_rent);
            formData.append("bedrooms", bedrooms);
            formData.append("bathrooms", bathrooms);
            formData.append("square_feet", square_feet);
            formData.append("address", address);
            formData.append("city", city);
            formData.append("borough", borough);
            formData.append("zip", zip);
            formData.append("contact_email", contact_email);
            formData.append("pet_policy", pet_policy);

            formData.append("deleteImages", JSON.stringify(imagesToDelete));

            for (const img of newImages) {
                formData.append("images", img);
            }

            const token = localStorage.getItem("accessToken");

            const res = await fetch (`https://localhost:5000/api/listing/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            const data = await res.json();

            if (res.ok) {
                navigate("/dashboard");
            }
            else {
                console.log("PUT method error:", data.error);
            }
        } catch (error) {
            console.log("Server error");
        }
    }

    return (
        <div>
            <h2>Edit Listing</h2>
            <form onSubmit={handleSubmit}>
                {/* Existing Images */}
                <h3>Current Images</h3>
                {existingImages.map((img, index) => (
                    <div key={index}>
                        <img src={`https://localhost:5000/uploads/${img.photo_url}`} alt="preview" />
                        <button type="button" onClick={() => handleDeleteExisting(img.photo_url)}>
                            Remove
                        </button>
                    </div>
                ))}

                {/* New Images */}
                <h3>Add Images</h3>
                <input type="file" multiple ref={fileInputRef} onChange={handleImageChange} />

                {previewUrls.map((url, i) => (
                    <img key={i} src={url} alt="preview" />
                ))}

                <input name="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea name="details" placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} />
                <input name="monthly_rent" type="number" value={monthly_rent} placeholder="Monthly Rent" onChange={(e) => setRent(e.target.value)} />
                <input name="bedrooms" type="number" value={bedrooms} placeholder="Bedrooms" onChange={(e) => setBedrooms(e.target.value)} />
                <input name="bathrooms" type="number" value={bathrooms} placeholder="Bathrooms" onChange={(e) => setBathrooms(e.target.value)} />
                <input name="square_feet" type="number" value={square_feet} placeholder="Square Feet" onChange={(e) => setSquareFeet(e.target.value)} />
                <input name="address" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <input name="city" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                
                {/* Borough Dropdown */}
                <select name="borough" value={borough} onChange={(e) => setBorough(e.target.value)}>
                    <option value="" disabled>Select Borough</option>
                    <option value="Manhattan">Manhattan</option>
                    <option value="Bronx">Bronx</option>
                    <option value="Brooklyn">Brooklyn</option>
                    <option value="Queens">Queens</option>
                    <option value="Staten Island">Staten Island</option>
                </select>
                
                <input name="zip" placeholder="Zip Code" value={zip} onChange={(e) => setZip(e.target.value)} />
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
                <button type="submit" disabled={isSubmitting} className="submit-btn">{isSubmitting ? "Adding Listing..." : "Add Listing"}</button>
                <button type="button" onClick={() => navigate("/dashboard")} className="cancel-btn">Cancel</button>
            </form>
        </div>
    )
}

export default EditListing