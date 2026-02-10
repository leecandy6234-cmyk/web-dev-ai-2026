import quotes from "./quotes.js";
// html 에는 module 지정하고 /quotes.js 파일에는 익스포트 시켜야함
const day = document.querySelector("#day");

const time = document.querySelector("#time");

const y = document.querySelector("#y");

const text = document.querySelector("#text");
const text2 = document.querySelector("#text2");
let m1 = 30;

// 요일 배열 제공
const weeks = ["일", "월", "화", "수", "목", "금", "토"];
const current = () => {
  const now = new Date(); //현재 시간
  const minute = String(now.getMinutes()).padStart(2, "0"); //분
  const second = String(now.getSeconds()).padStart(2, "0"); //초
  const hour = String(now.getHours()).padStart(2, "0"); //시
  const week = weeks[now.getDay()]; //요일
  const year = now.getFullYear(); //년

  const month = String(now.getMonth() + 1).padStart(2, "0"); //월
  // 현재 월(getMonth는 0~11이라 +1로 보정)을 문자열로 변환한 뒤, 한 자리면 앞에 0을 붙여 두 자리로 맞춤
  const date = String(now.getDate()).padStart(2, "0"); //일
  //---

  if (month == 2) {
    m1 = 28;
  } else if (year % 4 == 0 && month == 2) {
    m1 = 29;
  } else if (month == 4 || month == 6 || month == 9 || month == 11) {
    m1 = 30;
  } else {
    m1 = 31;
  }

  day.textContent = `${year}년 ${month}월 ${date}일(${week})`;
  time.textContent = `${hour}:${minute}:${second}`;
  y.textContent = `남은시간 ${11 - month}개월${m1 - date}일 ${23 - hour}시간 ${59 - minute}분 ${59 - second}초`;
};

current();

const T = () => {
  //일정시간마다 반복 실행-랜덤 글꼴
  setTimeout(() => {
    const x = Math.ceil(Math.random() * 4);
    const t1 = quotes[x].en;
    const t2 = quotes[x].ko;
    text.textContent = `${t1}  `;
    text2.textContent = `${t2}`;
    //5초마다
  }, 0);
  setInterval(() => {
    //1부터 4까지 랜덤
    const x = Math.ceil(Math.random() * 4);
    const t1 = quotes[x].en;
    const t2 = quotes[x].ko;
    text.textContent = `${t1}  `;
    text2.textContent = `${t2}`;
  }, 5000); //5초마다
};
T();
const now = new Date();
// 숫자를 두 자리로 만들 때 사용
const minute = String(now.getMinutes()).padStart(2, "0");

const week = weeks[now.getDay()];

const body = document.querySelector("body");
body.style.backgroundColor = "rad";

//현재 한국시 시간
let a;
setInterval(() => {
  //1부터 4까지 랜덤
  a = new Date();

  current();
}, 1000); //1초마다

//랜덤 색
let cunt;
setInterval(() => {
  document.body.style.backgroundColor = `rgba(${Math.ceil(Math.random() * 256)}, ${Math.ceil(Math.random() * 256)}, ${Math.ceil(Math.random() * 256)},0.2)`;
}, 3000); //3초 마다
