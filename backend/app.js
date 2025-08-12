require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const passport = require("passport");
const passportConfig = require("./config/passport");

// Middleware to parse form data
app.use(express.urlencoded({ extended: false }));
// Allow cross-origin requests (frontend <-> backend)
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());
// Initialize passport and strategy
app.use(passport.initialize());
passportConfig(passport);

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.listen(PORT, () => console.log(`App running on ${PORT}`));
