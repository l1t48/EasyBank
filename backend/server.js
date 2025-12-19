require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const { initSocket } = require("./socket");

const PORT = process.env.PORT;
connectDB();

const server = http.createServer(app);

const io = initSocket(server);

app.set("io", io);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
