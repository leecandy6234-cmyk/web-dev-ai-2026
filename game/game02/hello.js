const http = require("http");

const hostname = "127.0.0.1";
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("안녕하세요! Node.js 서버입니다.\n");
});

server.listen(port, hostname, () => {
  console.log(`서버가 http://${hostname}:${port}/ 에서 실행 중입니다.`);
});
