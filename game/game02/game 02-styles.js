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
      #ready-btn:hover {
        background-color: #45a049;
      }
    `;

  const styleElement = document.createElement("style");
  styleElement.innerHTML = css;
  document.head.appendChild(styleElement);
});
