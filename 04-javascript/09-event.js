//HTML 구조가 완전히 실행한 뒤 실행
window.addEventListener("DOMContentLoaded", () => {});

//h1 가져오기
const h1 = document.querySelector("h1");
console.log(h1);

//클릭 이벤트
const click = document.querySelector("#click");
click.addEventListener("click", () => {
  //클릭 이벤트가 일어날 시 실행하고자 하는 코드 작성
  alert("클릭!");
  click.style.backgroundColor = "hotpink";
});

const doble = document.querySelector("#doble");
doble.addEventListener("dblclick", () => {
  alert("더블클릭!");
});

const right = document.querySelector("#right");
right.addEventListener("contextmenu", (event) => {
  //e.preventDefault();
  event.preventDefault(); //이벤트 제거
  //alert("우클릭!");
});

const hover = document.querySelector("#hover");
hover.addEventListener("mouseenter", () => {
  console.log("마우스가 들어왔습니다.");
  hover.style.backgroundColor = "lightblue";
  hover.textContent = "Mouse Enter";
});
hover.addEventListener("mouseleave", () => {
  console.log("마우스가 나갔습니다.");
  hover.style.backgroundColor = "navy";
  hover.textContent = "Mouse Leave";
});

const form = document.querySelector("#form");
const inputResult = document.querySelector("#inputResult");
const input = document.querySelector("#input");
form.addEventListener("submit", (event) => {
  //input 입력이 비어있을시만 방지, 입력했다면 제출
  if (input.value === "") event.preventDefault();
  else alert("제출!");
});
input.addEventListener("input", () => {
  console.log(input.value);
  inputResult.textContent = input.value;
});

//selsct에 있는 option을 선택할 때 마다 일어나는 이벤트 : change
//해당하는 이벤트가 일어날 시 selectResult에 값이 나타나도록
const select = document.querySelector("#select");
const selectResult = document.querySelector("#selectResult");
select.addEventListener("change", (event) => {
  selectResult.textContent = event.target.value;
});

//3. 키보드 이벤트
const key = document.querySelector("#key");
const keyResult = document.querySelector("#keyResult");
const moveBox = document.querySelector("#moveBox");
let x = 1;
let y = 1;
key.addEventListener("keyup", (event) => {
  keyResult.textContent = event.key;

  if (event.key == "ArrowRight") {
    x += 1;
    moveBox.style.left = `${x}px`;
  } else if (event.key == "ArrowLeft") {
    x -= 1;
    moveBox.style.left = `${x}px`;
  } else if (event.key == "ArrowUp") {
    y -= 1;
    moveBox.style.top = `${y}px`;
  } else if (event.key == "ArrowDown") {
    y += 1;
    moveBox.style.top = `${y}px`;
  }
});
document.addEventListener("wheel", (event) => {
  console.log(event.deltaY);
  if (event.deltaY > 0) {
    moveBox.style.transform = "scale(1.1)";
  } else {
    moveBox.style.transform = "scale(0.9)";
  }
});
const scroll = document.querySelector("#scroll");
document.addEventListener("scroll", () => {
  //console.log(document.documentElement.scrollHeight); //전체 높이
  //console.log(window.innerHeight); //화면에 보이는 높이
  //console.log(window.scrollY); //스크롤 위치
  // scrollY + innerHeight === scrollHeight
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollY = window.scrollY;
  const innerHeight = window.innerHeight;
  //console.log(scrollHeight - innerHeight); //scrollY (가장 아래에 있는 값)
  const b = scrollHeight - innerHeight;
  //console.log((scrollY / b) * 100);
  const width = (scrollY / b) * 100;
  scroll.style.width = `${width}%`;
});

// 5. 이벤트 위임
//이미지를 클릭할 때마다 해당 이미지 지우기
const i1 = document.querySelector("#i1");
const i2 = document.querySelector("#i2");
const i3 = document.querySelector("#i3");
const img = document.querySelector(".container img");
/*img.addEventListener("click", (event) => {
  i1.style.display = "none";
  i2.style.display = "none";
  i3.style.display = "none";
});*/
/*for (let i = 0; i < img.length; i++) {
  img.addEventListenerAll("click", (event) => {
    img[i].style.display = "none";
  });
}*/

const container = document.querySelector(".container");
container.addEventListener("click", (event) => {
  if (event.target.tagName === "IMG") {
    event.target.style.display = "none";
  }
});
