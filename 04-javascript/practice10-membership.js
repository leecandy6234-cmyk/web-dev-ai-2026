const id = document.querySelector("#id");
const pass = document.querySelector("#pass");
const passre = document.querySelector("#passre");
const na = document.querySelector("#na");
const email = document.querySelector("#email");
const number = document.querySelector("#number");

const a = document.querySelector(".a");
const b = document.querySelector(".b");
const c = document.querySelector(".c");
const d = document.querySelector(".d");
const e = document.querySelector(".e");
const f = document.querySelector(".f");
const p = document.querySelector(".p");
//
let x1 = 0;
let x2 = 0;
let x3 = 0;
let x4 = 0;
let x5 = 0;
let x6 = 0;

//

id.addEventListener("input", (event) => {
  const regExp = /^([a-z]|[A-Z]|[0-9]){4,12}$/;

  if (regExp.test(event.target.value)) {
    a.textContent = "OK";
    a.style.color = "green";
    x1 = 1;
    console.log(x1);
  } else {
    a.textContent = "X";
    a.style.color = "red";
    x1 = 0;
  }
});

pass.addEventListener("input", (event) => {
  const regExp = /^([!-~]){8,15}$/;

  if (regExp.test(event.target.value)) {
    b.textContent = "OK";
    b.style.color = "green";
    x2 = 1;
    console.log(x2);
  } else {
    b.textContent = "X";
    b.style.color = "red";
    x2 = 0;
  }
});

passre.addEventListener("input", (event) => {
  if (event.target.value === pass.value) {
    c.textContent = "OK";
    c.style.color = "green";
    x3 = 1;
    console.log(x3);
  } else {
    c.textContent = "X";
    c.style.color = "red";
    x3 = 0;
  }
});

na.addEventListener("input", (event) => {
  const regExp = /^([가-힣]){2,17}$/;

  if (regExp.test(event.target.value)) {
    d.textContent = "OK";
    d.style.color = "green";
    x4 = 1;
    console.log(x4);
  } else {
    d.textContent = "X";
    d.style.color = "red";
    x4 = 0;
  }
});

email.addEventListener("input", (event) => {
  const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (regExp.test(event.target.value)) {
    e.textContent = "OK";
    e.style.color = "green";
    x5 = 1;
    console.log(x5);
  } else {
    e.textContent = "X";
    e.style.color = "red";
    x5 = 0;
  }
});

number.addEventListener("input", (event) => {
  const regExp = /^\d{3}-\d{4}-\d{4}$/;

  if (regExp.test(event.target.value)) {
    f.textContent = "OK";
    f.style.color = "green";
    x6 = 1;
    console.log(x6);
  } else {
    f.textContent = "X";
    f.style.color = "red";
    x6 = 0;
  }
});

p.addEventListener("click", (event) => {
  if (x1 === 1 && x2 === 1 && x3 === 1 && x4 === 1 && x5 === 1 && x6 === 1) {
    alert("회원가입이 완료되었습니다.");
  } else {
    alert("잘못입력되었거나 입력하지 않은 구간이 있습니다");
  }
});
