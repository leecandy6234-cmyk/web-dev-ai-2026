// =============================================
// 대기실 관련 로직
// =============================================

function initWaitingRoom() {
  // 게임 시작 버튼 (호스트 전용)
  if (startGameBtn) {
    startGameBtn.addEventListener("click", () => {
      if (socket) socket.emit("startGame");
    });
  }

  // 방 나가기 버튼
  if (leaveRoomBtn) {
    leaveRoomBtn.addEventListener("click", () => {
      if (socket) socket.disconnect();
      if (waitingRoomModal) waitingRoomModal.style.display = "none";
      document.getElementById("start-screen").style.display = "flex";
      if (chatContainer) chatContainer.style.display = "none";
    });
  }

  // 닉네임 변경 버튼
  if (changeNicknameBtn) {
    changeNicknameBtn.addEventListener("click", () => {
      const newNickname = nicknameInput.value.trim();
      if (newNickname && socket) {
        socket.emit("changeNickname", newNickname);
      }
    });
  }

  // 준비/준비취소 버튼
  if (readyBtn) {
    readyBtn.addEventListener("click", () => {
      if (socket) socket.emit("toggleReady");
    });
  }

  // 방 ID 복사 버튼
  if (copyRoomIdBtn) {
    copyRoomIdBtn.addEventListener("click", () => {
      const roomId = waitingRoomIdDisplay.innerText;
      if (roomId) {
        navigator.clipboard.writeText(roomId).then(
          () => {
            // 성공 피드백
            const originalText = copyRoomIdBtn.innerHTML;
            copyRoomIdBtn.innerText = "✓";
            setTimeout(() => {
              copyRoomIdBtn.innerHTML = originalText;
            }, 1500);
          },
          (err) => {
            console.error("ID 복사 실패:", err);
            alert("ID 복사에 실패했습니다. 수동으로 복사해주세요.");
          },
        );
      }
    });
  }

  // 색상 변경 이벤트
  const colorInput = document.getElementById("chat-color-input");
  if (colorInput) {
    colorInput.addEventListener("change", (e) => {
      const newColor = e.target.value;
      localStorage.setItem("fish_chat_color", newColor);
      if (socket) socket.emit("changeColor", newColor);
    });
  }

  // 설정 토글 버튼 이벤트
  const toggleSettingsBtn = document.getElementById("toggle-settings-btn");
  const settingsDetails = document.getElementById("settings-details-content");
  const settingsHeader = document.querySelector(".settings-header");

  const toggleAction = () => {
    toggleSettingsBtn.classList.toggle("open");
    settingsDetails.classList.toggle("open");
  };

  if (toggleSettingsBtn && settingsDetails && settingsHeader) {
    // 헤더 전체를 클릭해도 토글되도록
    settingsHeader.addEventListener("click", toggleAction);
  }
}

// 대기실 UI를 표시하는 함수
function showWaitingRoom(roomId) {
  multiplayerModal.style.display = "none";
  waitingRoomModal.style.display = "flex";
  waitingRoomIdDisplay.innerText = roomId;

  // 저장된 색상 불러오기
  const colorInput = document.getElementById("chat-color-input");
  if (colorInput) {
    colorInput.value = localStorage.getItem("fish_chat_color") || "#81D4FA";
  }

  // 대기실 입장 시 채팅창 표시
  if (chatContainer) chatContainer.style.display = "flex";

  if (isHost) {
    startGameBtn.style.display = "block";
    waitingMessage.style.display = "none";
    readyBtn.style.display = "none";
  } else {
    startGameBtn.style.display = "none";
    waitingMessage.style.display = "block";
    readyBtn.style.display = "block";
  }

  // 호스트 설정 UI 상태 업데이트 (현재 호스트 권한에 맞춰)
  // 현재 설정값은 알 수 없으므로 UI 상태만 갱신하거나, 서버에 요청할 수도 있음.
  // 여기서는 간단히 활성화/비활성화 상태만 갱신 (값은 소켓 이벤트로 동기화됨)
  const hostSettingsContainer = document.getElementById(
    "host-settings-container",
  );
  if (hostSettingsContainer) {
    hostSettingsContainer.style.display = isHost ? "block" : "none";
  }
}

// 대기실 플레이어 목록 및 상태를 업데이트하는 함수
function updateWaitingRoomUI(players) {
  playerListContainer.innerHTML = "";

  const allReady = Object.values(players).every((p) => p.isHost || p.isReady);

  // 최고 점수 계산 (점수가 0보다 클 때만)
  const maxScore = Math.max(
    0,
    ...Object.values(players).map((p) => p.score || 0),
  );

  Object.values(players).forEach((p) => {
    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";

    let playerText = p.nickname;
    if (p.playerId === socket.id) playerText += " (나)";
    if (p.isHost) playerText += " 👑";

    // 점수 표시
    if (p.score !== undefined) {
      playerText += ` [${p.score}점]`;
    }

    // 1등 플레이어에게 왕관(메달) 표시
    if (maxScore > 0 && p.score === maxScore) {
      playerText += " 🥇";
    }

    const nameSpan = document.createElement("span");
    nameSpan.innerText = playerText;

    // 준비 완료 상태일 때 닉네임 색상 변경 (초록색 + 굵게)
    if (p.isReady) {
      nameSpan.style.color = "#4caf50";
      nameSpan.style.fontWeight = "bold";
    }
    div.appendChild(nameSpan);

    if (!p.isHost) {
      const statusSpan = document.createElement("span");
      if (p.isReady) {
        statusSpan.innerText = "준비 완료";
        statusSpan.style.color = "#4caf50";
        statusSpan.style.fontWeight = "bold";
      } else {
        statusSpan.innerText = "대기 중";
        statusSpan.style.color = "#aaa";
      }
      div.appendChild(statusSpan);
    }
    playerListContainer.appendChild(div);
  });

  if (isHost) {
    startGameBtn.disabled = !allReady;
    startGameBtn.style.opacity = allReady ? "1" : "0.5";
    startGameBtn.innerText = allReady ? "게임 시작" : "플레이어 준비 대기중...";
    startGameBtn.style.cursor = allReady ? "pointer" : "not-allowed";

    // 호스트 설정 보이기
    const hostSettingsContainer = document.getElementById(
      "host-settings-container",
    );
    if (hostSettingsContainer) {
      hostSettingsContainer.style.display = "block";
    }
  }

  if (!isHost) {
    const myPlayer = players[socket.id];
    if (myPlayer && myPlayer.isReady) {
      readyBtn.innerText = "준비 취소";
      readyBtn.style.backgroundColor = "#f44336";
    } else {
      readyBtn.innerText = "준비 완료";
      readyBtn.style.backgroundColor = "#4caf50";
    }

    // 호스트 설정 숨기기
    const hostSettingsContainer = document.getElementById(
      "host-settings-container",
    );
    if (hostSettingsContainer) {
      hostSettingsContainer.style.display = "none";
    }
  }
}
