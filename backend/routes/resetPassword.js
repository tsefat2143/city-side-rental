const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dataBase = require("../models/database");
require("dotenv").config();

router.post("/:token", async (req, res) => {
    const {token} = req.params;
    const {newPassword, confirmPassword} = req.body;

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({error: "All Fields Are Required"});
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({error: "Passwords Do Not Match"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await dataBase.query("UPDATE users SET password_hash = ? WHERE email = ?", [hashedPassword, decoded.email]);
        res.status(400).json({message: "Password Reset Successful"})
    } catch (error) {
        console.log("Error: ", error);
        res.status(400).json({error: "Invalid or expired token"})
    }
});

module.exports = router;