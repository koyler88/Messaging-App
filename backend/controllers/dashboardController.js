const prisma = require("../db/prismaClient");

exports.getDashboard = (req, res) => {
  res.json({
    message: "Welcome to the dashboard!",
    user: req.user,
  });
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true },
    });

    // Remove the logged-in user
    const filteredUsers = users.filter(u => u.id !== req.user.id);

    res.json({ users: filteredUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
