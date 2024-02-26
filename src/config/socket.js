const { Server } = require("socket.io");

const server = require("./app");

let io;

function initSocket(server) {
  io = new Server(server);

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("addMasjidAndNotifications", (data) => {
      io.emit("addMasjidAndNotifications", data);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

module.exports = {
  initSocket,
  getIO,
};
