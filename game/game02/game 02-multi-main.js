// =============================================
// 전역 변수 및 소켓 연결 관리 (Main)
// =============================================

// 전역 변수
var socket;
var otherPlayers = {};
var isMultiplayer = false;
var isHost = false;

// UI 요소 참조
var waitingRoomModal,
  waitingRoomIdDisplay,
  playerListContainer,
  startGameBtn,
  waitingMessage,
  leaveRoomBtn,
  nicknameInput,
  changeNicknameBtn,
  readyBtn,
  multiNicknameInput,
  chatContainer,
  chatInput,
  chatSendBtn,
  chatMessages,
  multiNicknameInput,
  multiResultsModal,
  resultsList,
  retryGameBtn,
  leaveGameBtn,
  copyRoomIdBtn,
  countdownOverlay,
  countdownNumber,
  emojiBar,
  emojiBtns,
  leaderboard;

// DOM 로드 시 모든 초기화 함수 실행
document.addEventListener("DOMContentLoaded", () => {
  // UI 요소 할당
  waitingRoomModal = document.getElementById("waiting-room-modal");
  waitingRoomIdDisplay = document.getElementById("waiting-room-id");
  playerListContainer = document.getElementById("player-list");
  startGameBtn = document.getElementById("start-game-btn");
  waitingMessage = document.getElementById("waiting-message");
  leaveRoomBtn = document.getElementById("leave-room-btn");
  nicknameInput = document.getElementById("nickname-input");
  changeNicknameBtn = document.getElementById("change-nickname-btn");
  readyBtn = document.getElementById("ready-btn");
  multiNicknameInput = document.getElementById("multi-nickname-input");
  chatContainer = document.getElementById("chat-container");
  chatInput = document.getElementById("chat-input");
  chatSendBtn = document.getElementById("chat-send-btn");
  chatMessages = document.getElementById("chat-messages");
  multiResultsModal = document.getElementById("multi-results-modal");
  resultsList = document.getElementById("results-list");
  retryGameBtn = document.getElementById("retry-game-btn");
  leaveGameBtn = document.getElementById("leave-game-btn");
  copyRoomIdBtn = document.getElementById("copy-room-id-btn");
  countdownOverlay = document.getElementById("countdown-overlay");
  countdownNumber = document.getElementById("countdown-number");
  emojiBar = document.getElementById("emoji-bar");
  emojiBtns = document.querySelectorAll(".emoji-btn");
  leaderboard = document.getElementById("leaderboard");

  // 각 모듈 초기화
  initLobby();
  initWaitingRoom();
  initChat();

  retryGameBtn.addEventListener("click", () => {
    // 결과 모달 숨기고 대기실 다시 표시
    multiResultsModal.style.display = "none";
    waitingRoomModal.style.display = "flex";
    if (chatContainer) chatContainer.style.display = "flex";
  });

  leaveGameBtn.addEventListener("click", () => {
    // 결과 모달 숨기고, 소켓 연결 끊고, 시작 화면으로
    multiResultsModal.style.display = "none";
    if (socket) {
      socket.disconnect();
    }
    document.getElementById("start-screen").style.display = "flex";
    if (chatContainer) chatContainer.style.display = "none";
    if (emojiBar) emojiBar.style.display = "none";
    if (leaderboard) leaderboard.style.display = "none";
  });

  // 이모지 버튼 이벤트
  emojiBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (socket) socket.emit("sendEmoji", { emoji: btn.innerText });
    });
  });
});

// 순위표 업데이트 함수
function updateLeaderboard() {
  if (!leaderboard) return;

  // 나를 포함한 모든 플레이어 목록 생성
  const allPlayers = [{ ...player, nickname: "나", isMe: true }];
  Object.values(otherPlayers).forEach((p) => allPlayers.push(p));

  // 점수 내림차순 정렬
  allPlayers.sort((a, b) => (b.score || 0) - (a.score || 0));

  // HTML 생성 (상위 5명만 표시)
  leaderboard.innerHTML =
    "<h3 style='margin:0 0 10px 0; font-size:1rem; text-align:center;'>순위표</h3>";
  allPlayers.slice(0, 5).forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "leaderboard-item";
    if (p.isMe) div.style.color = "#81D4FA"; // 나는 하늘색으로 강조
    if (index === 0) div.style.color = "#FFD700"; // 1등은 금색

    div.innerHTML = `<span>${index + 1}. ${p.nickname}</span><span>${p.score || 0}</span>`;
    leaderboard.appendChild(div);
  });
}

// 소켓 연결 및 이벤트 핸들러 설정
function connectToSocketAndStart(action, roomId) {
  try {
    socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("서버에 연결되었습니다.");
      const charType = currentPlayerImage === enemyImg ? "fish-2" : "fish-1";

      if (action === "create") {
        socket.emit("createRoom", (newRoomId) => {
          joinRoomProcess(newRoomId, charType);
        });
      } else if (action === "join") {
        joinRoomProcess(roomId, charType);
      }
    });

    socket.on("connect_error", (err) => {
      alert(
        "서버에 연결할 수 없습니다. 서버가 켜져있는지 확인해주세요.\n(npm install 후 node server.js 실행)",
      );
      if (socket) socket.disconnect();
    });

    // --- 게임 상태 관련 이벤트 ---
    socket.on("currentPlayers", (players) => {
      otherPlayers = players;
      delete otherPlayers[socket.id];
    });
    socket.on("newPlayer", (playerInfo) => {
      otherPlayers[playerInfo.playerId] = playerInfo;
    });
    socket.on("userDisconnect", (id) => {
      delete otherPlayers[id];
      updateLeaderboard();
    });
    socket.on("playerMoved", (playerInfo) => {
      otherPlayers[playerInfo.playerId] = playerInfo;
      // 움직임만으로는 점수가 안 바뀌므로 순위표 갱신 안 함 (최적화)
    });
    socket.on("newFishSpawned", (fishData) => {
      if (!isHost) {
        const newFish = new Fish(); // 기본 Fish 객체 생성
        // 서버에서 받은 데이터로 속성 덮어쓰기
        Object.assign(newFish, fishData);
        // 서버에서 받은 비율(normalized) 좌표를 현재 클라이언트의 캔버스 크기에 맞게 변환
        newFish.x = fishData.x * canvas.width;
        newFish.y = fishData.y * canvas.height;
        fishes.push(newFish); // 동기화된 물고기를 배열에 추가
      }
    });

    // 물고기가 먹혔다는 신호 수신
    socket.on("fishEaten", ({ fishId, playerId, x, y, radius }) => {
      // 모든 클라이언트에서 시각 효과 생성
      bones.push(new Bone(x, y, radius));
      if (Math.random() < 0.5) {
        leftovers.push(new Leftover(x, y));
      }

      // fishes 배열에서 해당 물고기 찾아서 제거
      const fishIndex = fishes.findIndex((f) => f.id === fishId);
      if (fishIndex !== -1) {
        fishes.splice(fishIndex, 1);
      }
    });

    // 찌꺼기가 먹혔다는 신호 수신
    socket.on("leftoverEaten", ({ leftoverId }) => {
      const leftoverIndex = leftovers.findIndex((l) => l.id === leftoverId);
      if (leftoverIndex !== -1) {
        leftovers.splice(leftoverIndex, 1);
      }
    });

    // 플레이어 상태(점수, 크기) 업데이트 신호 수신
    socket.on("playerUpdated", (updatedPlayer) => {
      if (updatedPlayer.playerId === socket.id) {
        // 내 정보 업데이트
        player.radius = updatedPlayer.radius;
        score = updatedPlayer.score;
        if (player.isShiny !== updatedPlayer.isShiny) {
          player.isShiny = updatedPlayer.isShiny;
          if (player.isShiny) {
            player.shinyTimer = 1200; // 20초
          }
        }
      } else if (otherPlayers[updatedPlayer.playerId]) {
        // 다른 플레이어 정보 업데이트
        Object.assign(otherPlayers[updatedPlayer.playerId], updatedPlayer);
      }
      updateLeaderboard();
    });

    // --- 대기실 관련 이벤트 ---
    socket.on("updatePlayerList", (players) => {
      // 내 방장 권한 상태 업데이트
      if (players[socket.id]) {
        isHost = players[socket.id].isHost;
      }
      updateWaitingRoomUI(players);
    });

    // 카운트다운 신호 수신
    socket.on("countdown", (count) => {
      if (countdownOverlay && countdownNumber) {
        countdownOverlay.style.display = "flex";
        countdownNumber.innerText = count;
      }
    });

    socket.on("gameStarted", () => {
      waitingRoomModal.style.display = "none";
      if (countdownOverlay) countdownOverlay.style.display = "none"; // 게임 시작 시 카운트다운 숨김
      startGame(true);
      if (chatContainer) chatContainer.style.display = "flex";
      if (emojiBar) emojiBar.style.display = "flex";
      if (leaderboard) leaderboard.style.display = "block";
      updateLeaderboard();
    });

    // 플레이어 사망 알림 수신
    socket.on("playerDiedAnnouncement", (message) => {
      const p = document.createElement("p");
      p.innerHTML = `<span style="font-weight:bold; color: #ff5252;">${message}</span>`;
      if (chatMessages) {
        chatMessages.appendChild(p);
        // 스크롤을 맨 아래로 이동
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });

    // 시스템 알림 메시지 수신 (방장 변경 등)
    socket.on("systemMessage", (message) => {
      const p = document.createElement("p");
      // 시스템 메시지는 눈에 띄는 밝은 초록색 등으로 표시
      p.innerHTML = `<span style="font-weight:bold; color: #69F0AE;">[시스템] ${message}</span>`;
      if (chatMessages) {
        chatMessages.appendChild(p);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });

    // 이모지 수신
    socket.on("emojiSent", ({ playerId, emoji }) => {
      if (playerId === socket.id) {
        player.currentEmoji = emoji;
        player.emojiTimer = 120; // 약 2초간 표시 (60fps 기준)
      } else if (otherPlayers[playerId]) {
        otherPlayers[playerId].currentEmoji = emoji;
        otherPlayers[playerId].emojiTimer = 120;
      }
    });

    // 다른 플레이어가 죽었을 때 화면에서 제거
    socket.on("playerKilled", (id) => {
      delete otherPlayers[id];
      updateLeaderboard();
    });

    socket.on("gameFinished", (finalScores) => {
      isGameOver = true;
      bgm.pause();

      // UI 숨기기
      canvas.classList.add("hidden");
      uiLayer.classList.add("hidden");
      chatContainer.style.display = "none";
      if (emojiBar) emojiBar.style.display = "none";
      if (leaderboard) leaderboard.style.display = "none";

      // 점수판 생성
      resultsList.innerHTML = "";
      finalScores
        .sort((a, b) => b.score - a.score)
        .forEach((p, index) => {
          const rank = index + 1;
          const item = document.createElement("div");
          item.className = "result-item";
          let playerText = `${rank}. ${p.nickname}`;
          if (p.playerId === socket.id) {
            playerText += " (나)";
            item.style.color = "#81D4FA"; // '나'를 강조하는 색상
          }
          if (rank === 1) {
            item.classList.add("first-place");
          }

          item.innerHTML = `<span>${playerText}</span><span>${p.score}점</span>`;
          resultsList.appendChild(item);
        });

      // 결과 모달 표시
      multiResultsModal.style.display = "flex";
    });

    // --- 채팅 관련 이벤트 ---
    socket.on("newChat", (data) => {
      addChatMessage(data);
    });
  } catch (e) {
    alert("Socket.io 라이브러리가 로드되지 않았거나 서버 오류입니다.");
    console.error(e);
  }
}

// 다른 플레이어 그리기 함수 (game 02-01.js에서 호출)
function drawOtherPlayer(ctx, p, playerImg, enemyImg, isLeader) {
  ctx.save();
  ctx.translate(p.x, p.y);

  if (p.isShiny) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = "gold";
  }

  ctx.rotate(p.angle);
  if (p.angle > Math.PI / 2 || p.angle < -Math.PI / 2) {
    ctx.scale(1, -1);
  }

  const img = p.charType === "fish-2" ? enemyImg : playerImg;
  ctx.drawImage(img, -20, -20, 40, 40);

  ctx.restore();
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(p.nickname, p.x, p.y - 30);

  if (isLeader) {
    ctx.font = "20px sans-serif";
    ctx.fillText("👑", p.x, p.y - 50);
  }

  // 이모지 표시
  if (p.currentEmoji && p.emojiTimer > 0) {
    ctx.font = "30px sans-serif";
    ctx.fillText(p.currentEmoji, p.x, p.y - 70);
  }
  ctx.restore();
}
