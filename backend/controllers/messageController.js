const db = require("../db/queries");

exports.sendMessage = async (req, res) => {
  const { recipientId, content } = req.body;
  const authorId = req.user.id;

  const recipientIdNum = Number(recipientId);
  if (isNaN(recipientIdNum)) {
    return res.status(400).json({ error: "Invalid recipientId" });
  }

  if (!content || !recipientId) {
    return res.status(400).json({ error: "Recipient and content required" });
  }

  const recipient = await db.findUserById(recipientIdNum);
  if (!recipient) {
    return res.status(404).json({ error: "Recipient not found" });
  }

  if (recipientIdNum === authorId) {
    return res.status(400).json({ error: "You cannot message yourself" });
  }

  try {
    const message = await db.createMessage(authorId, recipientIdNum, content);
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
    const messages = await db.getMessagesBetweenUsers(
      userId,
      Number(withUserId)
    );
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
