const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("새로운 플레이어 접속:", socket.id);

  // 방 생성
  socket.on("createRoom", (callback) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    socket.join(roomId);

    rooms[roomId] = {
      players: {},
      hostId: socket.id,
      isGameStarted: false,
    };

    console.log(`플레이어 ${socket.id}가 방 ${roomId}를 생성했습니다.`);

    callback(roomId);
  });

  // 방 참가
  socket.on("joinRoom", ({ roomId, charType, nickname }, callback) => {
    if (rooms[roomId]) {
      socket.join(roomId);

      rooms[roomId].players[socket.id] = {
        x: 0,
        y: 0,
        angle: 0,
        playerId: socket.id,
        nickname: nickname || `플레이어 ${socket.id.substring(0, 4)}`,
        charType,
        isShiny: false,
        isReady: false,
        isHost: socket.id === rooms[roomId].hostId,
        score: 0,
        radius: 20, // 플레이어 초기 크기
        isAlive: false, // 게임 시작 전에는 살아있지 않음
      };

      socket.emit("currentPlayers", rooms[roomId].players);
      socket.to(roomId).emit("newPlayer", rooms[roomId].players[socket.id]);
      io.to(roomId).emit("updatePlayerList", rooms[roomId].players);

      console.log(`플레이어 ${socket.id}가 방 ${roomId}에 참여했습니다.`);

      callback({ status: "ok", hostId: rooms[roomId].hostId });
    } else {
      callback({ status: "error", message: "방을 찾을 수 없습니다." });
    }
  });

  // 게임 시작
  socket.on("startGame", () => {
    const playerRooms = Array.from(socket.rooms);
    const roomId = playerRooms.find((r) => r !== socket.id);

    if (roomId && rooms[roomId] && rooms[roomId].hostId === socket.id) {
      const allReady = Object.values(rooms[roomId].players).every(
        (p) => p.isHost || p.isReady,
      );

      if (!allReady) return;

      // 게임 시작 시 모든 플레이어 상태 초기화
      Object.values(rooms[roomId].players).forEach((p) => {
        p.isAlive = true;
        p.score = 0;
        p.radius = 20;
        p.isShiny = false;
      });

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

  // 물고기 스폰 (호스트만)
  socket.on("spawnFish", (fishData) => {
    const playerRooms = Array.from(socket.rooms);
    const roomId = playerRooms.find((r) => r !== socket.id);

    if (roomId && rooms[roomId] && rooms[roomId].hostId === socket.id) {
      socket.to(roomId).emit("newFishSpawned", fishData);
    }
  });

  // 채팅
  // 클라이언트가 보낸 객체 { roomId, message } 를 구조 분해하여 받습니다.
  socket.on("sendChat", ({ roomId, message }) => {
    if (roomId && rooms[roomId] && rooms[roomId].players[socket.id]) {
      const nickname = rooms[roomId].players[socket.id].nickname;

      // 방에 있는 모든 클라이언트에게 닉네임과 실제 메시지(문자열)를 보냅니다.
      io.to(roomId).emit("newChat", {
        nickname,
        message, // 이제 message는 객체가 아닌 문자열입니다.
      });
    }
  });

  // 플레이어가 물고기를 먹었을 때
  socket.on("iAteFish", (eatenFishData) => {
    const playerRooms = Array.from(socket.rooms);
    const roomId = playerRooms.find((r) => r !== socket.id);

    if (roomId && rooms[roomId] && rooms[roomId].players[socket.id]) {
      const player = rooms[roomId].players[socket.id];

      // 1. 점수 계산
      let points = 10;
      if (eatenFishData.fishIsShiny) points *= 2;
      if (player.isShiny) points *= 2;
      player.score += points;

      // 2. 플레이어 크기 및 상태 업데이트
      player.radius += 0.5;
      if (eatenFishData.fishIsShiny) {
        player.isShiny = true;
        // TODO: 서버에서 샤이니 타이머 관리
      }

      // 3. 모든 클라이언트에게 브로드캐스트
      io.to(roomId).emit("fishEaten", {
        ...eatenFishData,
        playerId: socket.id,
      });
      io.to(roomId).emit("playerUpdated", player);
    }
  });

  // 플레이어가 죽었을 때
  socket.on("playerDied", () => {
    const playerRooms = Array.from(socket.rooms);
    const roomId = playerRooms.find((r) => r !== socket.id);

    if (
      roomId &&
      rooms[roomId] &&
      rooms[roomId].isGameStarted &&
      rooms[roomId].players[socket.id]
    ) {
      const player = rooms[roomId].players[socket.id];
      player.isAlive = false;
      io.to(roomId).emit(
        "playerDiedAnnouncement",
        `${player.nickname}님이 잡아먹혔습니다!`,
      );

      // 죽은 플레이어 정보를 다른 클라이언트에게 알려서 화면에서 제거
      io.to(roomId).emit("playerKilled", socket.id);

      // 모든 플레이어가 죽었는지 확인
      const allDead = Object.values(rooms[roomId].players).every(
        (p) => !p.isAlive,
      );

      if (allDead) {
        console.log(`방 ${roomId}의 모든 플레이어가 사망. 게임을 종료합니다.`);
        rooms[roomId].isGameStarted = false;
        const finalScores = Object.values(rooms[roomId].players).map((p) => ({
          nickname: p.nickname,
          score: p.score,
        }));
        io.to(roomId).emit("gameFinished", finalScores);
      }
    }
  });
  // 플레이어 이동
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

  // 접속 해제
  socket.on("disconnect", () => {
    console.log("플레이어 접속 해제:", socket.id);

    for (const roomId in rooms) {
      if (rooms[roomId].players[socket.id]) {
        // 플레이어 퇴장 시 샤이니 효과 타임아웃 정리 (추후 구현용)
        if (rooms[roomId].players[socket.id].shinyTimeout) {
          clearTimeout(rooms[roomId].players[socket.id].shinyTimeout);
        }

        delete rooms[roomId].players[socket.id];

        io.to(roomId).emit("userDisconnect", socket.id);
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
