//Math 객체
console.log("최소값 :", Math.min(5, 2, 4, -1, -9));
console.log("최대값 :", Math.max(5, 2, 4, -1, -9));
console.log("절대값 :", Math.abs(-7.57));
console.log("반올림 :", Math.round(2.897));
console.log("내림 :", Math.floor(2.897));
console.log("올림 :", Math.ceil(2.897));
console.log("0~1 사이의 랜덤 :", Math.random());

// 1~10까지의 랜덤숫자

// 0<= Math.random() < 1
//*10을 하면
// 0<= Math.random() * 10 < 10
// + 1
// 1<= Math.random() * 10 + 1 < 11
// 근데 이러면 이제 소수가 나오니까 내림으로 없애줌
//
console.log(Math.ceil(Math.random() * 10));

// 5~ 15까지의 랜덤 숫자
console.log(Math.ceil(Math.random() * 10) + 5);

// Date 객체

const now = new Date();
// 현재 날짜 및 시간
console.log(now);

// 월
console.log(
  `${now.getFullYear()} 년 ${now.getMonth() + 1} 월 ${now.getDate()} 일`,
); //영어기준이라 -1월임

const date = new Date(2026, 7, 20, 18, 10, 0); //년 월 일 시 분 초
console.log(date);

const date2 = new Date("2026-08-20"); //시간을 지정하지 않아서 임의로 나옴
console.log(date2);

const date3 = new Date("2026-08-20T18:10:00"); //날짜와 시간 사이에 T를 넣을 것
console.log(date3.toLocaleDateString("en-CA")); //형식 지정
console.log(date3.toLocaleDateString("ko-KR", { weekday: "long" })); //형식 지정
console.log(date3.toLocaleDateString("ja-JP")); //형식 지정

// String 객체

const str = new String("Hello Java");
console.log(str.length); //length는 길이
console.log("포함여부:", str.includes("Java"));
console.log("위치:", str.indexOf("Java"));
console.log("포함여부:", str.slice(6, 10));
console.log("대문자로:", str.toUpperCase());
console.log("소문자로:", str.toLowerCase());

//Timer
//1000=1초

//일정시간 후 1회
setTimeout(() => {
  console.log("3초 후 실행!");
}, 3000);

//일정시간마다 반복 실행
/*let sec = 0;
setInterval(() => {
  console.log(`${++sec}초`);
}, 1000);*/

//JSON
const obj = {
  name: "김붕어",
  age: 10,
};
//객체 -> 문자열
const jsonStr = JSON.stringify(obj);
console.log(obj, typeof obj);
console.log(jsonStr, typeof jsonStr);

//문자열->객체
const jasonParse = JSON.parse(jsonStr);
console.log(jasonParse, typeof jasonParse);

//BOM
console.log(this);

console.log(location.href); //현재  전체주소
console.log(location.host); // 호스트명 (도메인)
console.log(location.pathname); //경로

// 페이지
//location.href = "https://www.naver.com";
