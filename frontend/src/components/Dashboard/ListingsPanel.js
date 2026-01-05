import React, { useEffect, useState } from 'react';

const ListingsPanel = () => {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState([]);

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
                <ul className="listings-list">
                    {listings.map((listing) => (
                        <li key={listing.listings_id} className="listings-item">
                            <h3 className="listing-title">{listing.title}</h3>
                            <p className="listing-address">{listing.address}</p>
                            <p className="listing-details">
                                {listing.bedrooms} Bed • {listing.bathrooms} Bath • {listing.square_feet} sq ft
                            </p>
                            <p className="listing-rent">${listing.monthly_rent} / month</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default ListingsPanel