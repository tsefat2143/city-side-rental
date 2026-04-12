const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const path = require("path")
const cookieParser = require("cookie-parser");

//Import Routers
const newsletterRoute = require("./routes/newsletterSubscribers");
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const logoutRoute = require("./routes/logout");
const forgotPasswordRoute = require("./routes/forgotPassword");
const resetPasswordRoute = require("./routes/resetPassword");
const dashboardRoute = require("./routes/dashboard");
const listingsRoute = require("./routes/listings");
const refreshRoute = require("./routes/refreshToken")

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());


//Mount router to api
app.use("/api/newsletter", newsletterRoute);
app.use("/api/refresh", refreshRoute);
app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/logout", logoutRoute);
app.use("/api/forgot-password", forgotPasswordRoute);
app.use("/api/reset-password", resetPasswordRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/listings", listingsRoute);

//Multer Error Handler
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err, req, res, next) => {
    if (err.name === "MulterError") {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({error: "Maximum of 10 images allowed"});
        }
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File too large (max 5MB)" });
        }
        return res.status(400).json({ error: err.message });
    }
    if (err.message === "Only images allowed") {
        return res.status(400).json({ error: err.message });
    }
    next(err);
})
app.listen(port, () => {
    console.log(`Port listening ${port}`);    
})