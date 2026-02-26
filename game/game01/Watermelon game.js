// Matter.js 모듈 초기화
const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Events = Matter.Events,
  World = Matter.World;

// 과일 데이터 정의 (반지름, 색상)
const FRUITS = [
  { radius: 15, color: "#e53935", label: "0", name: "체리" },
  { radius: 25, color: "#ff5252", label: "1", name: "딸기" },
  { radius: 35, color: "#9c27b0", label: "2", name: "포도" },
  { radius: 45, color: "#ff9800", label: "3", name: "한라봉" },
  { radius: 55, color: "#FFA500", label: "4", name: "오렌지" },
  { radius: 65, color: "#ff1744", label: "5", name: "사과" },
  { radius: 75, color: "#cddc39", label: "6", name: "배" },
  { radius: 85, color: "#f48fb1", label: "7", name: "복숭아" },
  { radius: 95, color: "#fdd835", label: "8", name: "파인애플" },
  { radius: 105, color: "#4caf50", label: "9", name: "멜론" },
  { radius: 120, color: "#1b5e20", label: "10", name: "수박" },
];

const THEME_FRUIT_COLORS = {
  default: [
    "#e53935",
    "#ff5252",
    "#9c27b0",
    "#ff9800",
    "#FFA500",
    "#ff1744",
    "#cddc39",
    "#f48fb1",
    "#fdd835",
    "#4caf50",
    "#1b5e20",
  ],
  dark: [
    "#FF5252",
    "#FF4081",
    "#E040FB",
    "#7C4DFF",
    "#536DFE",
    "#448AFF",
    "#40C4FF",
    "#18FFFF",
    "#64FFDA",
    "#69F0AE",
    "#B2FF59",
  ],
  ocean: [
    "#ff9ff3",
    "#feca57",
    "#ff6b6b",
    "#48dbfb",
    "#1dd1a1",
    "#5f27cd",
    "#54a0ff",
    "#00d2d3",
    "#2e86de",
    "#341f97",
    "#8395a7",
  ],
  fruit: [
    "#e53935",
    "#ff5252",
    "#9c27b0",
    "#ff9800",
    "#FFA500",
    "#ff1744",
    "#cddc39",
    "#f48fb1",
    "#fdd835",
    "#4caf50",
    "#1b5e20",
  ],
};

// 엔진 생성
const engine = Engine.create();
const world = engine.world;

// 렌더러 생성
const render = Render.create({
  element: document.getElementById("game-container"),
  engine: engine,
  options: {
    width: 600,
    height: 800,
    wireframes: false, // 와이어프레임 끄기 (색상 표시)
    background: "#F7F4C8",
  },
});

// 벽 생성 (바닥, 왼쪽, 오른쪽)
const ground = Bodies.rectangle(300, 810, 620, 60, {
  isStatic: true,
  label: "ground",
  render: { fillStyle: "#E6B143" },
});
const leftWall = Bodies.rectangle(-10, 400, 60, 800, {
  isStatic: true,
  label: "wall",
  render: { fillStyle: "#E6B143" },
});
const rightWall = Bodies.rectangle(610, 400, 60, 800, {
  isStatic: true,
  label: "wall",
  render: { fillStyle: "#E6B143" },
});

World.add(world, [ground, leftWall, rightWall]);

// 게임 실행
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// 과일 표정 그리기 (렌더링 후 처리)
Events.on(render, "afterRender", () => {
  const ctx = render.context;
  const bodies = Composite.allBodies(engine.world);

  bodies.forEach((body) => {
    if (body.label && !isNaN(parseInt(body.label))) {
      const { x, y } = body.position;
      const r = body.circleRadius;
      const angle = body.angle;
      const index = parseInt(body.label);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      const isDark = document.body.classList.contains("theme-dark");
      const isOcean = document.body.classList.contains("theme-ocean");
      const isFruit = document.body.classList.contains("theme-fruit");

      // 리얼 과일 테마일 때 과일 무늬 그리기
      if (isFruit) {
        const color = FRUITS[index].color;
        if (window.ThemeFruit) window.ThemeFruit.draw(ctx, r, index, color);
      }

      if (isDark) {
        if (window.ThemeDark) window.ThemeDark.draw(ctx, r, index);
      } else if (isOcean) {
        if (window.ThemeOcean) window.ThemeOcean.draw(ctx, r, index);
      } else {
        // 기본 표정 (4가지 패턴)
        const type = index % 4;

        ctx.fillStyle = "white";
        ctx.beginPath();

        if (type === 0) {
          // 1. 기본 스마일
          ctx.arc(-r * 0.25, -r * 0.1, r * 0.15, 0, Math.PI * 2);
          ctx.arc(r * 0.25, -r * 0.1, r * 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#333";
          ctx.beginPath();
          ctx.arc(-r * 0.25, -r * 0.1, r * 0.05, 0, Math.PI * 2);
          ctx.arc(r * 0.25, -r * 0.1, r * 0.05, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.2, 0.2 * Math.PI, 0.8 * Math.PI);
          ctx.strokeStyle = "#333";
          ctx.lineWidth = Math.max(2, r * 0.05);
          ctx.lineCap = "round";
          ctx.stroke();
        } else if (type === 1) {
          // 2. 윙크
          ctx.arc(-r * 0.25, -r * 0.1, r * 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#333";
          ctx.beginPath();
          ctx.arc(-r * 0.25, -r * 0.1, r * 0.05, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath(); // 오른쪽 윙크
          ctx.moveTo(r * 0.1, -r * 0.1);
          ctx.lineTo(r * 0.4, -r * 0.1);
          ctx.strokeStyle = "#333";
          ctx.lineWidth = Math.max(2, r * 0.05);
          ctx.lineCap = "round";
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.2, 0.1 * Math.PI, 0.9 * Math.PI);
          ctx.stroke();
        } else if (type === 2) {
          // 3. 웃는 눈 (^ ^)
          ctx.strokeStyle = "#333";
          ctx.lineWidth = Math.max(2, r * 0.05);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(-r * 0.35, -r * 0.05);
          ctx.lineTo(-r * 0.25, -r * 0.15);
          ctx.lineTo(-r * 0.15, -r * 0.05);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(r * 0.15, -r * 0.05);
          ctx.lineTo(r * 0.25, -r * 0.15);
          ctx.lineTo(r * 0.35, -r * 0.05);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.2, 0.2 * Math.PI, 0.8 * Math.PI);
          ctx.stroke();
        } else {
          // 4. 놀란 입 (O)
          ctx.arc(-r * 0.25, -r * 0.1, r * 0.15, 0, Math.PI * 2);
          ctx.arc(r * 0.25, -r * 0.1, r * 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#333";
          ctx.beginPath();
          ctx.arc(-r * 0.25, -r * 0.1, r * 0.05, 0, Math.PI * 2);
          ctx.arc(r * 0.25, -r * 0.1, r * 0.05, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(0, r * 0.15, r * 0.1, r * 0.12, 0, 0, Math.PI * 2);
          ctx.fillStyle = "#333";
          ctx.fill();
        }

        // 볼터치
        ctx.fillStyle = "rgba(255, 100, 100, 0.4)";
        ctx.beginPath();
        ctx.arc(-r * 0.4, r * 0.1, r * 0.12, 0, Math.PI * 2);
        ctx.arc(r * 0.4, r * 0.1, r * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  });
});

let currentFruit = null;
let isClickable = true;
let score = 0;
let bestScore = localStorage.getItem("watermelon_best_score") || 0;
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("best-score");
bestScoreElement.textContent = bestScore;
let nextFruitIndex = Math.floor(Math.random() * 5);
const bounceSound = new Audio("./bounce.mp3");
const bgm = new Audio("./bgm.mp3");
bgm.loop = true;
bgm.volume = 0.5;

let gameOver = false;
let isNewRecord = false;

// 과일 생성 함수
function createFruit(x, y, index) {
  const fruit = FRUITS[index];
  const isFruitTheme = document.body.classList.contains("theme-fruit");
  return Bodies.circle(x, y, fruit.radius, {
    label: index.toString(),
    restitution: 0.2, // 탄성
    render: { fillStyle: isFruitTheme ? "transparent" : fruit.color },
  });
}

// 파티클 효과 생성 함수
function createParticleEffect(x, y, color, radius) {
  const particleCount = Math.floor(5 + radius / 5); // 크기가 클수록 파티클 개수 증가
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const particle = Bodies.circle(x, y, Math.random() * 4 + 2, {
      render: { fillStyle: color },
      isSensor: true, // 충돌 감지 안함 (물리적 영향 없음)
      frictionAir: 0.05,
    });

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (2 + radius / 10) + 2; // 크기가 클수록 더 멀리 튐
    Matter.Body.setVelocity(particle, {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    });

    particles.push(particle);
  }

  World.add(world, particles);

  setTimeout(() => {
    World.remove(world, particles);
  }, 500);
}

// 대기 중인 과일 생성 (상단)
function addCurrentFruit() {
  const index = nextFruitIndex;
  const fruit = FRUITS[index];
  const isFruitTheme = document.body.classList.contains("theme-fruit");
  currentFruit = Bodies.circle(300, 50, fruit.radius, {
    label: index.toString(),
    isStatic: true, // 떨어지기 전에는 고정
    isSensor: true, // 충돌 감지 안함
    render: { fillStyle: isFruitTheme ? "transparent" : fruit.color },
  });
  World.add(world, currentFruit);

  // 다음 과일 결정 및 표시
  nextFruitIndex = Math.floor(Math.random() * 5);
  const nextFruit = FRUITS[nextFruitIndex];
  const display = document.getElementById("next-fruit-display");
  display.style.width = `${nextFruit.radius * 2 * 0.8}px`; // 0.8배 크기로 표시
  display.style.height = `${nextFruit.radius * 2 * 0.8}px`;
  display.style.backgroundColor = nextFruit.color;
  display.style.borderRadius = "50%";
}

addCurrentFruit();

// 마우스 이벤트 처리
const container = document.getElementById("game-container");

container.addEventListener("mousemove", (e) => {
  if (currentFruit && isClickable) {
    const rect = render.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    // 벽 밖으로 나가지 않게 제한
    const radius = currentFruit.circleRadius;
    x = Math.max(radius + 10, Math.min(x, 600 - radius - 10));
    Matter.Body.setPosition(currentFruit, { x: x, y: 50 });
  }
});

function dropFruit() {
  if (!isClickable || !currentFruit || gameOver) return;

  isClickable = false;
  const fruit = currentFruit;
  fruit.isSensor = false; // 충돌 감지 켜기
  Matter.Body.setStatic(fruit, false); // 물리 적용 시작 (떨어짐)
  fruit.isFalling = true; // 떨어지는 중임을 표시 (게임 오버 체크 제외용)

  currentFruit = null;

  // 1초 뒤에 다음 과일 생성
  setTimeout(() => {
    addCurrentFruit();
    isClickable = true;
  }, 500);
}

container.addEventListener("click", dropFruit);

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault(); // 스페이스바 스크롤 방지
    dropFruit();
  }
});

// 충돌 이벤트 처리 (합치기 로직)
Events.on(engine, "collisionStart", (event) => {
  const pairs = event.pairs;
  let playSound = false;

  pairs.forEach((pair) => {
    // 센서(대기 중인 과일)와의 충돌은 무시
    if (pair.bodyA.isSensor || pair.bodyB.isSensor) return;

    if (pair.bodyA.isFalling) {
      if (pair.bodyB.label !== "wall") pair.bodyA.isFalling = false;
    }
    if (pair.bodyB.isFalling) {
      if (pair.bodyA.label !== "wall") pair.bodyB.isFalling = false;
    }
    if (!pair.bodyA.isSensor && !pair.bodyB.isSensor) playSound = true;
  });

  if (playSound) {
    const sound = bounceSound.cloneNode();
    sound.volume = 0.3;
    sound.play().catch(() => {});
  }

  for (let i = 0; i < pairs.length; i++) {
    const bodyA = pairs[i].bodyA;
    const bodyB = pairs[i].bodyB;

    // 같은 종류의 과일이 충돌했을 때
    if (bodyA.label === bodyB.label) {
      const index = parseInt(bodyA.label);

      // 수박(마지막 단계)이면 합쳐지지 않음
      if (index === FRUITS.length - 1) continue;

      // 충돌한 두 과일 제거
      World.remove(world, [bodyA, bodyB]);

      // 두 과일의 중간 위치에서 다음 단계 과일 생성
      const newX = (bodyA.position.x + bodyB.position.x) / 2;
      const newY = (bodyA.position.y + bodyB.position.y) / 2;

      const newFruit = createFruit(newX, newY, index + 1);
      World.add(world, newFruit);

      // 파티클 효과 실행 (새 과일 생성 후 실행하여 위에 표시)
      createParticleEffect(
        newX,
        newY,
        FRUITS[index].color,
        FRUITS[index].radius,
      );

      // 합쳐질 때 소리 재생 (크기에 따라 볼륨 증가)
      const sound = bounceSound.cloneNode();
      sound.volume = Math.min(1, 0.3 + index * 0.06); // 0.3 ~ 0.9까지 커짐
      sound.play().catch(() => {});

      // 점수 증가
      score += (index + 1) * 10;
      scoreElement.textContent = score;

      if (score > bestScore) {
        bestScore = score;
        bestScoreElement.textContent = bestScore;
        localStorage.setItem("watermelon_best_score", bestScore);
        isNewRecord = true;
      }
    }
  }
});

// 범례 그리기 함수
function drawLegend() {
  const legendCircles = document.querySelectorAll(".legend-circle");
  const isDark = document.body.classList.contains("theme-dark");
  const isOcean = document.body.classList.contains("theme-ocean");
  const isFruit = document.body.classList.contains("theme-fruit");

  legendCircles.forEach((canvas, index) => {
    const ctx = canvas.getContext("2d");
    const r = 15; // 범례 아이콘 반지름
    const fruit = FRUITS[index];

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    if (isFruit && window.ThemeFruit) {
      // 리얼 과일 테마
      window.ThemeFruit.draw(ctx, r, index, fruit.color);
    } else {
      // 기본 원형 그리기 (다크, 오션, 기본 테마)
      ctx.fillStyle = fruit.color;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      if (isDark && window.ThemeDark) {
        window.ThemeDark.draw(ctx, r, index);
      } else if (isOcean && window.ThemeOcean) {
        window.ThemeOcean.draw(ctx, r, index);
      } else {
        // 기본 표정
        const type = index % 4;
        ctx.fillStyle = "white";
        ctx.beginPath();

        if (type === 0) {
          ctx.arc(-r * 0.25, -r * 0.1, r * 0.15, 0, Math.PI * 2);
          ctx.arc(r * 0.25, -r * 0.1, r * 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#333";
          ctx.beginPath();
          ctx.arc(-r * 0.25, -r * 0.1, r * 0.05, 0, Math.PI * 2);
          ctx.arc(r * 0.25, -r * 0.1, r * 0.05, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.2, 0.2 * Math.PI, 0.8 * Math.PI);
          ctx.strokeStyle = "#333";
          ctx.lineWidth = Math.max(2, r * 0.05);
          ctx.lineCap = "round";
          ctx.stroke();
        } else if (type === 1) {
          ctx.arc(-r * 0.25, -r * 0.1, r * 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#333";
          ctx.beginPath();
          ctx.arc(-r * 0.25, -r * 0.1, r * 0.05, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(r * 0.1, -r * 0.1);
          ctx.lineTo(r * 0.4, -r * 0.1);
          ctx.strokeStyle = "#333";
          ctx.lineWidth = Math.max(2, r * 0.05);
          ctx.lineCap = "round";
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.2, 0.1 * Math.PI, 0.9 * Math.PI);
          ctx.stroke();
        } else {
          // 나머지 표정 생략 (기본 스마일로 대체하거나 추가 가능)
          ctx.arc(-r * 0.25, -r * 0.1, r * 0.15, 0, Math.PI * 2);
          ctx.arc(r * 0.25, -r * 0.1, r * 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#333";
          ctx.beginPath();
          ctx.arc(-r * 0.25, -r * 0.1, r * 0.05, 0, Math.PI * 2);
          ctx.arc(r * 0.25, -r * 0.1, r * 0.05, 0, Math.PI * 2);
          ctx.fill();
        }
        // 볼터치
        ctx.fillStyle = "rgba(255, 100, 100, 0.4)";
        ctx.beginPath();
        ctx.arc(-r * 0.4, r * 0.1, r * 0.12, 0, Math.PI * 2);
        ctx.arc(r * 0.4, r * 0.1, r * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  });
}

// 과일 범례 생성
const legend = document.getElementById("fruit-legend");
if (legend) {
  FRUITS.forEach((fruit) => {
    const item = document.createElement("div");
    item.className = "legend-item";

    const circle = document.createElement("canvas");
    circle.className = "legend-circle";
    circle.width = 40;
    circle.height = 40;

    const label = document.createElement("span");
    label.className = "legend-label";
    label.textContent = fruit.name;

    item.appendChild(circle);
    item.appendChild(label);
    legend.appendChild(item);
  });
  drawLegend(); // 초기 그리기
}

// 게임 재시작 함수
function restartGame() {
  // 모든 과일 제거 (정적 바디인 벽과 바닥은 제외하고 label이 숫자인 과일만 제거)
  const bodies = Composite.allBodies(world);
  bodies.forEach((body) => {
    if (body.label && !isNaN(parseInt(body.label))) {
      World.remove(world, body);
    }
  });

  // 점수 및 상태 초기화
  score = 0;
  scoreElement.textContent = score;
  gameOver = false;
  isNewRecord = false;
  isClickable = true;
  currentFruit = null;
  nextFruitIndex = Math.floor(Math.random() * 5); // 다음 과일 초기화

  document.getElementById("game-over").style.display = "none";
  document.getElementById("new-record-msg").style.display = "none";

  // 게임 엔진 다시 시작 (멈췄던 경우)
  Runner.run(runner, engine);

  // 첫 과일 생성
  addCurrentFruit();
}

// BGM 버튼 이벤트 처리
const bgmBtn = document.getElementById("bgm-btn");
let isBgmPlaying = false;

bgmBtn.addEventListener("click", () => {
  if (isBgmPlaying) {
    bgm.pause();
    bgmBtn.textContent = "🎵 BGM: OFF";
    bgmBtn.classList.remove("active");
  } else {
    bgm.play().catch((e) => console.log("BGM 재생 실패:", e));
    bgmBtn.textContent = "🎵 BGM: ON";
    bgmBtn.classList.add("active");
  }
  isBgmPlaying = !isBgmPlaying;
});

// 테마 변경 로직
const themeBtn = document.getElementById("theme-btn");
const themes = ["default", "dark", "ocean", "fruit"];
const themeNames = {
  default: "기본",
  dark: "다크",
  ocean: "오션",
  fruit: "리얼",
};
let currentThemeIndex = 0;

themeBtn.addEventListener("click", () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  const newTheme = themes[currentThemeIndex];

  // Body 클래스 변경
  document.body.className = "";
  if (newTheme !== "default") {
    document.body.classList.add(`theme-${newTheme}`);
  }

  themeBtn.textContent = `🎨 테마: ${themeNames[newTheme]}`;

  // 과일 색상 변경
  const newColors = THEME_FRUIT_COLORS[newTheme];
  FRUITS.forEach((fruit, index) => {
    fruit.color = newColors[index];
  });

  // 기존에 생성된 과일 색상 업데이트
  const bodies = Composite.allBodies(world);
  bodies.forEach((body) => {
    if (body.label && !isNaN(parseInt(body.label))) {
      const index = parseInt(body.label);
      if (newTheme === "fruit") {
        body.render.fillStyle = "transparent";
      } else {
        body.render.fillStyle = newColors[index];
      }
    }
  });

  // 범례 업데이트 (모양 및 표정 다시 그리기)
  drawLegend();

  // 다음 과일 표시 업데이트
  const nextDisplay = document.getElementById("next-fruit-display");
  if (nextDisplay) {
    nextDisplay.style.backgroundColor = FRUITS[nextFruitIndex].color;
  }

  // Matter.js 렌더링 스타일 업데이트
  // CSS 변수 값을 가져와서 적용
  setTimeout(() => {
    const styles = getComputedStyle(document.body);
    const gameBg = styles.getPropertyValue("--game-bg").trim();
    const wallColor = styles.getPropertyValue("--wall-color").trim();

    render.options.background = gameBg;
    ground.render.fillStyle = wallColor;
    leftWall.render.fillStyle = wallColor;
    rightWall.render.fillStyle = wallColor;
  }, 0);
});

// 기록 초기화 버튼 이벤트 처리
const resetRecordBtn = document.getElementById("reset-record-btn");
resetRecordBtn.addEventListener("click", () => {
  localStorage.removeItem("watermelon_best_score");
  bestScore = 0;
  bestScoreElement.textContent = bestScore;
});

document.getElementById("restart-btn").addEventListener("click", restartGame);
document
  .getElementById("restart-btn-over")
  .addEventListener("click", restartGame);

// 게임 오버 체크 (매 프레임 업데이트 후 실행)
Events.on(engine, "afterUpdate", () => {
  if (gameOver) return;

  const bodies = Composite.allBodies(world);

  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i];

    // 과일이면서(label이 숫자), 고정된 상태가 아니고(떨어뜨리기 전 대기 상태 제외), 떨어지는 중이 아닐 때
    if (
      body.label &&
      !isNaN(parseInt(body.label)) &&
      !body.isStatic &&
      !body.isFalling
    ) {
      // y좌표가 150보다 작으면(위쪽이면) 게임 오버
      if (body.position.y < 150) {
        gameOver = true;
        document.getElementById("game-over").style.display = "flex";
        if (isNewRecord) {
          document.getElementById("new-record-msg").style.display = "block";
        }
        Runner.stop(runner); // 게임 엔진 정지
        break;
      }
    }
  }
});
