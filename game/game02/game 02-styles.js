document.addEventListener("DOMContentLoaded", () => {
  const css = `
      #start-screen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        text-align: center;
        z-index: 100;
      }
      #start-screen h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      #start-screen .button-group button {
        font-size: 1.2rem;
        padding: 15px 30px;
        margin: 10px;
        cursor: pointer;
        border: 2px solid white;
        background: transparent;
        color: white;
        border-radius: 8px;
        transition:
          background 0.3s,
          color 0.3s;
      }
      #start-screen .button-group button:hover {
        background: white;
        color: black;
      }
      #home-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        font-size: 1rem;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid white;
        border-radius: 8px;
        cursor: pointer;
        z-index: 10;
      }
      #pause-btn {
        position: absolute;
        top: 20px;
        right: 120px;
        padding: 10px 20px;
        font-size: 1rem;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid white;
        border-radius: 8px;
        cursor: pointer;
        z-index: 10;
      }
      #pause-btn:hover {
        background: white;
        color: black;
      }
      #ui-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 20;
        pointer-events: none;
      }
      #ui-layer button {
        pointer-events: auto;
      }
      #home-btn:hover {
        background: white;
        color: black;
      }
      /* 설정 모달 스타일 */
      #settings-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 200;
        display: none; /* 기본적으로 숨김 */
      }
      .modal-content {
        background: rgba(30, 30, 30, 0.95);
        color: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        min-width: 300px;
        border: 2px solid white;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
      }
      .setting-item {
        margin: 1.5rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.2rem;
      }
      .setting-item select {
        padding: 5px;
        font-size: 1rem;
        border-radius: 5px;
      }
      #close-settings-btn {
        margin-top: 1rem;
        padding: 10px 25px;
        font-size: 1.1rem;
        cursor: pointer;
        background: transparent;
        color: white;
        border: 2px solid white;
        border-radius: 8px;
        transition:
          background 0.3s,
          color 0.3s;
      }
      #close-settings-btn:hover {
        background: white;
        color: black;
      }
      /* 캐릭터 선택 모달 스타일 */
      #char-select-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 200;
        display: none;
      }
      .char-grid {
        display: flex;
        gap: 20px;
        justify-content: center;
        margin: 20px 0;
      }
      .char-option {
        border: 2px solid transparent;
        border-radius: 10px;
        padding: 10px;
        cursor: pointer;
        transition: transform 0.2s;
      }
      .char-option:hover {
        transform: scale(1.1);
        background: rgba(255, 255, 255, 0.1);
      }
      .char-option.selected {
        border-color: #4CAF50;
        background: rgba(76, 175, 80, 0.2);
      }
      #close-char-btn {
        margin-top: 1rem;
        padding: 10px 25px;
        font-size: 1.1rem;
        cursor: pointer;
        background: transparent;
        color: white;
        border: 2px solid white;
        border-radius: 8px;
        transition: background 0.3s, color 0.3s;
      }
      #close-char-btn:hover {
        background: white;
        color: black;
      }
      /* 멀티플레이 모달 스타일 */
      #multiplayer-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 200;
        display: none;
      }
      .multiplayer-options {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin: 20px 0;
        align-items: center;
      }
      .join-room-section {
        display: flex;
        gap: 10px;
        width: 100%;
      }
      #room-id-input {
        flex-grow: 1;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        font-size: 1rem;
      }
      #create-room-btn, #join-room-btn {
        padding: 10px 20px;
        font-size: 1.1rem;
        cursor: pointer;
        color: white;
        border: none;
        border-radius: 8px;
        transition: background 0.3s;
        width: 100%;
      }
      #create-room-btn { background: #4CAF50; }
      #join-room-btn { background: #008CBA; }
      #create-room-btn:hover { background: #45a049; }
      #join-room-btn:hover { background: #007b9a; }
      #close-multiplayer-btn {
        margin-top: 1rem;
        padding: 10px 25px;
        font-size: 1.1rem;
        cursor: pointer;
        background: transparent;
        color: white;
        border: 2px solid white;
        border-radius: 8px;
        transition: background 0.3s, color 0.3s;
      }
      #close-multiplayer-btn:hover {
        background: white;
        color: black;
      }
      /* 대기실 모달 스타일 */
      #waiting-room-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 210;
        display: none;
      }
      #waiting-room-modal .modal-content p:first-of-type {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      #copy-room-id-btn {
        background: transparent;
        border: 1px solid #777;
        color: white;
        padding: 4px 8px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
        line-height: 1;
        transition: background-color 0.2s;
      }
      #copy-room-id-btn:hover {
        background-color: #555;
      }

      #ready-btn:hover {
        background-color: #45a049;
      }

      /* 멀티플레이 결과 모달 스타일 */
      #multi-results-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 220; /* 대기실보다 위에 */
      }
      #results-list .result-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 1.1rem;
      }
      #results-list .result-item:first-child {
        font-weight: bold;
        color: #ffd700; /* 금색 */
      }
      #results-list .result-item.first-place {
        font-size: 1.3rem;
        transform: scale(1.05);
        text-shadow: 0 0 5px #ffd700;
      }
      .results-buttons {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
      }
      .results-buttons button {
        padding: 10px 25px;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.2s;
      }
      #retry-game-btn {
        background-color: #4caf50; /* Green */
      }
      #retry-game-btn:hover {
        background-color: #45a049;
      }
      #leave-game-btn {
        background-color: #f44336; /* Red */
      }
      #leave-game-btn:hover {
        background-color: #da190b;
      }

      /* 카운트다운 오버레이 스타일 */
      #countdown-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 300; /* 대기실(210)보다 높게 */
        pointer-events: none;
      }
      #countdown-number {
        font-size: 10rem;
        color: white;
        font-weight: bold;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        animation: popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
      }
      @keyframes popIn {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }

      /* 채팅창 스타일 */
      #chat-container {
        position: absolute;
        bottom: 20px;
        left: 20px;
        width: 300px;
        height: 42px; /* 기본 상태: 입력창 높이만큼만 노출 */
        display: flex;
        flex-direction: column;
        justify-content: flex-end; /* 내용물을 아래로 정렬 */
        pointer-events: auto; /* UI 레이어가 pointer-events: none이어도 채팅은 가능하게 */
        z-index: 300;
        background: rgba(0, 0, 0, 0.3); /* 평소에는 연하게 */
        border-radius: 5px;
        transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s; /* 부드러운 애니메이션 */
        overflow: hidden; /* 접혀있을 때 내용 숨김 */
      }
      
      /* 마우스를 올리거나 입력창에 포커스가 있을 때 펼쳐짐 */
      #chat-container:hover,
      #chat-container:focus-within {
        height: 250px;
        background: rgba(0, 0, 0, 0.85); /* 활성화시 진한 배경 */
        box-shadow: 0 -5px 15px rgba(0,0,0,0.3);
      }

      #chat-messages {
        flex: 1;
        overflow-y: auto;
        /* background 제거 (컨테이너 배경 사용) */
        padding: 10px;
        border-radius: 5px 5px 0 0;
        color: white;
        font-size: 14px;
        text-align: left;
      }
      #chat-messages p {
        margin: 5px 0;
        word-wrap: break-word;
        text-shadow: 1px 1px 2px black;
      }
      #chat-input-wrapper {
        display: flex;
        width: 100%;
        min-height: 42px; /* 입력창 높이 고정 */
      }
      #chat-input {
        flex: 1;
        padding: 8px;
        border: none;
        background: rgba(255, 255, 255, 0.2); /* 약간 투명하게 */
        color: white;
        border-radius: 0 0 0 5px;
        outline: none;
        transition: background 0.2s;
      }
      #chat-send-btn {
        padding: 8px 15px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 0 0 5px 0;
        cursor: pointer;
      }
      #chat-send-btn:hover {
        background: #0b7dda;
      }
      #chat-input:focus {
        background: rgba(255, 255, 255, 0.9); /* 입력 시 밝게 */
        color: black;
      }

      /* 이모지 바 스타일 */
      #emoji-bar {
        position: absolute;
        bottom: 80px; /* 채팅창 위에 위치 */
        left: 20px;
        display: flex;
        gap: 10px;
        pointer-events: auto;
      }
      .emoji-btn {
        font-size: 1.5rem;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        transition: transform 0.2s, background 0.2s;
      }
      .emoji-btn:hover {
        transform: scale(1.2);
        background: rgba(255, 255, 255, 0.5);
      }

      /* 실시간 순위표 스타일 */
      #leaderboard {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 200px;
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 10px;
        color: white;
        pointer-events: none;
        font-size: 0.9rem;
      }
      .leaderboard-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }
    `;

  const styleElement = document.createElement("style");
  styleElement.innerHTML = css;
  document.head.appendChild(styleElement);
});
