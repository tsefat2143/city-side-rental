const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

//Import Routers
const newsletterRoute = require("./routes/newsletterSubscribers");
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const forgotPasswordRoute = require("./routes/forgotPassword");
const resetPasswordRoute = require("./routes/resetPassword");
const dashboardRoute = require("./routes/dashboard")

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json());

//Mount router to api
app.use("/api/newsletter", newsletterRoute);
app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/forgot-password", forgotPasswordRoute);
app.use("/api/reset-password", resetPasswordRoute);
app.use("/api/dashboard", dashboardRoute);

app.listen(port, () => {
    console.log(`Port listening ${port}`);    
})