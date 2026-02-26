// 업비트 API 주소: https://api.upbit.com/v1/market/all

// HTML 문서에서 id가 "coin"인 버튼 요소를 찾아 클릭 이벤트를 감지합니다.
coin.addEventListener("mouseenter", () => {
  coin.style.backgroundColor = "rgb(104, 104, 104)";
  coin.textContent = "시세 가져오기";
});
coin.addEventListener("mouseleave", () => {
  coin.style.backgroundColor = "rgb(158, 158, 158)";
  coin.textContent = "시세 가져오기";
});

document.querySelector("#coin").addEventListener("click", () => {
  // 결과를 출력할 HTML 요소(id="fetchResult")를 선택합니다.
  coin.textContent = "시세를 가져왔습니다";
  const guidelines = document.querySelector("#guidelines");
  guidelines.textContent = "실시간으로 1초마다 갱신됩니다";
  const result = document.querySelector("#coinResult");

  // 비동기 함수 fetchApi를 정의합니다. (async 키워드 사용)
  // 서버 통신은 시간이 걸리므로 비동기로 처리해야 브라우저가 멈추지 않습니다.
  const fetchApi = async () => {
    try {
      // 1. 마켓 코드 조회 (모든 종목 정보를 가져옵니다)
      // fetch 함수는 네트워크 요청을 보내고 프로미스(Promise)를 반환합니다.
      // await 키워드는 데이터가 도착할 때까지 기다립니다.
      const marketRes = await fetch(
        "https://api.upbit.com/v1/market/all?isDetails=false",
      );
      //await를 쓸려면 함수밖에 async를 사용해야함

      // 응답 본문을 자바스크립트 객체(JSON) 형태로 변환합니다.
      const marketData = await marketRes.json();

      // 2. KRW(원화) 마켓만 필터링합니다.
      // filter 함수를 사용하여 market 코드가 "KRW-"로 시작하는 항목만 골라냅니다.
      const krwMarkets = marketData.filter((item) =>
        item.market.startsWith("KRW-"),
      );

      // 3. 시세 조회를 위해 마켓 코드들을 콤마(,)로 연결합니다.
      // map 함수로 market 코드만 추출하고, join 함수로 하나의 문자열로 합칩니다.
      // 예: "KRW-BTC,KRW-ETH,KRW-XRP..." 형태가 됩니다.
      const marketCodes = krwMarkets.map((item) => item.market).join(",");

      // 4. 현재가(Ticker) 조회 API를 호출합니다.
      // 위에서 만든 marketCodes 문자열을 쿼리 파라미터(?markets=...)로 전달합니다.
      const tickerRes = await fetch(
        `https://api.upbit.com/v1/ticker?markets=${marketCodes}`,
      );
      const tickerData = await tickerRes.json();

      // 5. 화면에 출력할 HTML 문자열을 생성합니다.
      // 테이블의 헤더(제목) 부분을 먼저 만듭니다.
      let html = `<table border="1" style="border-collapse: collapse; width: 100%;">
                    <tr><th>종목명</th><th>현재가</th><th>전일대비</th></tr>`;

      // 받아온 시세 데이터(tickerData)를 하나씩 꺼내서 테이블 행(tr)을 추가합니다.
      tickerData.forEach((ticker) => {
        // 해당 종목의 한글 이름을 찾기 위해 krwMarkets 배열에서 검색합니다.
        const marketInfo = krwMarkets.find((m) => m.market === ticker.market);
        // 한글 이름이 있으면 사용하고, 없으면 마켓 코드를 사용합니다.
        const name = marketInfo ? marketInfo.korean_name : ticker.market;
        //console.log(name);

        // 가격을 보기 좋게 3자리마다 콤마를 찍어 문자열로 변환합니다. (예: 10,000)
        const price = ticker.trade_price.toLocaleString();

        // 전일 대비 등락률을 백분율로 변환하고 소수점 2자리까지 표시합니다.
        const rate = (ticker.signed_change_rate * 100).toFixed(2);

        // 등락률에 따라 색상을 지정합니다. (상승: 빨강, 하락: 파랑, 보합: 검정)
        const color = rate > 0 ? "red" : rate < 0 ? "blue" : "black";

        // 테이블 행을 HTML 문자열에 추가합니다.
        html += `<tr>
                  <td>${name}</td>
                  <td>${price} KRW</td>
                  <td style="color:${color}">${rate}%</td>
                 </tr>`;
      });

      // 테이블 태그를 닫습니다.
      html += `</table>`;

      // 완성된 HTML 문자열을 화면 요소(p 태그) 안에 넣습니다.
      result.innerHTML = html;
    } catch (error) {
      // try 블록 내에서 에러가 발생하면(예: 인터넷 끊김, API 오류 등) catch 블록이 실행됩니다.
      console.error(error);
      result.innerHTML = "데이터를 불러오는데 실패했습니다.";
    }
  };

  // 함수를 실행합니다.

  setInterval(() => {
    //1부터 4까지 랜덤

    fetchApi();
  }, 1000); //1초마다
});
