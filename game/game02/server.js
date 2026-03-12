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
      settings: { difficulty: "normal" }, // 기본 설정
    };

    console.log(`플레이어 ${socket.id}가 방 ${roomId}를 생성했습니다.`);

    callback(roomId);
  });

  // 방 참가
  socket.on(
    "joinRoom",
    ({ roomId, charType, nickname, chatColor }, callback) => {
      if (rooms[roomId]) {
        socket.join(roomId);

        rooms[roomId].players[socket.id] = {
          x: 0,
          y: 0,
          angle: 0,
          playerId: socket.id,
          nickname: nickname || `플레이어 ${socket.id.substring(0, 4)}`,
          chatColor: chatColor || "#81D4FA",
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

        // 현재 방 설정 정보를 새로 온 플레이어에게 전송
        socket.emit("roomSettingsUpdated", rooms[roomId].settings);

        console.log(`플레이어 ${socket.id}가 방 ${roomId}에 참여했습니다.`);

        callback({ status: "ok", hostId: rooms[roomId].hostId });
      } else {
        callback({ status: "error", message: "방을 찾을 수 없습니다." });
      }
    },
  );

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

      // 카운트다운 시작 (3, 2, 1, Start)
      let count = 3;
      io.to(roomId).emit("countdown", count); // 첫 카운트 전송

      const interval = setInterval(() => {
        count--;
        if (count > 0) {
          io.to(roomId).emit("countdown", count);
        } else {
          clearInterval(interval);
          rooms[roomId].isGameStarted = true;
          io.to(roomId).emit("gameStarted");
        }
      }, 1000);
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

  // 색상 변경
  socket.on("changeColor", (newColor) => {
    const playerRooms = Array.from(socket.rooms);
    const roomId = playerRooms.find((r) => r !== socket.id);

    if (roomId && rooms[roomId] && rooms[roomId].players[socket.id]) {
      rooms[roomId].players[socket.id].chatColor = newColor;

      const nickname = rooms[roomId].players[socket.id].nickname;
      io.to(roomId).emit(
        "systemMessage",
        `${nickname}님이 채팅 색상을 ${newColor}(으)로 변경했습니다.`,
      );
    }
  });

  // 방 설정 변경 (호스트만)
  socket.on("updateSettings", (newSettings) => {
    const playerRooms = Array.from(socket.rooms);
    const roomId = playerRooms.find((r) => r !== socket.id);

    if (roomId && rooms[roomId] && rooms[roomId].hostId === socket.id) {
      // 설정 업데이트
      rooms[roomId].settings = { ...rooms[roomId].settings, ...newSettings };
      // 모든 클라이언트에게 변경된 설정 전송
      io.to(roomId).emit("roomSettingsUpdated", rooms[roomId].settings);

      // 난이도 변경 알림
      if (newSettings.difficulty) {
        let diffName = newSettings.difficulty;
        if (diffName === "easy") diffName = "쉬움";
        else if (diffName === "hard") diffName = "어려움";
        else if (diffName === "normal") diffName = "보통";
        const nickname = rooms[roomId].players[socket.id].nickname;

        console.log(
          `[System] ${nickname}님이 난이도를 ${diffName}으로 변경했습니다.`,
        );

        io.to(roomId).emit(
          "systemMessage",
          `${nickname}님이 게임 난이도를 '${diffName}'(으)로 변경했습니다.`,
        );
      }
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
      const chatColor = rooms[roomId].players[socket.id].chatColor || "#81D4FA";

      // 방에 있는 모든 클라이언트에게 닉네임과 실제 메시지(문자열)를 보냅니다.
      io.to(roomId).emit("newChat", {
        nickname,
        color: chatColor,
        message, // 이제 message는 객체가 아닌 문자열입니다.
      });
    }
  });

  // 이모지 전송
  socket.on("sendEmoji", ({ emoji }) => {
    const playerRooms = Array.from(socket.rooms);
    const roomId = playerRooms.find((r) => r !== socket.id);

    if (roomId && rooms[roomId] && rooms[roomId].players[socket.id]) {
      io.to(roomId).emit("emojiSent", { playerId: socket.id, emoji });
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

  // 플레이어가 찌꺼기를 먹었을 때
  socket.on("iAteLeftover", (eatenLeftoverData) => {
    const playerRooms = Array.from(socket.rooms);
    const roomId = playerRooms.find((r) => r !== socket.id);

    if (roomId && rooms[roomId] && rooms[roomId].players[socket.id]) {
      const player = rooms[roomId].players[socket.id];

      // 1. 점수 계산
      let points = eatenLeftoverData.bonusScore;
      if (player.isShiny) points *= 2;
      player.score += points;

      // 2. 플레이어 크기 업데이트
      player.radius += eatenLeftoverData.bonusGrowth;

      // 3. 모든 클라이언트에게 브로드캐스트
      // 다른 클라이언트들에게 찌꺼기가 먹혔음을 알려 제거하도록 함
      io.to(roomId).emit("leftoverEaten", {
        leftoverId: eatenLeftoverData.leftoverId,
        playerId: socket.id,
      });
      // 업데이트된 플레이어 정보 전송
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

        // 모든 플레이어 준비 상태 해제
        Object.values(rooms[roomId].players).forEach((p) => {
          p.isReady = false;
        });

        const finalScores = Object.values(rooms[roomId].players).map((p) => ({
          playerId: p.playerId,
          nickname: p.nickname,
          score: p.score,
        }));
        io.to(roomId).emit("gameFinished", finalScores);
        io.to(roomId).emit("updatePlayerList", rooms[roomId].players);
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

        // 방장이었는지 확인
        const wasHost = rooms[roomId].hostId === socket.id;

        delete rooms[roomId].players[socket.id];

        // 방장이 나갔고 남은 플레이어가 있다면 방장 승계
        if (wasHost && Object.keys(rooms[roomId].players).length > 0) {
          const nextHostId = Object.keys(rooms[roomId].players)[0]; // 가장 먼저 접속한(객체 키 순서상 첫번째) 플레이어
          rooms[roomId].hostId = nextHostId;
          rooms[roomId].players[nextHostId].isHost = true;
          console.log(`방 ${roomId}의 방장이 ${nextHostId}로 변경되었습니다.`);

          const nextHostNickname = rooms[roomId].players[nextHostId].nickname;
          io.to(roomId).emit(
            "systemMessage",
            `${nextHostNickname}님이 새로운 방장이 되었습니다.`,
          );
        }

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
