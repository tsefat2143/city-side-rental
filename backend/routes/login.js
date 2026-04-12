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
            return res.status(401).json({error: "Invalid Credentials"});
        }

        const user = results[0];
        
        //Compare Paswords
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({error: "Invalid Credentials"});
        }

        //Create access token
        const accessToken = jwt.sign(
            {   user_id: user.user_id,
                email: user.email, 
                full_name: user.full_name,
                type: "access"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRES
            }
        );

        const refreshToken = jwt.sign(
            {
                user_id: user.user_id,
                type: "refresh"
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES
            }
        );

        //Send refresh token as HTTP only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //Send response
        return res.status(200).json({
            message: "Login Successful",
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
            },
            accessToken
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server error"})
    }
});

module.exports = router;