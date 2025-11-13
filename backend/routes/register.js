const express = require("express");
const router = express.Router();
const dataBase = require("../models/database");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    const {fullName, email, password, confirmPassword} = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
        return res.status(400).json({error: "Please Enter All Fields"});
    }

    if (password !== confirmPassword) {
        return res.status(400).json({error: "Passwords Do Not Match"});
    }

    if(password.length < 8) {
        return res.status(400).json({error: "Password Must be More than 8 Characters Long"});
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({error: "Password must include uppercase, lowercase, number, and special character."});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password,12);
        const sql = "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)"; 

        await dataBase.query(sql,[fullName, email, hashedPassword]);
        res.status(201).json({message: "Registered Successfully"});
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({error: "Email Already Registered"})
        }
        console.log(error);
        res.status(500).json({message: "Database Error"});
    }
    
})

module.exports = router;