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

        //Add image URL for each listing
        for (let i=0; i < results.length; i++) {
            const listing = results[i];
            
            const [imageUrl] = await dataBase.query(
                `SELECT photo_url from listing_photos WHERE listings_id = ? ORDER BY created_at DESC LIMIT 1`,
                [listing.listings_id]
            );

            console.log(imageUrl);
            
            listing.image = `http://localhost:5000/uploads/${imageUrl[0].photo_url}`;
        }  
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server error"});
    }
});

router.post("/", verifyToken, upload.array("images", 10), async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { title, details, monthly_rent, bedrooms, bathrooms, square_feet, address, city, borough, zip, pet_policy, contact_email } = req.body;
        
        const fullAddress = `${address}, ${city}, ${borough}, ${zip}`;

        const [listingResult] = await dataBase.query(
            `INSERT INTO listings (user_id, title, details, monthly_rent, bedrooms, bathrooms, square_feet, address, pet_policy, contact_email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, title, details, monthly_rent, bedrooms, bathrooms, square_feet, fullAddress, pet_policy, contact_email]
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
    } catch (error) {
        console.log("ADD LISTING ERROR:", error);
        res.status(500).json({error: "Server Error"});
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    const connection = await dataBase.getConnection();
    
    try {
        const listingId = req.params.id;
        const userId = req.user.user_id;

        await connection.beginTransaction();

        //Get file names before deletion
        const [photos] = await dataBase.query(
            `SELECT photo_url FROM listing_photos WHERE listings_id = ?`,
            [listingId]
        );

        //Delete listing 
        const [result] = await dataBase.query(
            `DELETE FROM listings WHERE listings_id = ? AND user_id = ?`,
            [listingId, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.json({message: "Listing Not Found"});
        }

        await connection.commit();

        //Delete from files from upload folder
        const fs = require("fs");
        const path = require("path");

        for (const photo of photos) {
            const filePath = path.join(__dirname, "..", "uploads", photo.photo_url);
            
            try {
                await fs.promises.unlink(filePath);
            } catch (error) {
                console.log("File deletion failed:", filePath, error);
            }
        }
        res.json({message: "Listing Deleted Successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server Error"});
    }
})



module.exports = router;