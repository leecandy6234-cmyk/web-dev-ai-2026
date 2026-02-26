const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 캔버스 크기 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 게임 상태 변수
const player = {
  x: 100,
  y: window.innerHeight - 100,
  vx: 0,
  vy: 0,
  radius: 25,
  color: "#e74c3c", // 항아리 색상
};

const hammer = {
  angle: 0,
  length: 80,
  width: 12,
  headRadius: 20, // 판정 범위 확대 (잘 걸리게)
  color: "#333",
};

// 카메라 변수
const camera = { x: 0, y: 0 };

// 지형 (플랫폼)
const platforms = [
  { x: -100, y: -2000, w: 120, h: window.innerHeight + 2000 }, // 왼쪽 벽 (두껍게: -100~20)
  { x: window.innerWidth - 20, y: -2000, w: 120, h: window.innerHeight + 2000 }, // 오른쪽 벽 (두껍게)
  { x: 0, y: window.innerHeight - 20, w: window.innerWidth, h: 200 }, // 바닥 (두껍게)

  // 1단계: 계단
  { x: 200, y: window.innerHeight - 150, w: 150, h: 20 },
  { x: 500, y: window.innerHeight - 300, w: 150, h: 20 },

  // 2단계: 좁은 통로와 장애물
  { x: 200, y: window.innerHeight - 450, w: 20, h: 150 }, // 수직 장애물
  { x: 200, y: window.innerHeight - 450, w: 200, h: 20 }, // 발판

  // 3단계: 공중 징검다리
  { x: 600, y: window.innerHeight - 600, w: 100, h: 20 },
  { x: 300, y: window.innerHeight - 750, w: 100, h: 20 },
  { x: 100, y: window.innerHeight - 900, w: 100, h: 20 },

  // 4단계: 굴뚝 구간 (수직 등반)
  { x: 400, y: window.innerHeight - 1300, w: 20, h: 300 }, // 굴뚝 왼쪽 벽
  { x: 600, y: window.innerHeight - 1300, w: 20, h: 300 }, // 굴뚝 오른쪽 벽
  { x: 420, y: window.innerHeight - 1100, w: 50, h: 20 }, // 굴뚝 내부 발판

  // 5단계: 정상
  { x: 200, y: window.innerHeight - 1500, w: 300, h: 20 },
];

const goal = {
  x: 300,
  y: window.innerHeight - 1580, // 플랫폼 위에 딱 맞게 조정
  w: 50,
  h: 80,
  reached: false,
};

const mouse = { x: 0, y: 0 };

// 이벤트 리스너
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  platforms[0].h = window.innerHeight + 2000;
  platforms[1].x = window.innerWidth - 20;
  platforms[1].h = window.innerHeight + 2000;
  platforms[2].y = window.innerHeight - 20;
  platforms[2].w = window.innerWidth;
});

function update() {
  // 물리 상수
  const gravity = 0.6;
  const friction = 0.95;
  const bounce = 0.3;

  // 1. 중력 적용
  player.vy += gravity;

  // 속도 제한 (터널링 방지)
  const maxSpeed = 20;
  player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, player.vx));
  player.vy = Math.max(-maxSpeed, Math.min(maxSpeed, player.vy));

  // 카메라 위치 업데이트 (플레이어를 따라다님)
  let targetCameraY = canvas.height * 0.7 - player.y;
  if (targetCameraY < 0) targetCameraY = 0;
  camera.y += (targetCameraY - camera.y) * 0.1;

  // 2. 망치 각도 계산 (카메라 보정 적용)
  const dx = mouse.x - player.x;
  const dy = mouse.y - (player.y + camera.y);
  hammer.angle = Math.atan2(dy, dx);

  // 망치 길이 조절 (마우스 거리에 따라 최소 40 ~ 최대 120)
  const dist = Math.sqrt(dx * dx + dy * dy);
  hammer.length = Math.max(40, Math.min(dist, 120));

  // 3. 망치 충돌 및 반동 로직
  // 망치 끝부분 좌표 계산
  const tipX = player.x + Math.cos(hammer.angle) * hammer.length;
  const tipY = player.y + Math.sin(hammer.angle) * hammer.length;

  for (const p of platforms) {
    // 망치 끝이 플랫폼 안에 있는지 확인 (단순 AABB 충돌)
    if (tipX > p.x && tipX < p.x + p.w && tipY > p.y && tipY < p.y + p.h) {
      // 가장 가까운 탈출 방향(Penetration Depth) 계산
      const distLeft = tipX - p.x;
      const distRight = p.x + p.w - tipX;
      const distTop = tipY - p.y;
      const distBottom = p.y + p.h - tipY;

      const min = Math.min(distLeft, distRight, distTop, distBottom);

      let pushX = 0;
      let pushY = 0;

      if (min === distTop)
        pushY = -distTop; // 위로 밀어내기
      else if (min === distBottom)
        pushY = distBottom; // 아래로 밀어내기
      else if (min === distLeft)
        pushX = -distLeft; // 왼쪽으로 밀어내기
      else if (min === distRight) pushX = distRight; // 오른쪽으로 밀어내기

      // 플레이어 위치 직접 조정 (망치를 지렛대 삼아 이동)
      player.x += pushX;
      player.y += pushY;

      // 속도 조정: 밀려난 만큼 속도에 반영 (반동 및 이동)
      player.vx += pushX; // 힘 전달률 증가 (0.5 -> 1.0)
      player.vy += pushY;

      // 마찰력 개선: 벽을 밀 때는 수직 마찰, 바닥을 밀 때는 수평 마찰 적용
      // 이를 통해 벽에 매달리거나 바닥에서 미끄러지지 않게 함
      if (pushX !== 0) player.vy *= 0.7; // 벽 마찰
      if (pushY !== 0) player.vx *= 0.7; // 바닥 마찰
    }
  }

  // 공기 저항
  player.vx *= 0.99;
  player.vy *= 0.99;

  // 4. 플레이어 위치 업데이트 및 충돌 처리 (서브스텝 적용)
  const steps = 8; // 프레임을 8번 나누어 처리 (정밀도 향상)
  for (let i = 0; i < steps; i++) {
    player.x += player.vx / steps;
    player.y += player.vy / steps;

    // 5. 플레이어(항아리) vs 지형 충돌 처리
    for (const p of platforms) {
      // 사각형(플랫폼)과 원(플레이어)의 충돌 감지
      const closestX = Math.max(p.x, Math.min(player.x, p.x + p.w));
      const closestY = Math.max(p.y, Math.min(player.y, p.y + p.h));

      const distX = player.x - closestX;
      const distY = player.y - closestY;
      const distanceSquared = distX * distX + distY * distY;

      if (distanceSquared < player.radius * player.radius) {
        const distance = Math.sqrt(distanceSquared);
        const overlap = player.radius - distance;

        let nx = distX / distance;
        let ny = distY / distance;

        if (distance === 0) {
          nx = 0;
          ny = -1;
        }

        // 위치 보정
        player.x += nx * overlap;
        player.y += ny * overlap;

        // 속도 반사
        const dot = player.vx * nx + player.vy * ny;
        if (dot < 0) {
          player.vx -= (1 + bounce) * dot * nx;
          player.vy -= (1 + bounce) * dot * ny;

          const tx = -ny;
          const ty = nx;
          const tDot = player.vx * tx + player.vy * ty;
          player.vx -= tDot * tx * (1 - friction);
          player.vy -= tDot * ty * (1 - friction);
        }
      }
    }

    // 화면 경계 처리
    if (player.x - player.radius < 0) {
      player.x = player.radius;
      player.vx *= -0.5;
    }
    if (player.x + player.radius > canvas.width) {
      player.x = canvas.width - player.radius;
      player.vx *= -0.5;
    }
    // 바닥 경계는 플랫폼 충돌로 처리되지만 안전장치로 유지
    if (player.y + player.radius > canvas.height + 200) {
      // 바닥보다 훨씬 아래로 떨어지면 리셋
      player.y = canvas.height - player.radius;
      player.vy = 0;
    }
  }

  // 6. 목표 지점 도달 확인
  if (!goal.reached) {
    const dx = player.x - goal.x;
    const dy = player.y - (goal.y + goal.h);
    if (Math.sqrt(dx * dx + dy * dy) < player.radius + 20) {
      goal.reached = true;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(0, camera.y);

  // 지형 그리기
  ctx.fillStyle = "#5d4037";
  for (const p of platforms) {
    ctx.fillRect(p.x, p.y, p.w, p.h);
  }

  // 깃발 그리기
  ctx.fillStyle = "#fff";
  ctx.fillRect(goal.x, goal.y, 4, goal.h);
  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.moveTo(goal.x + 4, goal.y);
  ctx.lineTo(goal.x + 30, goal.y + 10);
  ctx.lineTo(goal.x + 4, goal.y + 20);
  ctx.fill();

  // 망치 그리기
  const tipX = player.x + Math.cos(hammer.angle) * hammer.length;
  const tipY = player.y + Math.sin(hammer.angle) * hammer.length;

  ctx.strokeStyle = hammer.color;
  ctx.lineWidth = hammer.width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  // 망치 머리
  ctx.fillStyle = "#333";
  ctx.beginPath();
  ctx.arc(tipX, tipY, hammer.headRadius, 0, Math.PI * 2);
  ctx.fill();

  // 플레이어(항아리) 그리기
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();

  // 플레이어 머리 (사람)
  ctx.fillStyle = "#f1c40f";
  ctx.beginPath();
  ctx.arc(player.x, player.y - 10, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // 목표 방향 화살표 (골대가 화면 위에 있을 때)
  const goalScreenY = goal.y + camera.y;
  if (goalScreenY < -10 && !goal.reached) {
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    const arrowX = Math.max(30, Math.min(canvas.width - 30, goal.x)); // 화면 내에 표시
    ctx.moveTo(arrowX, 20);
    ctx.lineTo(arrowX - 15, 40);
    ctx.lineTo(arrowX + 15, 40);
    ctx.fill();
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GOAL", arrowX, 55);
  }

  // 성공 메시지
  if (goal.reached) {
    ctx.fillStyle = "black";
    ctx.font = "bold 60px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("성공!", canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(() => {
    update();
    draw();
  });
}

draw();
