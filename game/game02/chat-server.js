const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 기본 주소('/')로 접속하면 chat.html 파일을 보여줍니다.
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/chat.html");
});

// 소켓 통신(실시간 연결) 설정
io.on("connection", (socket) => {
  console.log("🟢 새로운 유저가 접속했습니다:", socket.id);

  // 누군가 메시지를 보내면 실행됨
  socket.on("chat message", (msg) => {
    // 접속한 '모든' 사람들에게 메시지를 다시 뿌려줍니다.
    io.emit("chat message", `[익명-${socket.id.substring(0, 4)}] ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 유저가 연결을 해제했습니다:", socket.id);
  });
});

server.listen(8080, () => {
  console.log("채팅 서버가 http://localhost:8080 에서 실행 중입니다.");
});
