const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const http = require("http");
const EventEmitter = require("events");
const logEvents = require("./logEvents");

class Event extends EventEmitter {}

const myEmitter = new Event();
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

// const logEvents = require("./logEvents");

const port = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      contentType.includes("image") ? "" : "utf8"
    );
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.log(err);
    myEmitter.emit("log", `${err.name} : ${err.message}`, "err.txt");
    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  myEmitter.emit("log", `${req.url}\t ${req.method}\n`, "req.txt");

  let extension = path.extname(req.url);
  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/js";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;

    case ".jpg":
      contentType = "image/jpg";
      break;

    default:
      contentType = "text/html";
      break;
  }

  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    serveFile(filePath, contentType, res);
  } else {
    // ("301 redirect");
    // ("404");
    res.writeHead(301, { Location: "/" });
    res.end();
  }
});

server.listen(port, () => {
  console.log(`runing on ${port}`);
});

//  "date-fns": "^2.23.0",
