const im1 = document.querySelector("#im1");
const im2 = document.querySelector("#im2");
const im3 = document.querySelector("#im3");
const imgbox = document.querySelector(".imgbox img");
const end = document.querySelector("#end");
const red = document.querySelector(".red");
const p = document.querySelector("#p");
const x = 0;
const x1 = 0;
const x2 = 0;
const x3 = 0;
let k = 0;
/*
const game = document.querySelector(".imgbox");
game.addEventListener("click", (event) => {
  if (event.target.tagName === "IMG") {
    let x = Math.ceil(Math.random() * 3);
    console.log(x);
    k++;
    p.textContent = `시도한 횟수: ${k}번`;
    if (x === 1) {
      event.target.src = "./assets/spy1.jpg";
    } else if (x === 2) {
      event.target.src = "./assets/spy2.jpg";
    } else if (x === 3) {
      event.target.src = "./assets/spy3.jpg";
    }
  }
  if (im1.src === im2.src && im2.src === im3.src) {
    end.textContent = `축하합니다! ${k}번 만에 성공 하셨습니다!다시 시작하려면 재시작 버튼을 눌러주세요!`;
  } else {
    end.textContent = "계속 시도해주세요";
  }
});*/

red.addEventListener("click", (event) => {
  let x1 = Math.ceil(Math.random() * 3);
  let x2 = Math.ceil(Math.random() * 3);
  let x3 = Math.ceil(Math.random() * 3);

  k++;
  red.textContent = `(${k}) Click`;

  if (x1 === 1) {
    im1.src = "./assets/spy1.jpg";
  } else if (x1 === 2) {
    im1.src = "./assets/spy2.jpg";
  } else if (x1 === 3) {
    im1.src = "./assets/spy3.jpg";
  }

  if (x2 === 1) {
    im2.src = "./assets/spy1.jpg";
  } else if (x2 === 2) {
    im2.src = "./assets/spy2.jpg";
  } else if (x2 === 3) {
    im2.src = "./assets/spy3.jpg";
  }

  if (x3 === 1) {
    im3.src = "./assets/spy1.jpg";
  } else if (x3 === 2) {
    im3.src = "./assets/spy2.jpg";
  } else if (x3 === 3) {
    im3.src = "./assets/spy3.jpg";
  }

  if (im1.src === im2.src && im2.src === im3.src) {
    end.textContent = `축하합니다! ${k}번 만에 성공 하셨습니다!다시 시작하려면 재시작 버튼을 눌러주세요!`;
    red.setAttribute("disabled", "true");
  } else {
    end.textContent = "계속 시도해주세요";
  }
});
