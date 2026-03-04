const loginBtn = document.getElementById("login-btn");
const loginModal = document.getElementById("login-modal");
const closeBtn = document.querySelector(".close-modal");

// 로그인 버튼 클릭 시 모달 열기
if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault(); // 링크 이동 방지
    loginModal.classList.add("show");
  });
}

// 닫기 버튼(x) 클릭 시 모달 닫기
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    loginModal.classList.remove("show");
  });
}

// 모달 배경 클릭 시 닫기
window.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.classList.remove("show");
  }
});

// 로그인 폼 제출 처리 (예시)
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("로그인 기능은 아직 구현되지 않았습니다.");
    loginModal.classList.remove("show");
  });
}
