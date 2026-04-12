const exppress = require("express");
const router = exppress.Router();
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
    const token = req.cookies.refreshToken;

    //No Token = not logged in
    if(!token) {
        return res.status(401).json({error: "No refresh token provided"});
    }

    try {
        //Verify refresh token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        //Check Token
        if (decoded.type !== "refresh") {
            return res.status(403).json({error: "Invalid token type"});
        }

        // Create new access token
        const newAccessToken = jwt.sign(
            {
                user_id: decoded.user_id,
                type: "access"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRES
            }
        );

        return res.status(200).json({
            accessToken: newAccessToken
        });
    } catch (error) {
        console.log("Refresh error:", error);
        return res.status(403).json({ error: "Invalid or expired refresh token" });
    }
})

module.exports = router;