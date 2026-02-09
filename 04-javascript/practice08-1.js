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

const now = new Date();
// 숫자를 두 자리로 만들 때 사용
const minute = String(now.getMinutes()).padStart(2, "0");

console.log(minute);

// 요일 배열 제공
const weeks = ["일", "월", "화", "수", "목", "금", "토"];
const week = weeks[now.getDay()];

//일정시간마다 반복 실행

setInterval(() => {
  //1부터 4까지 랜덤
  const x = Math.ceil(Math.random() * 4);
  console.log(x);

  console.log(quotes[x]);
}, 5000); //5초마다

const body = document.querySelector("body");
body.style.backgroundColor = "rad";

//현재 한국시 시간
let a;
setInterval(() => {
  //1부터 4까지 랜덤
  a = new Date();
  console.log(a);
}, 1000); //1초마다
