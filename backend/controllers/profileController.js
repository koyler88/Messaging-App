const db = require("../db/queries");

exports.getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const profile = await db.getProfile(userId);
    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { bio, avatarUrl, location } = req.body;

  try {
    const profile = await db.updateProfile(userId, { bio, avatarUrl, location });
    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
