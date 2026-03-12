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
  const color = data.color || "#81D4FA";
  p.innerHTML = `<span style="font-weight:bold; color: ${color};">${data.nickname}:</span> ${data.message}`;
  if (chatMessages) {
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 플로팅 메시지 표시 (채팅창 안 열어도 보이게)
  showFloatingChat(data);
}

function showFloatingChat(data) {
  const container = document.getElementById("floating-chat-container");
  if (!container) return;

  const msgDiv = document.createElement("div");
  const color = data.color || "#81D4FA";
  msgDiv.className = "floating-msg";
  msgDiv.innerHTML = `<span style="color: ${color}; font-weight: bold;">${data.nickname}</span>: ${data.message}`;

  container.appendChild(msgDiv);

  // 애니메이션 시간(4초) 후 요소 제거
  setTimeout(() => {
    msgDiv.remove();
  }, 4000);
}
