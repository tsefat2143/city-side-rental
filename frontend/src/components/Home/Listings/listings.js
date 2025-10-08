import React, { useEffect, useState } from 'react'

const Listings = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    return (
        <div className="listings-wrapper">
            <h2>Here Are Our Listings</h2>
            <div className="listings-div">

            </div>
        </div>
    )
}

export default Listings;