//문서 객체 가져오기
console.log(document.body); //바디 테그를 가져옴

//태그로 가져오기
console.log(document.getElementsByTagName("h1"));

//클래스로 가져오기
console.log(document.getElementsByClassName("testClass"));

//이름으로 가져오기
console.log(document.getElementsByName("testName"));

//id로 가져오기
console.log(document.getElementById("testId"));

//querySelector(선택자) : 1개만 선택 / querySelectorAll(선택자): 여러개 선택
// -> 이 두가지만 알아도 상관 x
console.log(document.querySelector("#testId2"));
console.log(document.querySelectorAll("div"));

//문서 객체 조작하기
const ediitDivs = document.querySelectorAll("div");
ediitDivs[0].textContent = "<span>안녕하세요</span>";
ediitDivs[1].innerHTML = "<sapn>안녕하세요</sapn>";

//속성 조작

const editdiv = document.querySelector("#testId2");
editdiv.setAttribute("data-test", "테스트");
console.log(editdiv.getAttribute("data-test"));
editdiv.removeAttribute("data-test"); //속성제거
console.log(editdiv.getAttribute("data-test"));

// 스타일 조작
editdiv.style.color = "orange";
editdiv.style.backgroundColor = "yellow";

//classList 조작
const div2 = document.querySelector("#testId");
div2.classList.add("active"); //적용
div2.classList.remove("active"); //삭제
console.log(div2.classList.contains("active")); //있으면 true 없으면 false
div2.classList.toggle("active"); //없으면 해줘 느낌

//문제

//1번
const a1 = document.querySelector("#result1");
function printText() {
  result1.innerHTML = "안녕하세요";
}
//2번
const result2 = document.querySelector("#result2");
const customer = document.querySelector("#customer");
printInputValue = () => {
  result2.innerHTML = customer.value;
  customer.value = ""; //출력 후 비우기
};

//3번

const colorBox = document.querySelector("#colorBox");
const changeColor = function () {
  colorBox.style.backgroundColor = "orange";
};

//4번
const text = document.querySelector("#text");
const result4 = document.querySelector("#result4");
function stringLength() {
  result4.textContent = text.value.length;
}

//3. 문서 객체 추가/삭제

const testId3 = document.querySelector("#testId3");
//testId3.innerHTML = "<P>텍스트 추가</p>";
const p = document.createElement("p");
p.textContent = "텍스트 추가";
testId3.appendChild(p);

const Ptarget = document.querySelector("#testId3 p");
Ptarget.remove();

//5번 문제
const la = document.querySelector("#la");
console.log(la.textContent.split(","));

const stringSplit = () => {
  for (value of laArr) {
    const li = document.createElement("li");
    li.textContent = value.trim();
    ul.appendChild(li);
    console.log(value.trim());
  }
};

const result5 = document.querySelector("#result5");

//6번 문제
const list = document.querySelector("#list");

function addItem() {
  const li = document.querySelector("li");
  //li.textContent = "아이템 추가";
  //list.appendChild(li);
  list.innerHTML += "<li>아이템 추가</li>";
}
function removeItem() {
  const item = document.querySelector("#list,li");
  item.remove();
}

//7번 문제

const result7 = document.querySelector("#result7");

function toggleClass() {
  /*if (result7.classList.contains("toggle")) {
    result7.classList.remove("toggle");
    //toggle 클래스가 포함된 경우
  } else {
    //toggle 클래스가 없는 경우
    result7.classList.add("toggle");
  }
*/
  result7.classList.toggle("toggle");
}

//8번 문제 장바구니 리스트
const item = document.querySelector("#item");
const price = document.querySelector("#price");
const cart = document.querySelector("#cart");
const total = document.querySelector("#total span");
let sum = 0;
function addToCart() {
  cart.innerHTML += `<li>${item.value} - ${price.value}</li>`;
  sum += Number(price.value);
  item.value = "";
  price.value = "";
  total.textContent = sum;
}
