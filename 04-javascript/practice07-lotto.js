//랜덤 45
let a = 45; //몇 번을 반복할것인지?
let x = Math.ceil(Math.random() * a);
//console.log(x);

let x2 = Math.ceil(Math.random() * a);
//console.log(x2);

let x3 = Math.ceil(Math.random() * a);
//console.log(x3);

let x4 = Math.ceil(Math.random() * a);
//console.log(x4);

let x5 = Math.ceil(Math.random() * a);
//console.log(x5);

let x6 = Math.ceil(Math.random() * a);
//console.log(x6);

//중복 X

while (true) {
  if (x === x2 || x === x3 || x === x4 || x === x5 || x === x6) {
    console.log("중복, 재실행");
    x = Math.ceil(Math.random() * a);
    console.log(`1번은 ${x}`);
  } else if (x2 === x3 || x2 === x4 || x2 === x5 || x2 === x6) {
    console.log("중복, 재실행");
    x2 = Math.ceil(Math.random() * a);
    console.log(`2번은 ${x2}`);
  } else if (x3 === x4 || x3 === x5 || x3 === x6) {
    console.log("중복, 재실행");
    x3 = Math.ceil(Math.random() * a);
    console.log(`3번은 ${x3}`);
  } else if (x4 === x5 || x4 === x6) {
    console.log("중복, 재실행");
    x4 = Math.ceil(Math.random() * a);
    console.log(`4번은 ${x4}`);
  } else if (x5 === x6) {
    console.log("중복, 재실행");
    x5 = Math.ceil(Math.random() * a);
    console.log(`5번은 ${x5}`);
  } else {
    break;
  }
} //최종적으로 나온 숫자
console.log(x);
console.log(x2);
console.log(x3);
console.log(x4);
console.log(x5);
console.log(x6);

//입력 받은 값
let p;
while (true) {
  p = prompt("1부터 45까지 중복없이 6번을 입력해 주세요");
  if (isNaN(p)) {
    alert("다시 입력하세요");
  } else if (p === "") {
    alert("다시 입력하세요");
  } else if (p === null) {
    alert("다시 입력하세요");
  } else {
    console.log(p);
    break;
  }
}

console.log(p);

//1부터 a까지만 입력
while (true) {
  a--;
  console.log(`a의 카운트는 현재 ${a}입니다.`);
  if (p == a) {
    console.log("정답!");
  } else if (p != a) {
    console.log("오답!");
  }
  if (a <= 0) {
    console.log(" a가 0보다 작음");
    break;
  }
}
