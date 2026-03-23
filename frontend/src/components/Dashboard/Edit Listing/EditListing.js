import React, { useState } from 'react'
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

  return (
    <div>
        <h2>Edit Listing</h2>
    </div>
  )
}

export default EditListing