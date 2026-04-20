const express = require("express");
const router = express.Router();
const dataBase = require("../models/database");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

// Public Listings
router.get("/", async (req, res) => {
    try {
        const { borough, minRent, maxRent, bedrooms, zip_code, page = 1 } = req.query;

        const limit = 10;
        const offset = (page - 1) * limit;

        let query = `SELECT listings_id, title, monthly_rent, bedrooms, bathrooms, square_feet, street_address, neighborhood, borough, zip_code, created_at FROM listings WHERE 1=1`;

        let params = [];

        if (borough) {
            query += " AND borough = ?";
            params.push(borough);
        }

        if (minRent) {
            query += " AND monthly_rent >= ?";
            params.push(minRent);
        }

        if (maxRent) {
            query += " AND monthly_rent <= ?";
            params.push(maxRent);
        }

        if (bedrooms) {
            query += " AND bedrooms >= ?";
            params.push(bedrooms);
        }

        if (zip_code) {
            query += " AND zip_code = ?";
            params.push(zip_code);
        }

        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
        params.push(limit, offset);

        const [rows] = await dataBase.query(query, params);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Get user dashboard
router.get("/user", verifyToken, async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [results] = await dataBase.query(
            `SELECT listings_id, title, monthly_rent, bedrooms, bathrooms, square_feet, street_address, neighborhood, borough, zip_code FROM listings WHERE user_id = ? ORDER BY created_at DESC`, 
            [userId]
        );

        //Add image URL for each listing
        for (let i=0; i < results.length; i++) {
            const listing = results[i];
            
            const [imageUrl] = await dataBase.query(
                `SELECT photo_url from listing_photos WHERE listings_id = ? ORDER BY created_at DESC LIMIT 1`,
                [listing.listings_id]
            );
            
            listing.image = `http://localhost:5000/uploads/${imageUrl[0].photo_url}`;
        }  
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server error"});
    }
})

// Create Listing
router.post("/", verifyToken, upload.array("images", 10), async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { title, details, monthly_rent, bedrooms, bathrooms, square_feet, street_address, neighborhood, borough, zip_code, pet_policy, contact_email } = req.body;
        
        const zipRegex = /^[0-9]{5}$/;
        if (!zipRegex.test(zip_code)) {
            return res.status(400).json({ error: "Zip code must be exactly 5 digits" });
        }

        if (monthly_rent <= 0 || bedrooms <= 0 || bathrooms <= 0 || square_feet <= 0) {
            return res.status(400).json({ error: "Invalid numeric values" });
        }

        const [listingResult] = await dataBase.query(
            `INSERT INTO listings (user_id, title, details, monthly_rent, bedrooms, bathrooms, square_feet, street_address, neighborhood, borough, zip_code, pet_policy, contact_email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, title, details, monthly_rent, bedrooms, bathrooms, square_feet, street_address, neighborhood, borough, zip_code, pet_policy, contact_email]
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
})

// Get Single Listing
router.get("/:id", async (req, res) => {
    try {
        const listingId = req.params.id;

        const [rows] = await dataBase.query(
            `SELECT title, details, monthly_rent, bedrooms, bathrooms, square_feet, street_address, neighborhood, borough, zip_code, pet_policy, contact_email FROM listings WHERE listings_id = ?`,
            [listingId]
        );

        if (rows.length === 0) {
            return res.status(404).json({error: "Listing not found"});
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

// Update listing
router.put("/:id", verifyToken, upload.array("images", 10), async (req, res) => {
    const connection = await dataBase.getConnection();

    try {
        const listingId = req.params.id;
        const userId = req.user.user_id;

        const { title, details, monthly_rent, bedrooms, bathrooms, square_feet, street_address, neighborhood, borough, zip_code, pet_policy, contact_email, deleteImages } = req.body;

        const zipRegex = /^[0-9]{5}$/;
        if (!zipRegex.test(zip_code)) {
            return res.status(400).json({ error: "Zip code must be exactly 5 digits" });
        }

        await connection.beginTransaction();

        //Update listing
        const [result] = await connection.query(
            `UPDATE listings SET title = ?, details = ?, monthly_rent = ?, bedrooms = ?, bathrooms = ?, square_feet = ?, street_address = ?, neighborhood = ?, borough = ?, zip_code = ?, pet_policy = ?, contact_email = ?
            WHERE listings_id = ? AND user_id = ?`,
            [title, details, monthly_rent, bedrooms, bathrooms, square_feet, street_address, neighborhood, borough, zip_code, pet_policy, contact_email, listingId, userId]
        );

        if (result.affectedRows === 0) {
            await result.rollback();
            return res.status(404).json({error: "Listing was not found"});
        }

        //Delete selected images
        if (deleteImages) {
            const imageToDelete = JSON.parse(deleteImages);

            for (const fileName of imageToDelete) {
                // Remove from DB
                await connection.query(`DELETE FROM listing_photos WHERE listings_id = ? and photo_url = ?`,
                    [listingId, fileName]
                );

                // Remove from file system
                const filePath = path.join(__dirname, "..", "uploads", fileName);

                try {
                    await fs.promises.unlink(filePath)                    
                } catch (error) {
                    console.log("File delete failed:", fileName);
                }
            }
        }

        //Add new images
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                await connection.query(
                   `
                    INSERT INTO listing_photos (listings_id, photo_url)
                    VALUES (?, ?)
                    `,
                    [listingId, file.filename]
                );
            }
        }
        await connection.commit();

        res.json({message: "Listing updated successfully!"});
    } catch (error) {
        await connection.rollback();
        console.log("PUT ERROR:", error);
        res.status(500).json({error: "Server error"});
    } finally {
        connection.release();
    }
})

// Delete listing 
router.delete("/:id", verifyToken, async (req, res) => {
    const connection = await dataBase.getConnection();
    
    try {
        const listingId = req.params.id;
        const userId = req.user.user_id;

        await connection.beginTransaction();

        //Get file names before deletion
        const [photos] = await connection.query(
            `SELECT photo_url FROM listing_photos WHERE listings_id = ?`,
            [listingId]
        );

        //Delete listing 
        const [result] = await connection.query(
            `DELETE FROM listings WHERE listings_id = ? AND user_id = ?`,
            [listingId, userId]
        );
        
        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.json({message: "Listing Not Found"});
        }

        await connection.commit();

        //Delete from files from upload folder

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
    } finally {
        connection.release();
    }
})



module.exports = router;