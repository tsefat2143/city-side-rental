const express = require("express");
const router = express.Router();
const dataBase = require("../database");

router.post("/api/newsletter", async (req, res) => {
    const email = req.body.email;
    console.log(`Log: ${email}`);

    if(!email) {
        return res.status(400).json({error: "Email is required!"});
    }
    
})

module.exports = router;