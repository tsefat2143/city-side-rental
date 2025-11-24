const express = require("express");
const router = express.Router();
const dataBase = require("../models/database");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

router.post("/", async (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({error: "Email is Required"});
    }

    try {
        const [results] = await dataBase.query("Select * FROM users WHERE email = ?", [email]);

        if (results.length === 0) {
            return res.status(404).json({error: "No account found with that email"})
        }

        const user = results[0];

        //Reset Token
        const resetToken = jwt.sign({email}, process.env.JWT_RESET_TOKEN, {
            expiresIn: "15m"
        });

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        //Send email with reset Token
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `
                <h3>Reset Your Password</h3>
                <p>Click the link below to reset your password. This link will expire in 15 minutes.</p>
                <a href="${resetURL}">${resetURL}</a>
            `
        });

        res.status(200).json({message: "Reset Link Sent To Your Email"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server Error"});
    }
});

module.exports = router;