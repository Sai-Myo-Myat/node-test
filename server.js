const http = require("http");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const EventEmitter = require("events");
const logEvents = require("./logEvents");

class Event extends EventEmitter {}

const myEmitter = new Event();

const PORT = process.env.PORT || 3500;
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

//second step
const serveFile = async (contentType, filePath, response) => {
  try {
    console.log("serving file");
    const rawData = await fsPromises.readFile(
      filePath,
      contentType.includes("image") ? "" : "utf8"
    );
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(200, { "Content-Type": contentType });
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.log(err);
    myEmitter.emit(
      "log",
      `${err.name}:\t ${err.message}\t ${path.join(__dirname, __filename)}\n`,
      "err.txt"
    );
    response.statusCode = 500;
    response.end();
  }
};

//first step, we need create a server.
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  myEmitter.emit("log", `${req.url}: ${req.method}\n`, "req.txt");

  let extension = path.extname(req.url);
  // to check requested page and show the specific one

  let contentType; // to add header, like accepting the kind of request

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }

  //for browser to know the path
  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  //makes .html extention not require in the browser
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    //serve file to the browser
    serveFile(contentType, filePath, res);
  } else {
    // 301 , redirect or
    // 404
    console.log(path.parse("file not found"));
    switch (path.parse(filePath).base) {
      case "old-page.html":
        res.writeHead(301, { Location: "new-page.html" });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      default:
        serveFile("text/html", path.join(__dirname, "views", "404.html"), res);
        break;
    }
  }
});

server.listen(PORT, () => console.log("server is runing ", PORT));
