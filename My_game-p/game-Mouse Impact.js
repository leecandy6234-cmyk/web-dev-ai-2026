const trailCount = 15; // 원의 개수 (물고기 길이)
const circles = [];
const mouse = { x: 0, y: 0 };
let lastMouseX = 0;
let lastMouseY = 0;

// 커서 원 생성
for (let i = 0; i < trailCount; i++) {
  const div = document.createElement("div");
  div.classList.add("cursor-trail");
  document.body.appendChild(div);
  circles.push({
    element: div,
    x: 0,
    y: 0,
  });
}

// 마우스 움직임에 따라 커서 위치 업데이트
document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  // 마우스 속도 계산 및 물방울 생성
  const dx = mouse.x - lastMouseX;
  const dy = mouse.y - lastMouseY;
  const distance = Math.hypot(dx, dy);

  if (distance > 20) {
    // 일정 속도 이상일 때 물방울 생성
    createDroplet(mouse.x, mouse.y);
  }

  lastMouseX = mouse.x;
  lastMouseY = mouse.y;
});

function animateCircles() {
  let x = mouse.x;
  let y = mouse.y;

  circles.forEach((circle, index) => {
    // 부드럽게 따라오도록 위치 보간
    circle.x += (x - circle.x) * 0.3;
    circle.y += (y - circle.y) * 0.3;

    circle.element.style.left = circle.x + "px";
    circle.element.style.top = circle.y + "px";

    // 뒤로 갈수록 작아지고 투명해지게 설정 (물고기 꼬리 효과)
    const scale = (trailCount - index) / trailCount;
    circle.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
    circle.element.style.opacity = 1 - index / trailCount;

    // 다음 원은 현재 원의 위치를 따라감
    x = circle.x;
    y = circle.y;
  });

  requestAnimationFrame(animateCircles);
}

animateCircles();

// 링크나 버튼에 마우스를 올렸을 때 커서 효과 변경 (선택 사항)
const interactiveElements = document.querySelectorAll(
  "a, button, .menu-items h2",
);

interactiveElements.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    circles.forEach((c) => {
      c.element.style.borderColor = "rgb(120, 50, 220)";
      c.element.style.backgroundColor = "rgba(80, 20, 150, 0.2)";
    });
  });
  el.addEventListener("mouseleave", () => {
    circles.forEach((c) => {
      c.element.style.borderColor = "rgb(180, 100, 255)";
      c.element.style.backgroundColor = "rgba(180, 100, 255, 0.2)";
    });
  });
});

// 마우스 클릭 시 파동 효과 생성
document.addEventListener("click", (e) => {
  const ripple = document.createElement("div");
  ripple.classList.add("ripple");
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;
  document.body.appendChild(ripple);

  // 애니메이션이 끝나면 요소 제거
  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
});

// 물방울 생성 함수
function createDroplet(x, y, zIndex = 9997) {
  const droplet = document.createElement("div");
  droplet.classList.add("droplet");
  // z-index를 동적으로 설정 (마우스 효과는 위, 텍스트 효과는 뒤)
  droplet.style.zIndex = zIndex;

  // 랜덤 크기 설정 (2px ~ 8px)
  const size = Math.random() * 6 + 2;
  droplet.style.width = `${size}px`;
  droplet.style.height = `${size}px`;

  // 랜덤 보라색 계열 설정 (Hue 260 ~ 300: 보라색 사이)
  const hue = Math.random() * 40 + 260;
  droplet.style.backgroundColor = `hsla(${hue}, 100%, 70%, 0.8)`;

  droplet.style.left = `${x}px`;
  droplet.style.top = `${y}px`;
  document.body.appendChild(droplet);

  // 랜덤한 방향으로 튀는 애니메이션
  const angle = Math.random() * Math.PI * 2;
  const velocity = Math.random() * 30 + 10;
  const tx = Math.cos(angle) * velocity;
  const ty = Math.sin(angle) * velocity;

  droplet.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 0.8 },
      { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 },
    ],
    {
      duration: 1500,
      easing: "ease-out",
    },
  ).onfinish = () => droplet.remove();
}

// 글자(제목 등) 주변에서 별가루가 반짝이는 효과
function startTextSparkles() {
  // h1, h2, h3 태그를 대상으로 설정
  const targetElements = document.querySelectorAll("h1, h2, h3");

  setInterval(() => {
    targetElements.forEach((el) => {
      // 요소의 위치와 크기 정보 가져오기
      const rect = el.getBoundingClientRect();

      // 요소가 화면 내에 보일 때만 효과 생성 (부분적으로라도 보이면)
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        // 생성 확률을 높여 더 많은 별가루 생성
        if (Math.random() < 0.3) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          // 글자 크기에 비례하는 원형 반경 설정
          const radius = Math.max(rect.width, rect.height) / 1.5;
          const angle = Math.random() * Math.PI * 2; // 원형으로 퍼지도록 랜덤 각도 생성
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          createDroplet(x, y, 1); // z-index를 1로 설정하여 글자 뒤에 배치
        }
      }
    });
  }, 100); // 0.1초마다 체크
}

startTextSparkles();
