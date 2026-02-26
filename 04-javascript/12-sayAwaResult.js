// https://api.tvmaze.com/shows/1

document.querySelector("#fetch").addEventListener("click", () => {
  const result = document.querySelector("#fetchResult");
  const fetchApi = async () => {
    const res = await fetch("https://api.tvmaze.com/shows/1");
    const data = await res.json();
    console.log(data);
    result.innerHTML = `
      <img src="${data.image.medium}"/>
      <h3>${data.name}</h3> 
    `;
  };

  fetchApi();
});
