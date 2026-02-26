const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("game-over");
const finalScoreElement = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

// 이미지 로드 설정
const playerImg = new Image();
const enemyImg = new Image();
const boneImg = new Image();
const leftover1Img = new Image();
const leftover2Img = new Image();

let imagesLoaded = 0;
const totalImages = 5;

function handleImageLoad() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    init(); // 모든 이미지가 로드되면 게임 시작
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
let bestScore = localStorage.getItem("fish_best_score") || 0;
let animationId;

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
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;

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
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.isShiny) {
      ctx.shadowBlur = 20 + Math.sin(gameFrame * 0.1) * 10; // 반짝이는 효과 (맥동)
      ctx.shadowColor = "gold";
    }
    // 마우스가 왼쪽에 있으면 물고기도 왼쪽을 보게 뒤집음
    if (mouse.x > this.x) {
      ctx.scale(-1, 1);
    }

    // 플레이어 이미지 그리기
    ctx.drawImage(
      playerImg,
      -this.radius,
      -this.radius,
      this.radius * 2,
      this.radius * 2,
    );

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
  }

  update() {
    let closestThreat = null;
    let closestPrey = null;
    let minThreatDist = 200; // 위협 감지 범위
    let minPreyDist = 150; // 먹이 감지 범위

    // 1. 플레이어 확인
    const distPlayer = Math.hypot(this.x - player.x, this.y - player.y);
    if (this.radius < player.radius) {
      // 플레이어가 더 크면 위협
      if (distPlayer < minThreatDist) {
        closestThreat = player;
        minThreatDist = distPlayer;
      }
    } else {
      // 플레이어가 더 작으면 먹이
      if (distPlayer < minPreyDist) {
        closestPrey = player;
        minPreyDist = distPlayer;
      }
    }

    // 2. 다른 물고기 확인
    for (const other of fishes) {
      if (other === this) continue;
      const dist = Math.hypot(this.x - other.x, this.y - other.y);
      if (this.radius < other.radius) {
        // 상대가 더 크면 위협
        if (dist < minThreatDist) {
          closestThreat = other;
          minThreatDist = dist;
        }
      } else {
        // 상대가 더 작으면 먹이
        if (dist < minPreyDist) {
          closestPrey = other;
          minPreyDist = dist;
        }
      }
    }

    // 행동 결정
    if (closestThreat) {
      // 위협이 있으면 도망
      const angle = Math.atan2(
        this.y - closestThreat.y,
        this.x - closestThreat.x,
      );
      this.dx = Math.cos(angle) * this.speed * 2; // 도망갈 때는 2배 속도
      this.dy = Math.sin(angle) * this.speed * 2;
      this.angle = angle;
    } else if (closestPrey) {
      // 위협이 없고 먹이가 있으면 추격
      const angle = Math.atan2(closestPrey.y - this.y, closestPrey.x - this.x);
      this.dx = Math.cos(angle) * this.speed * 1.5; // 추격할 때는 1.5배 속도
      this.dy = Math.sin(angle) * this.speed * 1.5;
      this.angle = angle;
    }

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
  player = new Player();
  fishes = [];
  bones = [];
  leftovers = [];
  score = 0;
  gameFrame = 0;
  isGameOver = false;
  scoreElement.innerText = `Score: 0 | Best: ${bestScore}`;
  gameOverElement.classList.add("hidden");
  animate();
}

function animate() {
  if (isGameOver) return;
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
      let points = leftovers[i].bonusScore;
      if (player.isShiny) points *= 2; // 반짝일 때 점수 2배
      score += points;
      player.radius += leftovers[i].bonusGrowth; // 찌꺼기 종류에 따른 크기 증가
      leftovers.splice(i, 1);
      i--;
      continue;
    }

    if (leftovers[i].alpha <= 0) {
      leftovers.splice(i, 1);
      i--;
    }
  }

  player.update();
  player.draw();

  // 50프레임마다 새로운 물고기 생성
  if (gameFrame % 50 === 0) {
    fishes.push(new Fish());
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
    const dist = Math.hypot(player.x - fishes[i].x, player.y - fishes[i].y);

    // 충돌 시
    if (dist < player.radius + fishes[i].radius) {
      if (player.radius > fishes[i].radius * 1.5) {
        // 먹음: 점수 증가, 크기 증가, 해당 물고기 삭제
        bones.push(new Bone(fishes[i].x, fishes[i].y, fishes[i].radius));
        if (Math.random() < 0.5)
          leftovers.push(new Leftover(fishes[i].x, fishes[i].y));
        let points = 10;
        if (fishes[i].isShiny) points *= 2; // 반짝이는 물고기는 점수 2배
        if (player.isShiny) points *= 2; // 플레이어가 반짝일 때 점수 2배
        score += points;
        if (fishes[i].isShiny) {
          player.isShiny = true;
          player.shinyTimer = 1200; // 약 20초간 지속
        }
        player.radius += 0.5;
        fishes.splice(i, 1);
        i--;
      } else if (fishes[i].radius > player.radius * 1.5) {
        // 먹힘: 게임 오버
        isGameOver = true;
        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem("fish_best_score", bestScore);
        }
        finalScoreElement.innerText = score;
        gameOverElement.classList.remove("hidden");
      }
    }
  }

  // 점수 및 남은 시간 표시 업데이트
  let scoreText = `Score: ${score} | Best: ${Math.max(score, bestScore)}`;
  if (player.isShiny) {
    scoreText += ` | ✨ ${(player.shinyTimer / 60).toFixed(1)}s`;
  }
  scoreElement.innerText = scoreText;

  gameFrame++;
  if (!isGameOver) requestAnimationFrame(animate);
}

restartBtn.addEventListener("click", init);
if (!isGameOver) requestAnimationFrame(animate);

restartBtn.addEventListener("click", init);
