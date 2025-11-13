const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader= req.headers.authorization;

    //Check token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({error: "Access denied. No Token Provided"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");
        req.user = decoded; //Save user info in request
        next(); //continue route handler
    } catch (error) {
        console.log("JWT verification failed:", error);
        res.status(401).json({error: "Invalid or expired token"})
        
    }
}

module.exports = verifyToken;