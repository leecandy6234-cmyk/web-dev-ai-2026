let computerNum = 0;
let chances = 5;
let maxRange = 100;
let gameOver = false;
let history = [];
let currentLevel = "normal";

const guessInput = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");
const resultArea = document.getElementById("result-area");
const chanceArea = document.getElementById("chance-area");
const resetBtn = document.getElementById("reset-btn");
const difficultyBtns = document.querySelectorAll(".difficulty-btn");
const instructionText = document.getElementById("instruction-text");
const hintBtn = document.getElementById("hint-btn");

guessBtn.addEventListener("click", play);
resetBtn.addEventListener("click", reset);
hintBtn.addEventListener("click", giveHint);
guessInput.addEventListener("focus", () => {
  guessInput.value = "";
});

function giveHint() {
  if (gameOver) return;
  const hint = computerNum % 2 === 0 ? "짝수" : "홀수";
  resultArea.textContent = `힌트: 정답은 ${hint}입니다!`;
  hintBtn.disabled = true;
  hintBtn.style.backgroundColor = "#7f8c8d";
}

difficultyBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    difficultyBtns.forEach((b) => b.classList.remove("active"));
    event.target.classList.add("active");
    currentLevel = event.target.dataset.level;
    reset();
  });
});

function pickRandomNum() {
  computerNum = Math.floor(Math.random() * maxRange) + 1;
  console.log("정답:", computerNum);
}

function setGameByLevel() {
  if (currentLevel === "easy") {
    maxRange = 50;
    chances = 8;
  } else if (currentLevel === "normal") {
    maxRange = 100;
    chances = 5;
  } else if (currentLevel === "hard") {
    maxRange = 200;
    chances = 5;
  }
  instructionText.textContent = `1부터 ${maxRange}까지의 숫자 중 하나를 맞춰보세요!`;
  guessInput.max = maxRange;
  chanceArea.textContent = chances;
  pickRandomNum();
}

function play() {
  if (gameOver) return;

  const userValue = parseInt(guessInput.value);

  if (userValue < 1 || userValue > maxRange || isNaN(userValue)) {
    resultArea.textContent = `1과 ${maxRange} 사이의 숫자를 입력해주세요.`;
    return;
  }

  if (history.includes(userValue)) {
    resultArea.textContent = "이미 추측한 숫자입니다. 다른 숫자를 입력하세요.";
    return;
  }

  chances--;
  chanceArea.textContent = chances;
  history.push(userValue);

  if (userValue < computerNum) {
    resultArea.textContent = "UP!!!";
    resultArea.className = ""; // 클래스 초기화
    void resultArea.offsetWidth; // 리플로우 강제 (애니메이션 재실행을 위해)
    resultArea.classList.add("animate-up");
  } else if (userValue > computerNum) {
    resultArea.textContent = "DOWN!!!";
    resultArea.className = ""; // 클래스 초기화
    void resultArea.offsetWidth; // 리플로우 강제
    resultArea.classList.add("animate-down");
  } else {
    resultArea.textContent = "🎉 정답입니다! 🎉";
    resultArea.className = ""; // 정답일 때는 애니메이션 클래스 제거
    gameOver = true;
    showClearEffect();
  }

  if (chances < 1 && !gameOver) {
    resultArea.textContent = `실패! 정답은 ${computerNum}였습니다.`;
    gameOver = true;
  }

  if (gameOver) {
    guessBtn.disabled = true;
    resetBtn.style.display = "block";
  }
}

function reset() {
  setGameByLevel();
  gameOver = false;
  history = [];
  resultArea.textContent = "결과가 여기에 표시됩니다.";
  resultArea.className = ""; // 리셋 시 클래스 초기화
  chanceArea.textContent = chances;
  guessBtn.disabled = false;
  resetBtn.style.display = "none";
  hintBtn.disabled = false;
  hintBtn.style.backgroundColor = "#f39c12";
  guessInput.value = "";

  // 클리어 효과 제거
  const effectContainer = document.getElementById("clear-effect-container");
  if (effectContainer) {
    effectContainer.innerHTML = "";
    effectContainer.style.display = "none";
  }
}

setGameByLevel();

function showClearEffect() {
  const effectContainer = document.getElementById("clear-effect-container");
  effectContainer.style.display = "block";

  // 간단한 폭죽 효과 (DOM 요소 생성)
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.classList.add("confetti");

    // 랜덤 위치, 색상, 애니메이션 설정
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.top = -10 + "px";
    particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    particle.style.animationDuration = Math.random() * 3 + 2 + "s";
    particle.style.animationDelay = Math.random() * 2 + "s";

    effectContainer.appendChild(particle);
  }
}
