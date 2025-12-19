const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); 
let io;

/*
|---------------------------------------------------------|
| SOCKET.IO ROOMS SUMMARY (backend/socket.js)             |
|---------------------------------------------------------|
| Room Key            | Purpose                            | Targeted Audience      |
|---------------------|------------------------------------|------------------------|
| user:${userId}      | **Personal Messaging:** Targets all  | Single User (All Roles)|
|                     | devices belonging to one user.     |                        |
|---------------------|------------------------------------|------------------------|
| account:${accNum}   | **Account Updates:** Targets all     | All Users tied to that |
|                     | users/devices monitoring a specific  | Account Number.        |
|                     | financial account.                 |                        |
|---------------------|------------------------------------|------------------------|
| role:${accountType} | **Role Broadcasts:** Targets all     | All Staff in that Role |
| (e.g., role:admin)  | connected users of a specific role.  | (Admin, Supervisor).   |
|---------------------|------------------------------------|------------------------|
*/

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS.split(","),
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || (socket.handshake.headers?.authorization || "").split(" ")[1];
      if (!token) return next(new Error("Unauthorized: token required"));

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const userId = payload.userId || payload.id;
      if (!userId) return next(new Error("Unauthorized: invalid token payload"));

      const user = await User.findById(userId).select("accountNumber accountType");
      if (!user) return next(new Error("Unauthorized: user not found"));

      socket.user = {
        userId: userId.toString(),
        accountNumber: user.accountNumber || null,
        accountType: (user.accountType || payload.accountType || "user").toString().toLowerCase(),
      };

      return next();
    } catch (err) {
      console.error("Socket auth error:", err.message || err);
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { userId, accountNumber, accountType } = socket.user;
    console.log(`Socket connected ${socket.id} | User: ${userId} | Role: ${accountType}`);
    const userRoom = `user:${userId}`;
    socket.join(userRoom);
    console.log(`-> JOINED: ${userRoom}`);

    if (accountNumber) {
      const accountRoom = `account:${accountNumber}`;
      socket.join(accountRoom);
      console.log(`-> JOINED: ${accountRoom}`);
    }

    if (accountType) {
      const roleRoom = `role:${accountType.toString().toLowerCase()}`; 
      socket.join(roleRoom);
      console.log(`-> JOINED: ${roleRoom}`);
    }

    socket.emit("socket:connected", { userId });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected ${socket.id} | User: ${userId} | Reason: ${reason}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

module.exports = { initSocket, getIO };

