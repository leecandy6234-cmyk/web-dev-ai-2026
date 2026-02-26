// 다크모드/화이트모드 토글 기능
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// 페이지 로드 시 저장된 테마 적용
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
}

if (themeToggleBtn && themeIcon) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

const playBtn = document.getElementById("play-btn");

if (playBtn) {
  playBtn.addEventListener("click", () => {
    window.open("../game/game02/game 02.html", "_blank");
  });
}

// 모달 관련 요소 선택
const modal = document.getElementById("image-modal");
const modalContent = document.getElementById("modal-image-placeholder");
const modalCaption = document.getElementById("modal-caption");
const closeModal = document.querySelector(".close-modal");

let modalAutoSlideInterval; // 모달 자동 슬라이드 타이머 변수

// 포트폴리오 카드 클릭 이벤트
document.querySelectorAll(".portfolio-card").forEach((card) => {
  card.addEventListener("click", () => {
    // 'mori-link' ID를 가진 카드는 mori 페이지로 이동
    if (card.id === "mori-link") {
      window.location.href = "./mori/mori-pc.html";
      return;
    }

    const title = card.querySelector("h3").innerText;
    const thumbnailText = card.querySelector(".thumbnail").innerText;

    // 모달 내용 설정 (가로 슬라이드 구조로 변경)
    modalContent.innerHTML = `
      <div class="modal-carousel-container">
        <div class="modal-track">
          <!-- 슬라이드 1: 메인 소개 -->
          <div class="modal-slide">
            <h2 style="color: #764abc; margin-bottom: 20px;">${title}</h2>
            <div style="width: 100%; height: 55vh; background-color: #222; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; border-radius: 8px;">
              <span style="font-size: 2rem; color: #555;">${thumbnailText} Main</span>
            </div>
            <p style="text-align: center;">이 프로젝트는 3D 모델링 도구를 사용하여 제작되었습니다.<br>사실적인 텍스처링과 라이팅이 특징입니다.</p>
          </div>
          
          <!-- 슬라이드 2: 상세 뷰 1 -->
          <div class="modal-slide">
            <h3 style="color: #ddd; margin-bottom: 20px;">Detail View 1</h3>
            <div style="width: 100%; height: 55vh; background-color: #2a2a2a; margin-bottom: 20px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
               <span style="color: #666;">Side View</span>
            </div>
            <p style="text-align: center;">측면에서 바라본 모습입니다.<br>폴리곤의 흐름을 최적화하여 성능을 고려했습니다.</p>
          </div>

          <!-- 슬라이드 3: 상세 뷰 2 -->
          <div class="modal-slide">
            <h3 style="color: #ddd; margin-bottom: 20px;">Detail View 2</h3>
            <div style="width: 100%; height: 55vh; background-color: #2a2a2a; margin-bottom: 20px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
               <span style="color: #666;">Render Shot</span>
            </div>
            <p style="text-align: center;">최종 렌더링 결과물입니다.<br>다양한 각도에서의 모습을 확인하세요.</p>
          </div>
        </div>
        
        <!-- 내비게이션 버튼 -->
        <button class="modal-prev">&lt;</button>
        <button class="modal-next">&gt;</button>
        
        <!-- 인디케이터 (점) -->
        <div class="modal-dots">
          <span class="modal-dot active" data-index="0"></span>
          <span class="modal-dot" data-index="1"></span>
          <span class="modal-dot" data-index="2"></span>
        </div>
      </div>
    `;

    modalCaption.innerText = ""; // 캡션 내용은 모달 내부로 이동했으므로 비워둠

    // 모달 표시
    modal.classList.remove("hidden");

    // --- 모달 내부 슬라이드 로직 시작 ---
    const track = modalContent.querySelector(".modal-track");
    const slides = modalContent.querySelectorAll(".modal-slide");
    const dots = modalContent.querySelectorAll(".modal-dot");
    const prevBtn = modalContent.querySelector(".modal-prev");
    const nextBtn = modalContent.querySelector(".modal-next");
    let currentIndex = 0;

    function updateModalSlide() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        if (index === currentIndex) dot.classList.add("active");
        else dot.classList.remove("active");
      });
    }

    function nextModalSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateModalSlide();
    }

    function prevModalSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateModalSlide();
    }

    // 버튼 이벤트
    nextBtn.addEventListener("click", () => {
      nextModalSlide();
      resetAutoSlide();
    });
    prevBtn.addEventListener("click", () => {
      prevModalSlide();
      resetAutoSlide();
    });

    // 점 클릭 이벤트
    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        currentIndex = parseInt(e.target.dataset.index);
        updateModalSlide();
        resetAutoSlide();
      });
    });

    // 자동 슬라이드 (3초마다)
    function startAutoSlide() {
      modalAutoSlideInterval = setInterval(nextModalSlide, 3000);
    }

    function resetAutoSlide() {
      clearInterval(modalAutoSlideInterval);
      startAutoSlide();
    }

    startAutoSlide(); // 시작
  });
});

// 갤러리 아이템 클릭 이벤트 (추가)
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const content = item.innerText;
    modalContent.innerText = `${content} - Full Screen`;
    modalCaption.innerText = "In-Game Screenshot";
    modal.classList.remove("hidden");
  });
});

// 기능 소개 이미지(작은 그리드) 클릭 이벤트 (추가)
document.querySelectorAll(".feature-img-item").forEach((item) => {
  item.addEventListener("click", () => {
    const content = item.innerText;
    modalContent.innerText = `${content} - Detail`;
    modalCaption.innerText = "Game Feature Screenshot";
    modal.classList.remove("hidden");
  });
});

// 닫기 버튼 클릭 시 모달 숨김
if (closeModal) {
  closeModal.addEventListener("click", () => {
    clearInterval(modalAutoSlideInterval); // 모달 닫을 때 타이머 정지
    modal.classList.add("hidden");
  });
}

// 모달 배경 클릭 시 닫기
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    clearInterval(modalAutoSlideInterval); // 모달 닫을 때 타이머 정지
    modal.classList.add("hidden");
  }
});

// 퀵 내비게이션 버튼 클릭 시 부드럽게 스크롤 이동
document.querySelectorAll(".quick-nav a, header nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      // targetElement.scrollIntoView({ behavior: "smooth" }); // 기존 방식 대신 커스텀 함수 사용
      smoothScroll(targetElement, 1000); // 1000ms = 1초 동안 부드럽게 이동
    }
  });
});

// 커스텀 스크롤 애니메이션 함수 (가속/감속 효과)
function smoothScroll(target, duration) {
  const targetPosition =
    target.getBoundingClientRect().top + window.pageYOffset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  // Easing 함수 (easeInOutQuad) - 부드러운 가속/감속
  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}
