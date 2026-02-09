const quotes = [
  {
    en: "God doesn't require us to succeed: he only requires that you try.",
    ko: "신은 우리에게 성공을 요구하지 않는다. 우리가 노력할 것을 요구할 뿐이다.",
  },
  {
    en: "Hold faithfulness and sincerity as first principles.",
    ko: "충심과 성실을 첫 번째 원칙으로 삼아라.",
  },
  {
    en: "Only actions give life strength; only moderation gives it a charm.",
    ko: "행동만이 삶에 힘을 주고 절제만이 삶에 매력을 준다.",
  },
  {
    en: "No one has ever made a difference by being like everyone else.",
    ko: "그저 남들과 똑같이 살면서 차이를 만들어낸 사람은 없다.",
  },
];

const day = document.querySelector("#day");

const time = document.querySelector("#time");

const y = document.querySelector("#date");

const text = document.querySelector("#text");
const text2 = document.querySelector("#text2");
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

  const date2 = String(now.getDate()); //
  const hour2 = String(now.getHours()).padStart(2, "0"); //시
  const minute2 = String(now.getMinutes()).padStart(2, "0"); //분
  const second2 = String(60 - now.getSeconds()).padStart(2, "0"); //초

  console.log(day);
  console.log(week);
  day.textContent = `${year}년 ${month}월 ${date}일(${week})`;
  time.textContent = `${hour}:${minute}:${second}`;
  y.textContent = `${second2}초`;
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

console.log(minute);

const week = weeks[now.getDay()];

const body = document.querySelector("body");
body.style.backgroundColor = "rad";

//현재 한국시 시간
let a;
setInterval(() => {
  //1부터 4까지 랜덤
  a = new Date();
  console.log(a);
  current();
}, 1000); //1초마다

//랜덤 색
let cunt;
setInterval(() => {
  document.body.style.backgroundColor = `rgba(${Math.ceil(Math.random() * 256)}, ${Math.ceil(Math.random() * 256)}, ${Math.ceil(Math.random() * 256)},0.2)`;
}, 3000); //3초 마다
