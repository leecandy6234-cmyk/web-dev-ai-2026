/*
//사용자 입력
const p = prompt("가위 / 바위 / 보 중에입력하세요");
console.log(`당신 : ${p}`);
*/
/*
//랜덤 (3)
const x = Math.ceil(Math.random() * 3); //1부터 3까지 랜덤으로 나오게

//console.log(x); --확인 코드
const abc = ["가위", "바위", "보"];
*/
/*

console.log(abc[0]); //가위
console.log(abc[1]); //바위
console.log(abc[2]); //보

*/

/*

// 랜덤한 가위바위보 출력
if (x === 1) {
  console.log(`상대 : ${abc[0]}`);
} else if (x === 2) {
  console.log(`상대 : ${abc[1]}`);
} else if (x === 3) {
  console.log(`상대 : ${abc[2]}`);
}

//비겼습니다
if (
  (x === 1 && p === "가위") ||
  (x === 2 && p === "바위") ||
  (x === 3 && p === "보")
) {
  alert("비겼습니다");
  console.log("비겼습니다");
}

//이겼습니다
if (
  (x === 1 && p === "바위") ||
  (x === 2 && p === "보") ||
  (x === 3 && p === "가위")
) {
  alert("이겼습니다");
  console.log("이겼습니다");
}

//졌습니다
if (
  (x === 1 && p === "보") ||
  (x === 2 && p === "가위") ||
  (x === 3 && p === "바위")
) {
  alert("졌습니다");
  console.log("졌습니다");
}

*/

let count = 0; //끝낼 카운트
let count_1 = 0; //비긴 수
let count_2 = 0; //이긴 수
let count_3 = 0; //진 수
let a = 0; //몇 판 할 것인가

function game() {
  const a = prompt("몇 판을 하실 건가요? (숫자로입력해 주세요)");
  //몇 판 할 것인가?
  console.log(a);
  if (a == null) {
    alert(`입력해 주세요!`);
    console.log(`몇 판을 할지 정해지지 않았습니다.`);
    game();
  } else if (isNaN(a)) {
    alert(`숫자만 입력해 주세요!`);
    console.log(`숫자를 입력해 주세요!`);
    game();
  } else if (a === "") {
    alert(`숫자를 입력해 주세요!`);
    console.log(`숫자를 입력해 주세요!`);
    game();
  } else {
    console.log(`총 ${a}판을 하겠습니다.`);
    alert(`총 ${a}판을 하겠습니다.`);
  }

  while (true) {
    //랜덤 (3)
    const x = Math.ceil(Math.random() * 3); //1부터 3까지 랜덤으로 나오게

    //console.log(x); --확인 코드
    const abc = ["가위", "바위", "보"];

    //게임 카운트 3세판
    count++;
    //사용자 입력
    const p = prompt("가위 / 바위 / 보 중에입력하세요");
    console.log(`당신 : ${p}`);

    // 랜덤한 가위바위보 출력
    if (x === 1) {
      console.log(`상대 : ${abc[0]}`);
    } else if (x === 2) {
      console.log(`상대 : ${abc[1]}`);
    } else if (x === 3) {
      console.log(`상대 : ${abc[2]}`);
    }
    /////가위바위보 판별
    //비겼습니다
    if (
      (x === 1 && p === "가위") ||
      (x === 2 && p === "바위") ||
      (x === 3 && p === "보")
    ) {
      alert("비겼습니다");
      console.log("비겼습니다");
      count_1++;
    }

    //이겼습니다
    else if (
      (x === 1 && p === "바위") ||
      (x === 2 && p === "보") ||
      (x === 3 && p === "가위")
    ) {
      alert("이겼습니다");
      console.log("이겼습니다");
      count_2++;
    }

    //졌습니다
    else if (
      (x === 1 && p === "보") ||
      (x === 2 && p === "가위") ||
      (x === 3 && p === "바위")
    ) {
      alert("졌습니다");
      console.log("졌습니다");
      count_3++;
    }
    //게임 끝
    console.log(`${count}번째 게임 종료`);
    if (count == a) {
      console.log(
        `총 ${count}번의 게임중 ${count_1}번를 비기고 ${count_2}번을 이겼고 ${count_3}번을 졌습니다.`,
      );
      alert(
        `총 ${count}번의 게임중 ${count_1}번를 비기고 ${count_2}번을 이겼고 ${count_3}번을 졌습니다!`,
      );
      if (count_2 > count_3) {
        console.log(`당신은 이겼습니다!`);
        alert(`당신은 이겼습니다!`);
      } else if (count_2 < count_3) {
        console.log(`당신은 졌습니다!`);
        alert(`당신은 졌습니다!`);
      } else {
        console.log(`비겼습니다!`);
        alert(`비겼습니다!`);
      }
      break;
    }
  }
}

game();
