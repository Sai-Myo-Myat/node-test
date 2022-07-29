const path = require("path");
const express = require('express');
const app  = express();

const {logger} = require('./middleware/logEvents')
const errHandler = require('./middleware/errHandler');

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(logger)

app.use(express.static(path.join(__dirname, '/public')))

app.use('/' ,require('./routes/root'));
app.use('/register' ,require('./routes/api/register'));
app.use('/login' ,require('./routes/api/login'));
app.use('/employees', require('./routes/api/employees'))

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
