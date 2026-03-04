// 요소 선택
const attackInput = document.getElementById("attack");
const defenseInput = document.getElementById("defense");
const skillSelect = document.getElementById("skill");
const critInput = document.getElementById("crit");
const critDisplay = document.getElementById("crit-display");
const defenseCoeffInput = document.getElementById("defense-coeff");
const defenseCoeffDisplay = document.getElementById("defense-coeff-display");
const attackBtn = document.getElementById("attack-btn");
const logBox = document.getElementById("log-box");
const avgDamageDisplay = document.getElementById("avg-damage");

// 치명타 확률 슬라이더 값 표시 업데이트
critInput.addEventListener("input", () => {
  critDisplay.textContent = critInput.value;
  updateAverageDamage();
});

// 방어 계수 슬라이더 값 표시 업데이트
defenseCoeffInput.addEventListener("input", () => {
  defenseCoeffDisplay.textContent = Number(defenseCoeffInput.value).toFixed(2);
  updateAverageDamage();
});

// 입력값 변경 시 평균 데미지 실시간 업데이트
[attackInput, defenseInput, skillSelect].forEach((el) => {
  el.addEventListener("input", updateAverageDamage);
});

// 데미지 계산 함수 (로그 방어력 공식 적용)
function calculateDamage(isCrit = false) {
  const attack = Number(attackInput.value);
  const defense = Number(defenseInput.value);
  const skillCoeff = Number(skillSelect.value);
  const defenseCoeff = Number(defenseCoeffInput.value);

  // 로그 감소 공식: 방어력이 높을수록 데미지 감소율 증가폭이 줄어듦
  // 예: 방어력 10 -> 약 20% 감소, 방어력 100 -> 약 40% 감소
  // 공식: 데미지 = 공격력 * (1 - (log10(방어력 + 1) * 계수))
  const reductionRate = Math.min(0.9, Math.log10(defense + 1) * defenseCoeff); // 최대 90% 감소로 제한

  let damage = attack * skillCoeff * (1 - reductionRate);

  // 치명타 적용 (1.5배)
  if (isCrit) {
    damage *= 1.5;
  }

  return Math.max(1, Math.floor(damage)); // 최소 데미지 1
}

// 평균 데미지 계산 및 표시
function updateAverageDamage() {
  const critRate = Number(critInput.value) / 100;
  const normalDmg = calculateDamage(false);
  const critDmg = calculateDamage(true);

  const avgDmg = Math.floor(normalDmg * (1 - critRate) + critDmg * critRate);
  avgDamageDisplay.textContent = avgDmg.toLocaleString();
}

// 공격 버튼 클릭 이벤트
attackBtn.addEventListener("click", () => {
  // 데미지 계산을 먼저 수행하여 치명타 여부 확인
  const critRate = Number(critInput.value);
  const isCrit = Math.random() * 100 < critRate;
  const damage = calculateDamage(isCrit);

  // 치명타 여부에 따라 다른 애니메이션 클래스 적용
  const shakeClass = isCrit ? "shake-strong" : "shake-weak";
  document.body.classList.add(shakeClass);
  document.body.addEventListener(
    "animationend",
    () => {
      document.body.classList.remove(shakeClass);
    },
    { once: true },
  ); // 딱 한 번만 실행

  // 로그 업데이트
  const logEntry = document.createElement("div");
  logEntry.className = `log-entry ${isCrit ? "critical" : ""}`;
  logEntry.innerHTML = `${isCrit ? "⚡치명타!" : "⚔️공격"} 데미지: <strong>${damage}</strong> (방어력 ${defenseInput.value} 적용)`;

  logBox.prepend(logEntry); // 최신 로그가 위로 오게
});

// 초기화
updateAverageDamage();
