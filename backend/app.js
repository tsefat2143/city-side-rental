const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

const newsletterRoute = require("./routes/newsletterSubscribers");

app.use(cors({
    origin: "http://localhost:3000"
}))

app.use(express.json());

app.use("/api/newsletter", newsletterRoute)

app.listen(port, () => {
    console.log(`Port listening ${port}`);    
})