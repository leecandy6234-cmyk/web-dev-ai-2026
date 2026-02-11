console.log(`^테스트 :`, /^H/.test("Hello"));
//H로 시작하는가? >> T
console.log(`$테스트 :`, /o$/.test("Hello"));
//o로 끝나는가?
console.log(`.테스트 :`, /H.llo/.test("Hello"));
//한문장 취급을 해서 어떤게 와도 T
console.log(`*테스트 :`, /abc*d/.test("abdccccccccc"));
// c가 있어도 되고 없어도 되고
console.log(`+테스트 :`, /abc+d/.test("abcd"));
console.log(`?테스트 :`, /abc?d/.test("abcd"));
console.log(`{m,n}테스트 :`, /^a{2,4}$/.test("aaaa"));
//ark 2부터 4개인가?
console.log(`[]테스트 :`, /^[a-zA-Z0-9]{2,100}$/.test("abcaABC5154"));
//a-z a부터z까지 한글은 가-힣 !-~:특수문자 +알파벳 소문자 + 대문자 + 숫자
console.log(`(|)테스트 :`, /(dog|cat)/.test("abcaABCcat5154t"));
//dog 혹은 cat이 포함되었는가?
console.log(`\d테스트 :`, /\d+$/.test("12345"));
console.log(`\D테스트 :`, /\D+$/.test("abcd"));
console.log(`\w테스트 :`, /\w+$/.test("abcd_123"));
console.log(`\W테스트 :`, /\W+$/.test("!~@#$%^"));
console.log(`\s테스트 :`, /\s+/.test("abcd 123"));
console.log(`\S테스트 :`, /^\S+$/.test("abcd 123"));

//mach / replace / split

const test = " alpple banana kiwi orange";
console.log("테스트 :match-", test.match(/kiwi/)[0]);
//kiwi 찾기
console.log("테스트 :replace-", test.replace(/a/, "A"));
console.log("테스트 :replace-", test.replace(/a/g, "A"));
//a를 A로 바꾸기

console.log("테스트 :split-", test.split(" "));
console.log("테스트 :split-", "010-1234-1234".split("-"));
console.log("테스트 :split-", "010-1234-1234".split(/-/));

//3. 주민등록번호 정규표현식

const input = document.querySelector("#input");
const result = document.querySelector("#result");
input.addEventListener("input", (event) => {
  //000000-0000000

  // 성별 : - 다음 바로 나오는 숫자는 1~4까지만 허용
  //let regExp = /^\d{6}-(1|2|3|4)\d{6}$/;
  //let regExp = /^\d{6}-[1-4][1-9]{6}}$/;
  let regExp = /^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])-(1|2|3|4)\d{6}$/;

  //생년 월일

  console.log(regExp.test(event.target.value));
  if (regExp.test(event.target.value)) {
    result.textContent = "OK";
    result.style.color = "green";
  } else {
    result.textContent = "X";
    result.style.color = "red";
  }
  //console.log(event.target.value);
});
