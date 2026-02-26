// Web Storage API: 브라우저에 데이터를 저장하는 방법 (쿠키보다 더 많은 데이터 저장 가능)
// 1. sessionStorage: 브라우저 탭을 닫으면 데이터가 사라짐 (휘발성)
// 2. localStorage: 브라우저를 닫아도 데이터가 유지됨 (반영구적)

const setSession = document.querySelector("#setSession");
setSession.addEventListener("click", () => {
  // 세션에 저장 & 수정
  // 세션 스토리지에 데이터 저장 (setItem)
  // 형식: sessionStorage.setItem("키", "값");
  sessionStorage.setItem("session", "세션");
  sessionStorage.setItem("session2", "세션2");
});

const getSession = document.querySelector("#getSession");
getSession.addEventListener("click", () => {
  // 세션에서 가져오기
  // 세션 스토리지에서 데이터 가져오기 (getItem)
  // 형식: sessionStorage.getItem("키");
  const session = sessionStorage.getItem("session");
  const session2 = sessionStorage.getItem("session2");
  alert(session);
  alert(session2);
});

const removeSession = document.querySelector("#removeSession");
removeSession.addEventListener("click", () => {
  // 세션에서 삭제
  // 세션 스토리지의 특정 데이터 삭제 (removeItem)
  // 형식: sessionStorage.removeItem("키");
  sessionStorage.removeItem("session");
});

const clearSession = document.querySelector("#clearSession");
clearSession.addEventListener("click", () => {
  // 세션 전체 비우기
  // 세션 스토리지의 모든 데이터 삭제 (clear)
  sessionStorage.clear();
});

//////////////////////////

const setLocal = document.querySelector("#setLocal");
setLocal.addEventListener("click", () => {
  // 로컬에 저장 & 수정 -> 값은 무조건 문자열 (보통 JSON 객체로 넣는 편)
  // 객체 자체를 직접 넣으면 안들어가져요! -> 객체 -> 문자열로 변경해서 추가
  // 로컬 스토리지에 저장 (localStorage)
  // 특징: 값은 무조건 '문자열'로만 저장됩니다.
  localStorage.setItem("local", "로컬");
  localStorage.setItem("user", { name: "사용자", age: 5 });

  // 객체(Object)를 저장할 때 주의할 점!
  // 그냥 저장하면 "[object Object]"라는 문자열로 깨져서 저장됩니다.
  // 해결책: JSON.stringify()를 사용하여 객체를 JSON 문자열로 변환해야 합니다.
  const user = { name: "사용자", age: 5 };
  localStorage.setItem("user", JSON.stringify(user));
});

const getLocal = document.querySelector("#getLocal");
getLocal.addEventListener("click", () => {
  // 로컬 스토리지에서 데이터 가져오기
  const user = localStorage.getItem("user");
  console.log(user);

  // 가져온 데이터는 JSON 문자열 형태이므로, 다시 객체로 쓰려면 JSON.parse()가 필요합니다.
  const parseUser = JSON.parse(user);
  console.log(parseUser); // { name: "사용자", age: 5 } 객체로 출력됨
});

// 로컬 스토리지 삭제 및 비우기 (기능 구현 예시)
const removeLocal = document.querySelector("#removeLocal");
removeLocal.addEventListener("click", () => {
  localStorage.removeItem("local"); // 'local' 키 삭제
});

const clearLocal = document.querySelector("#clearLocal");
clearLocal.addEventListener("click", () => {
  localStorage.clear(); // 전체 삭제
});
