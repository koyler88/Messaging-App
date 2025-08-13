const db = require("../db/queries");

exports.sendMessage = async (req, res) => {
  const { recipientId, content } = req.body;
  const authorId = req.user.id;

  if (!content || !recipientId) {
    return res.status(400).json({ error: "Recipient and content required" });
  }

  try {
    const message = await db.createMessage(authorId, recipientId, content);
    res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getConversation = async (req, res) => {
  const userId = req.user.id;
  const { withUserId } = req.params;

  try {
    const messages = await db.getMessagesBetweenUsers(userId, Number(withUserId));
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
