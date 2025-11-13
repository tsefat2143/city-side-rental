const express = require("express");
const router = express.Router();
const dataBase = require("../models/database");

router.post("/", async (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({error: "Please Enter Your Email"});
    }

    try {
        const sql = "INSERT INTO newsletter_subscribers (email) VALUES (?)";

        await dataBase.query(sql, [email]);
        res.status(200).json({message: "Subscribed Successfully!"});

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({error: "Email already subscribed"});
        }
        else {
            console.log(error);
            res.status(500).json({error: "Database Error"})
        }
    }
});

module.exports = router;