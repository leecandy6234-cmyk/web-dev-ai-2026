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
