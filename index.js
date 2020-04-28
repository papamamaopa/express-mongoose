const express = require("express");
const app = express();

// middleware imports
const authMiddleware = require("./middleware/auth")

// express json paerser
app.use(express.json());

// middleware
app.use("/api/auth/", authMiddleware);


app.listen(3000, () => {
  console.log("")
})