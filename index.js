const fs = require("fs");
const http = require("http");

const PORT = process.env.PORT || 12000;

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/?") req.url = "/index.html";
  fs.readFile(__dirname + req.url, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      console.log(`${req.method} ${req.url} - 404`);
      console.log(JSON.stringify(err) + "\n");
      return;
    }

    res.writeHead(200);
    res.end(data);
    console.log(`${req.method} ${req.url} - 200`);
  });
});

server.listen(PORT);

server.on("listening", () => console.log(`Listening on PORT: ${PORT}\n`));
