let socket; // 소켓 객체
let otherPlayers = {}; // 다른 플레이어들 데이터 저장
let isMultiplayer = false; // 멀티플레이 모드 여부
let isHost = false; // 방장 여부

// UI 요소 참조 (DOM 로드 후 사용됨)
let waitingRoomModal,
  waitingRoomIdDisplay,
  playerListContainer,
  startGameBtn,
  waitingMessage,
  leaveRoomBtn,
  nicknameInput,
  changeNicknameBtn,
  readyBtn,
  multiNicknameInput;

document.addEventListener("DOMContentLoaded", () => {
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

  // 저장된 닉네임 불러오기
  if (multiNicknameInput) {
    multiNicknameInput.value = localStorage.getItem("fish_nickname") || "";
  }

  // 대기실 버튼 이벤트
  if (startGameBtn) {
    startGameBtn.addEventListener("click", () => {
      if (socket) socket.emit("startGame");
    });
  }

  if (leaveRoomBtn) {
    leaveRoomBtn.addEventListener("click", () => {
      if (socket) socket.disconnect();
      if (waitingRoomModal) waitingRoomModal.style.display = "none";
      document.getElementById("start-screen").style.display = "flex";
    });
  }

  if (changeNicknameBtn) {
    changeNicknameBtn.addEventListener("click", () => {
      const newNickname = nicknameInput.value.trim();
      if (newNickname && socket) {
        socket.emit("changeNickname", newNickname);
      }
    });
  }

  if (readyBtn) {
    readyBtn.addEventListener("click", () => {
      if (socket) socket.emit("toggleReady");
    });
  }
});

function connectToSocketAndStart(action, roomId) {
  try {
    socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("서버에 연결되었습니다.");
      // 현재 선택된 캐릭터 타입 확인 (game 02-01.js의 변수 사용)
      const charType = currentPlayerImage === enemyImg ? "fish-2" : "fish-1";

      if (action === "create") {
        socket.emit("createRoom", (newRoomId) => {
          // 방 생성 후 바로 참여 처리
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

    // 기존 소켓 이벤트 핸들러들
    socket.on("currentPlayers", (players) => {
      otherPlayers = players;
      delete otherPlayers[socket.id];
    });
    socket.on("newPlayer", (playerInfo) => {
      otherPlayers[playerInfo.playerId] = playerInfo;
    });

    // 대기실 목록 갱신
    socket.on("updatePlayerList", (players) => {
      updateWaitingRoomUI(players);
    });

    // 게임 시작 신호
    socket.on("gameStarted", () => {
      waitingRoomModal.style.display = "none";
      startGame(true); // game 02-01.js의 함수 호출
    });

    socket.on("userDisconnect", (id) => {
      delete otherPlayers[id];
    });
    socket.on("playerMoved", (playerInfo) => {
      otherPlayers[playerInfo.playerId] = playerInfo;
    });
  } catch (e) {
    alert("Socket.io 라이브러리가 로드되지 않았거나 서버 오류입니다.");
    console.error(e);
  }
}

function joinRoomProcess(roomId, charType) {
  const nickname = multiNicknameInput ? multiNicknameInput.value.trim() : "";

  // 닉네임 저장
  if (nickname) {
    localStorage.setItem("fish_nickname", nickname);
  }

  socket.emit("joinRoom", { roomId, charType, nickname }, (response) => {
    if (response.status === "ok") {
      isHost = response.hostId === socket.id;
      showWaitingRoom(roomId);
    } else {
      alert(response.message);
      socket.disconnect();
    }
  });
}

function showWaitingRoom(roomId) {
  // 멀티플레이 모달 숨기고 대기실 표시
  document.getElementById("multiplayer-modal").style.display = "none";
  waitingRoomModal.style.display = "flex";
  waitingRoomIdDisplay.innerText = roomId;

  if (isHost) {
    startGameBtn.style.display = "block";
    waitingMessage.style.display = "none";
  } else {
    startGameBtn.style.display = "none";
    waitingMessage.style.display = "block";
  }
}

function updateWaitingRoomUI(players) {
  playerListContainer.innerHTML = "";
  Object.values(players).forEach((p) => {
    const div = document.createElement("div");
    div.style.padding = "5px";
    div.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
    let playerText = p.nickname;
    if (p.playerId === socket.id) playerText += " (나)";
    if (p.playerId === isHost) playerText += " 👑"; // isHost는 boolean, hostId를 저장해야 함
    div.innerText = playerText;
    playerListContainer.appendChild(div);
  });
}

// 다른 플레이어 그리기 함수
function drawOtherPlayer(ctx, p, playerImg, enemyImg) {
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
  ctx.drawImage(img, -20, -20, 40, 40); // 크기는 고정값 사용 (간소화)

  // 닉네임 표시
  ctx.restore(); // 회전, 스케일 초기화
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(p.nickname, p.x, p.y - 30); // 물고기 위에 닉네임 표시
  ctx.restore();
}
