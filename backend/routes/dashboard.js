const express = require("express");
const router = express.Router();
const dataBase = require("../models/database");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user.user_id || req.user_id ;
        const [results] = await dataBase.query("SELECT user_id, full_name, email from users WHERE user_id = ? LIMIT 1", [userId]);

        if (results.length === 0) {
            return res.status(404).json({error: "User Not Found"});
        }

        //Return User Object
        const user = {
            user_id: results[0].user_id,
            full_name: results[0].full_name,
            email: results[0].email
        }
        
        return res.status(200).json({user})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Dashboard error"})
    }
})

module.exports = router;