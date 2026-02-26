document.querySelector("#callback").addEventListener("click", () => {
  const result = document.querySelector("#callResult");
  result.textContent = "콜백 시작!";
  setTimeout(() => {
    result.textContent = "1초 후 실행";

    setTimeout(() => {
      result.textContent = "2초 후 실행";
    }, 1000);
  }, 1000);
});
document.querySelector("#promise").addEventListener("click", () => {
  const result = document.querySelector("#promiseResult");
  // resolve : 성공, reject : 실패
  new Promise((resolve, reject) => {
    setTimeout(() => resolve("1초 후 실행"), 1000);
  })
    .then((data) => {
      result.textContent = data;
      return new Promise((resolve) =>
        setTimeout(() => resolve("2초 후 실행"), 1000),
      );
    })
    .then((data) => {
      // resolve로 보낸 값 받는 곳
      result.textContent = data;
    });
});

document.querySelector("#async").addEventListener("click", () => {
  const result = document.querySelector("#asyAwaResult");

  const delay = (message) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(message), 1000);
    });
  };

  const asyncAwait = async () => {
    const response = await delay("1초 후 실행");
    result.textContent = response;
    const response2 = await delay("2초 후 실행");
    result.textContent = response2;
  };
  asyncAwait();
});

// https://api.tvmaze.com/shows/1
document.querySelector("#fetch").addEventListener("click", () => {
  const result = document.querySelector("#fetchResult");

  const fetchApi = async () => {
    const response = await fetch("https://api.tvmaze.com/shows/1");
    const data = await response.json();
    console.log(data);
    result.innerHTML = `<img src="${data.image.medium}"/>
      <h3>${data.name}</h3>
      <p>${data.summary}</p>
    `;
  };
  fetchApi();
});
