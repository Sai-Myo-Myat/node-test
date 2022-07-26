const path = require("path");
const express = require('express');
const app  = express();

const {logger} = require('./middleware/logEvents')
const errHandler = require('./middleware/errHandler');

app.use(logger)

app.use(express.static(path.join(__dirname, '/public')))

app.get('^/$|/index(.html)?', (req,res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"))
})

app.get('/new-page(.html)?', (req,res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"))
})

app.get('/old-page(.html)?',(req,res) =>{
  res.redirect(301, '/new-page.html')
})

app.all('*', (req,res) => {
  res.status(404);
  if(req.accepts("html")){
    res.sendFile(path.join(__dirname, "views", "404.html"))
  }else if(req.accepts("json")){
    res.json({err: "404 not found"})
  }else {
    res.type("txt").send("404 not found")
  }
  
})

app.use(errHandler);

const PORT = process.env.PORT || 3500;


app.listen(PORT, () => console.log("server is runing ", PORT));
