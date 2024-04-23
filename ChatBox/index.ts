import http from "http";
import path from "path";
import { Server } from "socket.io";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// -----------Save new users in Set-----------
let users = new Set();

// -------------Establish a connection-------------
io.on("connection", (socket) => {
  //  ---------Add number of users count---------
  users.add(socket.id);
  io.emit("users", users.size);

  //   ---------Send a new Message--------------
  socket.on("user-msg", (message) => {
    socket.broadcast.emit("new-message", message);
  });

  //   ----------update the users count when disconnected---------
  socket.on("disconnect", () => {
    users.delete(socket.id);
    io.emit("users", users.size);
  });

  //   ------------Typing note of user------------------
  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
});

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  return res.sendFile("/public/index.html");
});

server.listen(9000, () => console.log("running in server 9000"));
