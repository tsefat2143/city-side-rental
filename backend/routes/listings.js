const express = require("express");
const router = express.Router();
const dataBase = require("../models/database");
const verifyToken = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({storage});

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

router.post("/", verifyToken, upload.array("images", 10), async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { title, details, monthly_rent, bedrooms, bathrooms, square_feet, address, pet_policy, contact_email } = req.body;
        
        const [listingResult] = await dataBase.query(
            `INSERT INTO listings (user_id, title, details, monthly_rent, bedrooms, bathrooms, square_feet, address, pet_policy, contact_email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, title, details, monthly_rent, bedrooms, bathrooms, square_feet, address, pet_policy, contact_email]
        );

        const listingId = listingResult.insertId;

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                await dataBase.query(
                    `
                    INSERT INTO listing_photos (listings_id, photo_url)
                    VALUES (?, ?)
                    `,
                    [listingId, file.filename]
                );
            }
        }
        res.json({success: true});

        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

    } catch (error) {
        console.log("ADD LISTING ERROR:", error);
        res.status(500).json({error: "Server Error"});
    }
});



module.exports = router;