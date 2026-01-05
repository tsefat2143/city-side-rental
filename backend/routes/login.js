const express = require("express");
const router = express.Router();
const dataBase = require("../models/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({
    path: ['.env']
});

router.post("/", async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({error: "Please Enter both email and password"});
    }

    try {
        const [results] = await dataBase.query("Select * FROM users WHERE email = ?", [email]);

        if (results.length === 0) {
            return res.status(404).json({error: "User Not Found"});
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({error: "Invalid Credentials"});
        }

        const token = jwt.sign(
            {user_id: user.user_id, email: user.email, full_name: user.full_name},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        const refreshToken = jwt.sign(
            {user_id: user.user_id},
            process.env.JWT_REFRESH_TOKEN,
            {expiresIn: "3d"}
        );

        res.status(200).json({
            message: "Login Successful",
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
            },
            accessToken: token, refreshToken,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server error"})
    }
});

module.exports = router;