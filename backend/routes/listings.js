const express = require("express");
const router = express.Router();
const dataBase = require("../models/database");
const verifyToken = require("../middleware/authMiddleware");

router.get("/user", verifyToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const [results] = await dataBase.query(
            `SELECT listings_id, title, monthly_rent, bedrooms, bathrooms, square_feet, address, created_at FROM listings WHERE user_id = ? ORDER BY created_at DESC`, 
            [userId]
        );
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server error"});
    }
});

router.post("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { title, details, rent, bedrooms, bathrooms, square_feet, address, pet_policy, contact_email } = req.body;
        
        await dataBase.query(
            `INSERT INTO listings (user_id, title, details, monthly_rent, bedrooms, bathrooms, square_feet, address, pet_policy, contact_email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, title, details, rent, bedrooms, bathrooms, square_feet, address, pet_policy, contact_email]
        );

        res.status(201).json({message: "Listing created"});
    } catch (error) {
        res.status(500).json({error: "Server Error"});
    }
});



module.exports = router;