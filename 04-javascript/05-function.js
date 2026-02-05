//1. 매개변수 x 리턴값 x
// function 함수명() {}
function sayHello() {
  console.log("안녕하세요!");
}
sayHello(); //함수 호출
sayHello();

//2. 매개변수 o 리턴값 x

/*
    function greet(매개변수) {}
    기본값이 없으면 undefined
*/
function greet(name = "게스트") {
  console.log(`${name}님, 안녕하세요!`);
}

greet("붕어");
greet("잉어");
greet("블롭피쉬");
greet();

// 3. 매개변수 x 리턴값 o

//리턴 :함수 호출 결과, 함수 종료

function getNumber() {
  return 1049;
}
console.log(getNumber());

//4. 매개변수 o, 리턴 값o

// 파라미터는 입력, 리턴은 출력
function add(a, b) {
  return a + b;
}

console.log(add(10, 20));
console.log(add(30, 50));

//변수의 유효범위(Scope)
const num1 = 100; //전역변수

function sample1() {
  const num1 = 200; //지역 변수 : 함수 밖에서 안쪽 변수는 접근 불가
  console.log("sample1 내부 : " + num1);
}
sample1();
console.log("sample1 외부 : " + num1);

// 선언적 vs 익명 vs 화살표 함수

// 선언적 함수(Function Declaration)
console.log("선언적 함수", multiply(3, 4)); //호이스팅 :선언 이전에 호출이 가능
function multiply(a, b) {
  return a * b;
}
console.log("선언적 함수", multiply(3, 4));

//익명 함수(Function Expression)
// 함수 이름이 없음, 변수에 할당
const subtract = function (a, b) {
  return a - b;
};
console.log("익명 함수", subtract(5, 8));

// 화살표 함수 (Arrow Function)
//Function 대신 => 사용
const divide = (a, b) => {
  return a / b;
};
console.log("화살표 함수", divide(12, 3));

//콜백 함수
//다른 함수의 파라미터로 전달되는 함수
function callFunc(callback) {
  console.log("함수 호출 전!");
  callback(); // 콜백 함수 호출!
  console.log("함수 호출 후!");
}
function call() {
  console.log("안녕하세요~ 콜백 함수 호출!");
}
callFunc(call);
//배열 관련 콜백 함수들
const numbers = [1, 2, 3, 4, 5];

//.1 값을 하나씩 출력 -> forEach
//기존 반복문을 대체
for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i], i);
}
numbers.forEach((value, index, array) => {
  console.log(value, index, array);
});

// 2.배열의 값을 각각 2배로 만들어서 출력
//각 배열의 값들을 가공하여 새로운 배열로 만들 때
const doubled = [1, 2, 3, 4, 5];
numbers.forEach((value, i) => {
  doubled.push(value * 2);
  doubled[i] = value * 2;

  console.log(value * 2);
});
console.log(doubled);

const doubleMap = numbers.map((value, index, array) => {
  return value * 2;
});
//const doubleMap = numbers.map((value, index, array) => value * 2);
console.log(doubleMap);

//3. 짝수만 출력
//[2,4]
const even = [];
numbers.forEach((value) => {
  if (value % 2 === 0) even.push(value);
});
console.log(even);
const evenfilter = numbers.filter((value, index, array) => value % 2 === 0);
console.log(evenfilter);

//배열의 값의 총합
let sum = 0;
numbers.forEach((value, index, array) => {
  //sum = sum + value;
  sum += value;
});
console.log(sum);

//reduce((accumulator-누적된 값,value, index, array)=> {}, 초기값)
//배열의 각 값들을 누적하여 하나의 값으로 변환
const sumReduce = numbers.reduce((acc, value) => {
  console.log(`acc: ${acc}, value: ${value}`);
  return acc + value;
}, 0);
console.log(sumReduce);
