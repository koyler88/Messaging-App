const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/queries");
require("dotenv").config();

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await db.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.createUser(username, hashedPassword);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, username: user.username },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users except the current logged-in user
const getAllUsers = async (req, res) => {
  try {
    const users = await db.getAllUsers();
    // Filter out the current user
    const filtered = users.filter(u => u.id !== req.user.id);
    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  register,
  login,
  getAllUsers
};
