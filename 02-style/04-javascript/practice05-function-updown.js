//1. 1~x까지 랜덤
const x = 100;
const X = Math.ceil(Math.random() * x);
console.log(`정답은 ${X}입니다`); //랜덤값의 답

//무한 루프

let count = 0;
let count_2 = 0;
let count_3 = 0;
//취소버튼 => nall인데 이때 종료 if (a === null) break;
//alert(`공지`) >>>>
while (true) {
  count++;
  const a = prompt(`1부터 ${x}까지의 숫자를 입력해주세요`);
  if (a === "") {
    alert(`입력하세요!`);
  }

  if (a === null) {
    //const b = prompt(`포기하시려면 다시한번 취소버튼를 누르세요`);
    console.log(`포기하셨습니다!`);
    alert(`포기하셨습니다!`);
    break;
  }
  /*if (b === null) {
    console.log("포기하셨습니다!");
    alert(`포기하셨습니다!`);
    break;
  } else if (b !== null) {
  }*/

  console.log(`입력한 값은 ${a}입니다`);
  if (isNaN(a)) {
    const a = prompt("숫자만 입력해주세요");
    count_2++;
  } else if (a === X.toString()) {
    count_3 = count - count_2;
    alert("성공!");
    console.log(
      `성공!  잘못입력한 값 ${count_2}번과 ${count_3}번의 시도로 총 ${count}번의 입력끝에 성공하셨습니다`,
    );

    break;
  } else if (a > X.toString()) {
    alert("a가 정답 보다 더 큽니다. 다시입력하세요");
  } else if (a < X.toString()) {
    alert("a가 정답 보다 더 작습니다. 다시입력하세요");
  } else if (a !== X.toString()) {
    alert("틀렸습니다. 다시입력하세요");
  }
}

/*function callFunc(callback) {
  console.log("함수 호출 전!");
  callback(); // 콜백 함수 호출!
  console.log("함수 호출 후!");
}
function call() {
  console.log("성공!");
}
callFunc(call);*/
