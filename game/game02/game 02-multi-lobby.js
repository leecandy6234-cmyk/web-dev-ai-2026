// =============================================
// 로비 (방 만들기, 참여, 닉네임) 관련 로직
// =============================================

function initLobby() {
  // 저장된 닉네임 불러오기
  if (multiNicknameInput) {
    multiNicknameInput.value = localStorage.getItem("fish_nickname") || "";
  }
}

// 서버에 방 참여 요청을 보내는 함수
function joinRoomProcess(roomId, charType) {
  const nickname = multiNicknameInput ? multiNicknameInput.value.trim() : "";
  const chatColor = localStorage.getItem("fish_chat_color") || "#81D4FA";

  // 닉네임 로컬 저장
  if (nickname) {
    localStorage.setItem("fish_nickname", nickname);
  }
  localStorage.setItem("fish_chat_color", chatColor);

  socket.emit(
    "joinRoom",
    { roomId, charType, nickname, chatColor },
    (response) => {
      if (response.status === "ok") {
        isHost = response.hostId === socket.id;
        // 대기실 UI 표시 (waiting-room 모듈 함수 호출)
        showWaitingRoom(roomId);
      } else {
        alert(response.message);
        socket.disconnect();
      }
    },
  );
}
