const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("game-over");
const finalScoreElement = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const startScreen = document.getElementById("start-screen");
const singlePlayerBtn = document.getElementById("single-player-btn");
const multiPlayerBtn = document.getElementById("multi-player-btn");
const uiLayer = document.getElementById("ui-layer");
const homeBtn = document.getElementById("home-btn");
const pauseBtn = document.getElementById("pause-btn");
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const closeSettingsBtn = document.getElementById("close-settings-btn");
const difficultySelect = document.getElementById("difficulty-select");
const soundToggle = document.getElementById("sound-toggle");
const charSelectBtn = document.getElementById("char-select-btn");
const charSelectModal = document.getElementById("char-select-modal");
const closeCharBtn = document.getElementById("close-char-btn");
const charOptions = document.querySelectorAll(".char-option");
const multiplayerModal = document.getElementById("multiplayer-modal");
const createRoomBtn = document.getElementById("create-room-btn");
const joinRoomBtn = document.getElementById("join-room-btn");
const roomIdInput = document.getElementById("room-id-input");
const closeMultiplayerBtn = document.getElementById("close-multiplayer-btn");

// 이미지 로드 설정
const playerImg = new Image();
const enemyImg = new Image();
const boneImg = new Image();
const leftover1Img = new Image();
const leftover2Img = new Image();

let imagesLoaded = 0;
const totalImages = 5;

let currentPlayerImage = playerImg; // 현재 선택된 캐릭터 이미지

function handleImageLoad() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    // init(); // 버튼 클릭 시 시작하도록 변경
  }
}

playerImg.onload = handleImageLoad;
enemyImg.onload = handleImageLoad;
boneImg.onload = handleImageLoad;
leftover1Img.onload = handleImageLoad;
leftover2Img.onload = handleImageLoad;
playerImg.onerror = () =>
  alert("플레이어 이미지(fish-1.png)를 찾을 수 없습니다.");
enemyImg.onerror = () => alert("적 이미지(fish-2.png)를 찾을 수 없습니다.");
boneImg.onerror = () => alert("뼈 이미지(bone.png)를 찾을 수 없습니다.");
leftover1Img.onerror = () =>
  alert("작은 찌꺼기 이미지(leftover1.png)를 찾을 수 없습니다.");
leftover2Img.onerror = () =>
  alert("큰 찌꺼기 이미지(leftover2.png)를 찾을 수 없습니다.");

playerImg.src = "fish-1.png";
enemyImg.src = "fish-2.png";
boneImg.src = "bone.png";
leftover1Img.src = "leftover1.png";
leftover2Img.src = "leftover2.png";

// 오디오 설정
const bgm = new Audio("bgm.mp3");
bgm.loop = true;

// 캔버스 크기 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// 게임 변수
let score = 0;
let gameFrame = 0;
let isGameOver = false;
let isPaused = false;
let currentDifficultyKey = "normal";
let bestScore =
  localStorage.getItem(`fish_best_score_${currentDifficultyKey}`) || 0;
let animationId;
let spawnRate = 50; // 적 생성 주기 (기본: 보통)
let currentDifficulty = "보통";
let isSpectating = false; // 관전 모드 여부

// 배경 버블 생성
const bubbles = [];
for (let i = 0; i < 50; i++) {
  bubbles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 5 + 2,
    speed: Math.random() * 1 + 0.5,
  });
}

function drawBackground() {
  // 1. 그라데이션 배경 (깊은 바다 느낌)
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#6DD5FA"); // 위쪽: 밝은 하늘색
  gradient.addColorStop(1, "#2980B9"); // 아래쪽: 진한 파란색
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. 해초 (바닥에서 흔들림)
  ctx.fillStyle = "#27ae60";
  ctx.globalAlpha = 0.8;
  const numSeaweed = Math.ceil(canvas.width / 60);
  for (let i = 0; i <= numSeaweed; i++) {
    const x = i * 60;
    const height = 120 + Math.sin(gameFrame * 0.02 + i * 132) * 20; // 높이 변화
    const sway = Math.sin(gameFrame * 0.03 + i * 50) * 15; // 흔들림

    ctx.beginPath();
    ctx.moveTo(x, canvas.height);
    ctx.quadraticCurveTo(
      x + sway,
      canvas.height - height / 2,
      x + sway * 1.5,
      canvas.height - height,
    );
    ctx.quadraticCurveTo(
      x - sway,
      canvas.height - height / 2,
      x + 20, // 두께
      canvas.height,
    );
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // 3. 공기방울 (위로 올라감)
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  for (const bubble of bubbles) {
    bubble.y -= bubble.speed;
    // 화면 위로 나가면 바닥에서 재생성
    if (bubble.y < -bubble.radius) {
      bubble.y = canvas.height + bubble.radius;
      bubble.x = Math.random() * canvas.width;
    }
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

// 마우스 좌표
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// 플레이어 물고기 클래스
class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 20; // 초기 크기
    this.angle = 0;
    this.isShiny = false;
    this.shinyTimer = 0;
    this.currentEmoji = null;
    this.emojiTimer = 0;
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;

    // 마우스 방향으로의 각도 계산
    this.angle = Math.atan2(dy, dx);

    // 마우스 방향으로 회전
    if (mouse.x !== this.x) {
      this.x += dx / 5; // 부드러운 이동 (속도 증가)
    }
    if (mouse.y !== this.y) {
      this.y += dy / 5;
    }

    // 반짝임 효과 타이머
    if (this.isShiny) {
      this.shinyTimer--;
      if (this.shinyTimer <= 0) {
        this.isShiny = false;
      }
    }

    // 이모지 타이머
    if (this.emojiTimer > 0) {
      this.emojiTimer--;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.isShiny) {
      ctx.shadowBlur = 20 + Math.sin(gameFrame * 0.1) * 10; // 반짝이는 효과 (맥동)
      ctx.shadowColor = "gold";
    }

    // 계산된 각도로 회전
    ctx.rotate(this.angle);
    // 물고기가 왼쪽을 볼 때(각도가 90도 이상이거나 -90도 이하) 뒤집혀 보이지 않도록 상하 반전
    if (this.angle > Math.PI / 2 || this.angle < -Math.PI / 2) {
      ctx.scale(1, -1);
    }

    // 플레이어 이미지 그리기
    ctx.drawImage(
      currentPlayerImage,
      -this.radius,
      -this.radius,
      this.radius * 2,
      this.radius * 2,
    );

    // 내가 1등이면 왕관 그리기 (isLeader는 animate 함수에서 계산됨)
    if (this.isLeader) {
      ctx.font = "20px sans-serif";
      ctx.fillText("👑", 0, -this.radius - 10);
    }

    // 이모지 그리기
    if (this.currentEmoji && this.emojiTimer > 0) {
      ctx.font = "30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(this.currentEmoji, 0, -this.radius - 30);
    }

    ctx.restore();
  }
}

// 물고기 뼈 클래스
class Bone {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.alpha = 1; // 투명도
  }

  update() {
    this.y += 0.5; // 천천히 가라앉음
    this.alpha -= 0.005; // 서서히 사라짐
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(
      boneImg,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2,
    );
    ctx.restore();
  }
}

// 찌꺼기 클래스
class Leftover {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.id = `leftover_${gameFrame}_${Math.random()}`; // 동기화를 위한 고유 ID

    // 50% 확률로 크고 작은 찌꺼기 생성
    if (Math.random() < 0.5) {
      this.radius = 10; // 작은 찌꺼기
      this.bonusScore = 5;
      this.bonusGrowth = 0.2;
      this.image = leftover1Img;
    } else {
      this.radius = 20; // 큰 찌꺼기
      this.bonusScore = 10;
      this.bonusGrowth = 0.5;
      this.image = leftover2Img;
    }

    this.alpha = 1;
    this.timer = 0;
    this.isBeingEaten = false; // 중복 먹기 방지 플래그
  }

  update() {
    this.y += 0.2; // 더 천천히 가라앉음
    this.timer++;
    if (this.timer > 600) {
      // 지속 시간 3배 증가 (플레이어가 먹을 시간 확보)
      this.alpha -= 0.02; // 일정 시간 후 사라짐
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2,
    );
    ctx.restore();
  }
}

// 적/먹이 물고기 클래스
class Fish {
  constructor() {
    // 플레이어 크기 기준으로 랜덤 크기 생성 (작은 것 ~ 큰 것)
    const minSize = 10;
    const maxSize = player.radius + 40;
    this.radius = Math.random() * (maxSize - minSize) + minSize;

    // 화면 밖 랜덤 위치 생성
    if (Math.random() < 0.5) {
      this.x =
        Math.random() < 0.5 ? 0 - this.radius : canvas.width + this.radius;
      this.y = Math.random() * canvas.height;
    } else {
      this.x = Math.random() * canvas.width;
      this.y =
        Math.random() < 0.5 ? 0 - this.radius : canvas.height + this.radius;
    }

    // 목표 지점 (화면 반대편)을 향해 이동
    const targetX = Math.random() * canvas.width;
    const targetY = Math.random() * canvas.height;
    const angle = Math.atan2(targetY - this.y, targetX - this.x);
    this.angle = angle;
    this.speed = Math.random() * 2 + 1;
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
    this.isShiny = Math.random() < 0.1; // 10% 확률로 반짝임
    this.id = `fish_${gameFrame}_${Math.random()}`; // 동기화를 위한 고유 ID
    this.isBeingEaten = false; // 중복 먹기 방지 플래그
  }

  update() {
    // 멀티플레이 동기화를 위해 AI 로직을 제거하고,
    // 초기에 설정된 속도(dx, dy)로만 움직이도록 단순화합니다.
    // 이렇게 하면 모든 클라이언트에서 동일한 경로로 움직입니다.
    this.x += this.dx;
    this.y += this.dy;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.isShiny) {
      ctx.shadowBlur = 15 + Math.sin(gameFrame * 0.1) * 5;
      ctx.shadowColor = "gold";
    }
    // 이동 방향으로 회전
    ctx.rotate(this.angle);
    // 물고기가 왼쪽을 볼 때(각도가 90도 이상이거나 -90도 이하) 뒤집혀 보이지 않도록 상하 반전
    if (this.angle > Math.PI / 2 || this.angle < -Math.PI / 2) {
      ctx.scale(1, -1);
    }

    // 적 물고기 이미지 그리기
    ctx.drawImage(
      enemyImg,
      -this.radius,
      -this.radius,
      this.radius * 2,
      this.radius * 2,
    );

    ctx.restore();
  }
}

let player = new Player();
let fishes = [];
let bones = [];
let leftovers = [];

function init() {
  // 싱글/멀티 공통 초기화
  player = new Player();
  fishes = [];
  bones = [];
  leftovers = [];
  score = 0;
  gameFrame = 0;
  isGameOver = false;
  isPaused = false;
  isSpectating = false;
  bestScore =
    localStorage.getItem(`fish_best_score_${currentDifficultyKey}`) || 0;
  scoreElement.innerText = `Score: 0 | Best: ${bestScore} (${currentDifficulty})`;
  gameOverElement.classList.add("hidden");
  pauseBtn.innerText = "⏸️ 일시정지";
  if (soundToggle.checked) {
    bgm.play().catch((e) => console.log("BGM 재생 실패:", e));
  }

  // 멀티플레이라면 적 생성 안 함 (간단한 동기화를 위해)
  if (isMultiplayer) {
    fishes = [];
  }
  animate();
}

function animate() {
  if (isGameOver) return;
  if (isPaused) return;

  drawBackground(); // 배경 그리기 (그라데이션 + 해초 + 버블)

  // 뼈 업데이트 및 그리기
  for (let i = 0; i < bones.length; i++) {
    bones[i].update();
    bones[i].draw();
    if (bones[i].alpha <= 0) {
      bones.splice(i, 1);
      i--;
    }
  }

  // 찌꺼기 업데이트 및 그리기
  for (let i = 0; i < leftovers.length; i++) {
    leftovers[i].update();
    leftovers[i].draw();

    // 플레이어가 찌꺼기를 먹음
    const dist = Math.hypot(
      player.x - leftovers[i].x,
      player.y - leftovers[i].y,
    );
    if (dist < player.radius + leftovers[i].radius) {
      if (isMultiplayer) {
        if (!leftovers[i].isBeingEaten) {
          leftovers[i].isBeingEaten = true;
          socket.emit("iAteLeftover", {
            leftoverId: leftovers[i].id,
            bonusScore: leftovers[i].bonusScore,
            bonusGrowth: leftovers[i].bonusGrowth,
          });
        }
      } else {
        let points = leftovers[i].bonusScore;
        if (player.isShiny) points *= 2; // 반짝일 때 점수 2배
        score += points;
        player.radius += leftovers[i].bonusGrowth; // 찌꺼기 종류에 따른 크기 증가
        leftovers.splice(i, 1);
        i--;
      }
      continue;
    }

    if (leftovers[i].alpha <= 0) {
      leftovers.splice(i, 1);
      i--;
    }
  }

  // 플레이어 업데이트 및 그리기 (살아있을 때만)
  if (!isSpectating) {
    player.update();
    player.draw();
  } else {
    // 관전 모드 안내 텍스트
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "bold 30px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("관전 모드", canvas.width / 2, 100);
    ctx.font = "20px sans-serif";
    ctx.fillText(
      "다른 플레이어의 게임을 지켜보고 있습니다.",
      canvas.width / 2,
      140,
    );
    ctx.restore();
  }

  // --- 멀티플레이 로직 ---
  if (isMultiplayer && socket) {
    // 1등 점수 계산
    let maxScore = player.score || 0;
    if (Object.keys(otherPlayers).length > 0) {
      const otherMax = Math.max(
        ...Object.values(otherPlayers).map((p) => p.score || 0),
      );
      maxScore = Math.max(maxScore, otherMax);
    }
    const isScorePositive = maxScore > 0;

    // 1. 내 위치 전송
    if (!isSpectating) {
      const charType = currentPlayerImage === enemyImg ? "fish-2" : "fish-1";
      socket.emit("playerMovement", {
        x: player.x,
        y: player.y,
        angle: player.angle,
        charType: charType,
        isShiny: player.isShiny,
        radius: player.radius,
      });

      // 내 닉네임 표시
      ctx.save();
      ctx.fillStyle = "white";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("나", player.x, player.y - player.radius - 10);

      // 이모지 표시 (나)
      if (player.currentEmoji && player.emojiTimer > 0) {
        ctx.font = "30px sans-serif";
        ctx.fillText(
          player.currentEmoji,
          player.x,
          player.y - player.radius - 50,
        );
      }
      ctx.restore();
    }

    // 내가 1등인지 여부를 player 객체에 저장
    player.isLeader = isScorePositive && player.score >= maxScore;

    // 2. 다른 플레이어 그리기
    Object.keys(otherPlayers).forEach((id) => {
      const p = otherPlayers[id];
      const isLeader = isScorePositive && (p.score || 0) >= maxScore;
      drawOtherPlayer(ctx, p, playerImg, enemyImg, isLeader);

      // 다른 플레이어 이모지 타이머 감소
      if (p.emojiTimer > 0) {
        p.emojiTimer--;
      }
    });
  }
  // -----------------------

  // 적 생성 로직
  if (!isMultiplayer) {
    // 싱글플레이: 클라이언트가 직접 생성
    if (gameFrame % spawnRate === 0) {
      fishes.push(new Fish());
    }
  } else if (isHost) {
    // 멀티플레이: 호스트만 생성하고 다른 클라이언트에게 알림
    if (gameFrame % spawnRate === 0) {
      const newFish = new Fish();
      fishes.push(newFish);
      socket.emit("spawnFish", {
        id: newFish.id,
        radius: newFish.radius, // 크기는 절대값이므로 그대로 전송
        x: newFish.x / canvas.width, // x좌표를 0~1 사이의 비율로 변환
        y: newFish.y / canvas.height, // y좌표를 0~1 사이의 비율로 변환
        angle: newFish.angle,
        speed: newFish.speed,
        dx: newFish.dx, // 속도는 절대값이므로 그대로 전송
        dy: newFish.dy, // 속도는 절대값이므로 그대로 전송
        isShiny: newFish.isShiny,
      });
    }
  }

  for (let i = 0; i < fishes.length; i++) {
    fishes[i].update();
    fishes[i].draw();

    // 적 물고기끼리의 충돌 (서로 잡아먹기)
    for (let j = i + 1; j < fishes.length; j++) {
      const dist = Math.hypot(
        fishes[i].x - fishes[j].x,
        fishes[i].y - fishes[j].y,
      );
      if (dist < fishes[i].radius + fishes[j].radius) {
        if (fishes[i].radius > fishes[j].radius * 1.1) {
          // i가 j를 먹음
          bones.push(new Bone(fishes[j].x, fishes[j].y, fishes[j].radius));
          if (Math.random() < 0.5)
            leftovers.push(new Leftover(fishes[j].x, fishes[j].y)); // 50% 확률로 찌꺼기 생성
          fishes[i].radius += fishes[j].radius * 0.1; // 조금 커짐
          fishes.splice(j, 1);
          j--;
        } else if (fishes[j].radius > fishes[i].radius * 1.1) {
          // j가 i를 먹음
          bones.push(new Bone(fishes[i].x, fishes[i].y, fishes[i].radius));
          if (Math.random() < 0.5)
            leftovers.push(new Leftover(fishes[i].x, fishes[i].y));
          fishes[j].radius += fishes[i].radius * 0.1;
          fishes.splice(i, 1);
          i--;
          break; // i가 사라졌으므로 더 이상 i에 대한 체크 불필요
        }
      }
    }

    // i가 잡아먹혀서 사라졌을 수도 있으므로 체크
    if (!fishes[i]) continue;

    // 거리 계산 (충돌 감지)
    if (!isSpectating) {
      const dist = Math.hypot(player.x - fishes[i].x, player.y - fishes[i].y);

      // 충돌 시
      if (dist < player.radius + fishes[i].radius - 5) {
        // 충돌 판정 약간 너그럽게
        if (player.radius > fishes[i].radius * 1.1) {
          // 먹는 판정 완화
          if (isMultiplayer) {
            if (!fishes[i].isBeingEaten) {
              fishes[i].isBeingEaten = true; // 중복 요청 방지
              socket.emit("iAteFish", {
                fishId: fishes[i].id,
                fishIsShiny: fishes[i].isShiny,
                x: fishes[i].x,
                y: fishes[i].y,
                radius: fishes[i].radius,
              });
            }
          } else {
            // 싱글플레이어 모드
            let points = 10;
            if (fishes[i].isShiny) points *= 2;
            if (player.isShiny) points *= 2;
            score += points;
            if (fishes[i].isShiny) {
              player.isShiny = true;
              player.shinyTimer = 1200; // 약 20초간 지속
            }
            player.radius += 0.5;
            // 시각 효과
            bones.push(new Bone(fishes[i].x, fishes[i].y, fishes[i].radius));
            if (Math.random() < 0.5)
              leftovers.push(new Leftover(fishes[i].x, fishes[i].y));
            fishes.splice(i, 1);
            i--;
          }
        } else if (fishes[i].radius > player.radius * 1.1) {
          // 먹힘: 게임 오버
          if (isMultiplayer) {
            socket.emit("playerDied");
            isSpectating = true; // 관전 모드 전환
          } else {
            isGameOver = true;
            handleGameOver();
          }
        }
      }
    }
  }

  // 게임 오버 처리 로직
  function handleGameOver() {
    bgm.pause();
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem(
        `fish_best_score_${currentDifficultyKey}`,
        bestScore,
      );
    }
    finalScoreElement.innerText = score;
    gameOverElement.classList.remove("hidden");
  }

  // 점수 및 남은 시간 표시 업데이트
  let displayBestScore = bestScore;

  if (score > bestScore) {
    displayBestScore = score;
  }

  let scoreText = `Score: ${score} | Best: ${displayBestScore} (${currentDifficulty})`;
  if (player.isShiny) {
    scoreText += ` | ✨ ${(player.shinyTimer / 60).toFixed(1)}s`;
  }
  scoreElement.innerText = scoreText;

  gameFrame++;
  if (!isGameOver && !isPaused) requestAnimationFrame(animate);
}

restartBtn.addEventListener("click", () => {
  // 게임 오버 화면과 UI 레이어, 캔버스를 숨깁니다.
  gameOverElement.classList.add("hidden");
  uiLayer.classList.add("hidden");
  canvas.classList.add("hidden");
  // 시작 화면을 다시 보여줍니다.
  bgm.pause();
  bgm.currentTime = 0;
  startScreen.style.display = "flex";

  // 소켓 연결 종료
  if (socket) {
    socket.disconnect();
  }
});

homeBtn.addEventListener("click", () => {
  isGameOver = true; // 게임 루프 중지
  gameOverElement.classList.add("hidden"); // 혹시 떠있을 게임 오버 화면 숨김
  uiLayer.classList.add("hidden"); // UI 숨김
  canvas.classList.add("hidden"); // 캔버스 숨김
  bgm.pause();
  bgm.currentTime = 0;
  startScreen.style.display = "flex"; // 시작 화면 표시

  // 소켓 연결 종료
  if (socket) {
    socket.disconnect();
  }
});

function togglePause() {
  if (isGameOver || uiLayer.classList.contains("hidden")) return;

  isPaused = !isPaused;
  if (isPaused) {
    bgm.pause();
    pauseBtn.innerText = "▶️ 재개";
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "40px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("일시정지", canvas.width / 2, canvas.height / 2);
    ctx.restore();
  } else {
    if (soundToggle.checked) {
      bgm.play().catch((e) => console.log("BGM 재생 실패:", e));
    }
    pauseBtn.innerText = "⏸️ 일시정지";
    animate();
  }
}

pauseBtn.addEventListener("click", togglePause);
window.addEventListener("keydown", (e) => {
  if (e.key === "p" || e.key === "P") togglePause();
});

// 설정 버튼 이벤트
settingsBtn.addEventListener("click", () => {
  settingsModal.style.display = "flex";
});

closeSettingsBtn.addEventListener("click", () => {
  settingsModal.style.display = "none";
});

// 난이도 변경 이벤트
difficultySelect.addEventListener("change", (e) => {
  const value = e.target.value;
  currentDifficultyKey = value;
  if (value === "easy") {
    spawnRate = 80; // 쉬움: 적이 천천히 나옴
    currentDifficulty = "쉬움";
  } else if (value === "normal") {
    spawnRate = 50; // 보통
    currentDifficulty = "보통";
  } else if (value === "hard") {
    spawnRate = 30; // 어려움: 적이 빨리 나옴
    currentDifficulty = "어려움";
  }
  bestScore =
    localStorage.getItem(`fish_best_score_${currentDifficultyKey}`) || 0;
});

// 소리 설정 변경 이벤트
soundToggle.addEventListener("change", () => {
  if (
    soundToggle.checked &&
    !isGameOver &&
    !isPaused &&
    startScreen.style.display === "none"
  ) {
    bgm.play().catch((e) => console.log("BGM 재생 실패:", e));
  } else {
    bgm.pause();
  }
});

// 캐릭터 선택 버튼 이벤트
charSelectBtn.addEventListener("click", () => {
  charSelectModal.style.display = "flex";
});

closeCharBtn.addEventListener("click", () => {
  charSelectModal.style.display = "none";
});

// 캐릭터 선택 옵션 클릭 이벤트
charOptions.forEach((option) => {
  option.addEventListener("click", () => {
    // 선택된 스타일 변경
    charOptions.forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");

    // 캐릭터 이미지 변경
    const charType = option.getAttribute("data-char");
    if (charType === "fish-1") currentPlayerImage = playerImg;
    else if (charType === "fish-2") currentPlayerImage = enemyImg;
  });
});

function startGame(isMulti) {
  isMultiplayer = isMulti;
  startScreen.style.display = "none";
  multiplayerModal.style.display = "none";
  uiLayer.classList.remove("hidden");
  canvas.classList.remove("hidden");
  init();
}

singlePlayerBtn.addEventListener("click", () => {
  if (imagesLoaded === totalImages) {
    startGame(false);
  } else {
    alert("리소스 로딩 중입니다. 잠시만 기다려주세요.");
  }
});

multiPlayerBtn.addEventListener("click", () => {
  multiplayerModal.style.display = "flex";
});

closeMultiplayerBtn.addEventListener("click", () => {
  multiplayerModal.style.display = "none";
});

createRoomBtn.addEventListener("click", () => {
  if (imagesLoaded === totalImages) {
    connectToSocketAndStart("create");
  } else {
    alert("리소스 로딩 중입니다. 잠시만 기다려주세요.");
  }
});

joinRoomBtn.addEventListener("click", () => {
  const roomId = roomIdInput.value.trim().toUpperCase();
  if (!roomId) {
    alert("방 ID를 입력해주세요.");
    return;
  }
  if (imagesLoaded === totalImages) {
    connectToSocketAndStart("join", roomId);
  } else {
    alert("리소스 로딩 중입니다. 잠시만 기다려주세요.");
  }
});
