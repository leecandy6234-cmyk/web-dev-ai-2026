// 문서 객체 가져오기
console.log(document.body);

// 태그로 가져오기
console.log(document.getElementsByTagName("h1"));

// class로 가져오기
console.log(document.getElementsByClassName("testClass"));

// name으로 가져오기
console.log(document.getElementsByName("testName"));

// id로 가져오기
console.log(document.getElementById("testId"));

// querySelector(선택자) : 1개 선택
// querySelectorAll(선택자) : 여러개 선택
// -> 이 두 가지만 아셔도 괜찮아요!
console.log(document.querySelector("#testId2"));
console.log(document.querySelectorAll("div"));

// 문서 객체 조작하기
const editDivs = document.querySelectorAll("div");
editDivs[0].textContent = "<span>안녕하세요</span>";
editDivs[1].innerHTML = "<span>안녕하세요</span>";

// 속성 조작
const editDiv = document.querySelector("#testId");
editDiv.setAttribute("data-test", "테스트");
console.log(editDiv.getAttribute("data-test"));
editDiv.removeAttribute("data-test");

// 스타일 조작
editDiv.style.color = "orange";
editDiv.style.backgroundColor = "yellow";

// classList 조작
const div2 = document.querySelector("#testId2");
div2.classList.add("active");
console.log(div2.classList.contains("active"));
div2.classList.remove("active");
console.log(div2.classList.contains("active")); // 해당 클래스명을 가지고 있는지?
div2.classList.toggle("active");

// 문제 1. 텍스트 출력
const result1 = document.querySelector("#result1");
function printText() {
  result1.innerHTML = "안녕하세요";
}

// 문제 2. input 값 출력
const result2 = document.querySelector("#result2");
const customer = document.querySelector("#customer");
const printInputValue = () => {
  result2.textContent = customer.value;
  customer.value = "";
};

// 문제 3. div 색상 변경
const colorBox = document.querySelector("#colorBox");
const changeColor = function () {
  colorBox.style.backgroundColor = "yellow";
};
// 문제 4. 문자열 길이 출력
const text = document.querySelector("#text");
const result4 = document.querySelector("#result4");
function stringLength() {
  result4.textContent = text.value.length;
  text.value = "";
}
// 3. 문서 객체 추가/삭제
const testId3 = document.querySelector("#testId3");
// testId3.innerHTML = "<p>텍스트 추가</p>";
const p = document.createElement("p");
p.textContent = "텍스트 추가";
testId3.appendChild(p);

const pTarget = document.querySelector("#testId3 p");
pTarget.remove();

// 문제 5. 문자열 분리 ul 출력
const la = document.querySelector("#la");
const laArr = la.textContent.split(",");
const result5 = document.querySelector("#result5");

const stringSplit = () => {
  const ul = document.createElement("ul");
  for (value of laArr) {
    const li = document.createElement("li");
    li.textContent = value.trim();
    ul.appendChild(li);
  }
  result5.appendChild(ul);
};

// 문제 6. li 요소 추가 & 삭제
const list = document.querySelector("#list");
function addItem() {
  //const li = document.createElement("li");
  //li.textContent = "아이템 추가";
  //list.appendChild(li);
  list.innerHTML += "<li>아이템 추가</li>";
}
function removeItem() {
  const item = document.querySelector("#list li");
  item.remove();
} // 문제 7. 클래스 토글
const result9 = document.querySelector("#result9");
function toggleClass() {
  /*
  if (result9.classList.contains("toggle")) {
    // toggle 클래스가 포함 된 경우
    result9.classList.remove("toggle");
  } else {
    // 포함되지 않은 경우
    result9.classList.add("toggle");
  }*/
  result9.classList.toggle("toggle");
}
// 문제 8. 장바구니 리스트
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
