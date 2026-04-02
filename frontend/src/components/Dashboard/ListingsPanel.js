import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ListingsPanel = () => {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await fetch("http://localhost:5000/api/listings/user", {
                    method: "GET",
                    headers: {
                        "Content-Type" : "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    credentials: 'include'
                });
                
                const data = await res.json();
                
                if(!Array.isArray(data)) {
                    console.log("listings fetch error:", data);
                    setListings([]);
                }
                else {
                    setListings(data);
                }
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [])

// Delete Function
    const deleteListing = async (listingId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("accessToken"); 
            const res = await fetch(`http://localhost:5000/api/listings/${listingId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok) {
                //Remove Listings instantly
                setListings((prevListings) =>
                prevListings.filter((listing) => listing.listings_id !== listingId));
            }
            else {
                console.log("Delete Failed:", data);
                return;
            }           
        } catch (error) {
            console.log("Delete error:", error);
        }
    }

    return (
        <div className="panel-container">
            <div className="panel-header">
                <h2>Your Listings</h2>
            </div>
            {loading ? (
                <p>Loading Your Listings</p>
            ) : listings.length === 0 ? (
                <p className="empty-text">You Have Not Created Any Listings</p>
            ) : (
                <>
                <p>You have {listings.length} listings</p>
                <ul className="listings-list">
                    {listings.map((listing) => (
                        <li key={listing.listings_id} className="listings-item">
                            <h3 className="listing-title">{listing.title}</h3>
                            <img src={listing.image} className="listing-image" alt="rental-image" />
                            <p className="listing-address">{listing.address.split(",")[0]}</p>
                            <p className="listing-details">
                                {listing.bedrooms} Bed • {listing.bathrooms} Bath • {listing.square_feet} sq ft
                            </p>
                            <p className="listing-rent">${listing.monthly_rent} / month</p>
                            <div className="buttons-div">
                                <button onClick={() => navigate(`/edit-listing/${listing.listings_id}`)}>Edit</button>
                                <button onClick={() => deleteListing(listing.listings_id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
                </>
            )}
        </div>
    )
}

export default ListingsPanel;