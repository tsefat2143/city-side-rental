const express = require("express");
const router = express.Router();
const dataBase = require("../models/database")

router.get("/", async (req, res) => {
    try {
        listingId = req.params.id;
        const [results] = await dataBase.query(
            `Select title, monthly_rent, bedrooms, bathrooms, street_address, neighborhood, borough, zip_code from listings`
        )

        if (results.length === 0) {
            return res.status(200).json({message: "There Are Currently No Listings"})
        }

        const [images] = await dataBase.query(
            `SELECT photo_url FROM listing_photos WHERE listings_id = ?`,
            [listingId]
        );

        res.json({...rows[0], images});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server error"});
    }
})

module.exports = router;