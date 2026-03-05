const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

// CORS 설정 (모든 도메인 허용)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("새로운 플레이어 접속:", socket.id);

  // 방 만들기
  socket.on("createRoom", (callback) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    socket.join(roomId);
    rooms[roomId] = { players: {}, hostId: socket.id, isGameStarted: false };
    console.log(`플레이어 ${socket.id}가 방 ${roomId}를 생성했습니다.`);
    callback(roomId);
  });

  // 방 참여하기
  socket.on("joinRoom", ({ roomId, charType, nickname }, callback) => {
    if (rooms[roomId]) {
      socket.join(roomId);
      rooms[roomId].players[socket.id] = {
        x: 0,
        y: 0,
        angle: 0,
        playerId: socket.id,
        nickname: nickname || `플레이어 ${socket.id.substring(0, 4)}`, // 닉네임 설정
        charType,
        isShiny: false,
        isReady: false, // 준비 상태
        isHost: socket.id === rooms[roomId].hostId, // 방장 여부
      };

      // 1. 현재 접속자에게 기존 플레이어 목록 전송
      socket.emit("currentPlayers", rooms[roomId].players);
      // 2. 다른 접속자들에게 새 플레이어 알림
      socket.to(roomId).emit("newPlayer", rooms[roomId].players[socket.id]);

      // 3. 대기실용: 방 전체에 플레이어 목록 갱신 이벤트 전송
      io.to(roomId).emit("updatePlayerList", rooms[roomId].players);

      console.log(`플레이어 ${socket.id}가 방 ${roomId}에 참여했습니다.`);
      callback({ status: "ok", hostId: rooms[roomId].hostId });
    } else {
      callback({ status: "error", message: "방을 찾을 수 없습니다." });
    }
  });

  // 게임 시작 (호스트만 가능)
  socket.on("startGame", () => {
    const playerRooms = Array.from(socket.rooms);
    const roomId = playerRooms.find((r) => r !== socket.id);
    if (roomId && rooms[roomId] && rooms[roomId].hostId === socket.id) {
      rooms[roomId].isGameStarted = true;
      io.to(roomId).emit("gameStarted");
    }
  });

  // 닉네임 변경
  socket.on("changeNickname", (newNickname) => {
    const playerRooms = Array.from(socket.rooms);
    const roomId = playerRooms.find((r) => r !== socket.id);
    if (roomId && rooms[roomId] && rooms[roomId].players[socket.id]) {
      rooms[roomId].players[socket.id].nickname = newNickname;
      // 방 전체에 플레이어 목록 갱신 이벤트 전송
      io.to(roomId).emit("updatePlayerList", rooms[roomId].players);
      console.log(
        `플레이어 ${socket.id}가 닉네임을 ${newNickname}(으)로 변경했습니다.`,
      );
    }
  });

  // 준비 상태 토글
  socket.on("toggleReady", () => {
    const playerRooms = Array.from(socket.rooms);
    const roomId = playerRooms.find((r) => r !== socket.id);
    if (roomId && rooms[roomId] && rooms[roomId].players[socket.id]) {
      const player = rooms[roomId].players[socket.id];
      player.isReady = !player.isReady;
      io.to(roomId).emit("updatePlayerList", rooms[roomId].players);
    }
  });

  // 플레이어 움직임 수신 및 브로드캐스트
  socket.on("playerMovement", (movementData) => {
    const playerRooms = Array.from(socket.rooms);
    const roomId = playerRooms.find((r) => r !== socket.id);

    if (roomId && rooms[roomId] && rooms[roomId].players[socket.id]) {
      rooms[roomId].players[socket.id] = {
        ...rooms[roomId].players[socket.id],
        ...movementData,
      };
      socket.to(roomId).emit("playerMoved", rooms[roomId].players[socket.id]);
    }
  });

  // 접속 해제 처리
  socket.on("disconnect", () => {
    console.log("플레이어 접속 해제:", socket.id);
    for (const roomId in rooms) {
      if (rooms[roomId].players[socket.id]) {
        delete rooms[roomId].players[socket.id];
        io.to(roomId).emit("userDisconnect", socket.id);
        // 대기실 목록 갱신
        io.to(roomId).emit("updatePlayerList", rooms[roomId].players);
        if (Object.keys(rooms[roomId].players).length === 0) {
          delete rooms[roomId];
          console.log(`방 ${roomId}가 비어서 삭제되었습니다.`);
        }
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log("서버가 3000번 포트에서 실행 중입니다.");
});
