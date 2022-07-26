const {logEvents} = require('./logEvents');

const errHandler = (err,req,res,next) => {
  logEvents(`${err.name}: ${err.message}`,"errLogs.txt");
  res.status(500).send("Somethig went wrong")
  next()
}

module.exports = errHandler;