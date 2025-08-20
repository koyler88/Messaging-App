const prisma = require("./prismaClient");

async function findUserByUsername(username) {
  return prisma.user.findUnique({ where: { username } });
}

async function findUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function createUser(username, hashedPassword) {
  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
}

async function createMessage(authorId, recipientId, content) {
  return prisma.message.create({
    data: { authorId, recipientId, content },
  });
}

async function getMessagesBetweenUsers(userId1, userId2) {
  return prisma.message.findMany({
    where: {
      OR: [
        { authorId: userId1, recipientId: userId2 },
        { authorId: userId2, recipientId: userId1 },
      ],
    },
    include: {
      author: { select: { id: true, username: true } },
      recipient: { select: { id: true, username: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

async function getProfile(userId) {
  return prisma.profile.findUnique({
    where: { userId },
  });
}

async function updateProfile(userId, data) {
  return prisma.profile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
}

module.exports = {
  findUserByUsername,
  createUser,
  createMessage,
  getMessagesBetweenUsers,
  getProfile,
  updateProfile,
  findUserById
};
