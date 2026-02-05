//취소버튼 => nall인데 이때 종료 if (a === null) break;
//alert(`공지`) >>>>
//숫자인데 1~100까지 숫자가 아닌경우 - 잘못 작성한 경우 (continue)

let x; // function 으로 넣은건 밖으로 빼줘야함
let X;
let a;
let count = 0;
let count_2 = 0;
let count_3 = 0;

function judge_1() {
  if (a === "") {
    alert(`입력하세요!`);
  }
} //판단결과의 부속품 -아무것도 입력하지 않았을때
function judge_2() {} //판단결과의 부속품
function showMessage_1() {} //메세지 표시

function getTarget() {
  //1. 1~x까지 랜덤
  x = 100;
  X = Math.ceil(Math.random() * x); //무한 루프
  console.log(`정답은 ${X}입니다`); //랜덤값의 답
} //맞춰야하는 랜덤 함수

function setInput() {
  a = prompt(`1부터 ${x}까지의 숫자를 입력해주세요`);
} //사용자한테 입력 받은 값

function judge() {} // 판단 결과

function showMessage() {} //메세지 표시

function play() {
  getTarget(); //맞춰야하는 랜덤 함수

  while (true) {
    count++;
    setInput(); //사용자한테 입력 받은 값
    judge_1(); //-아무것도 입력하지 않았을때

    if (a === null) {
      const b = confirm("포기하시려면 다시한번 확인버튼를 누르세요");
      //alert(b); // true (확인) or false (취소)
      if (b) {
        alert(`포기하셨습니다!`);
        console.log(`포기하셨습니다!`);
        // 확인 버튼 - 다시 게임 시작
        break;
      } else {
        // 취소 버튼 - 포기

        play();
      }
      break;
    }

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
}
play();
