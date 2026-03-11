// =============================================
// 채팅 관련 로직
// =============================================

function initChat() {
  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener("click", sendChatMessage);
    chatInput.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Enter" && !e.isComposing) sendChatMessage();
    });
    chatInput.addEventListener("keypress", (e) => e.stopPropagation());
  }
}

// 채팅 메시지 전송
function sendChatMessage() {
  const msg = chatInput.value.trim();
  const roomId = waitingRoomIdDisplay ? waitingRoomIdDisplay.innerText : null;

  if (msg && socket && roomId) {
    socket.emit("sendChat", { roomId, message: msg });
    chatInput.value = "";
    chatInput.focus();
  }
}

// 수신된 채팅 메시지를 화면에 표시
function addChatMessage(data) {
  const p = document.createElement("p");
  p.innerHTML = `<span style="font-weight:bold; color: #81D4FA;">${data.nickname}:</span> ${data.message}`;
  if (chatMessages) {
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}
