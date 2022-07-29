const userDB = {
  users: require('../model/users.json'),
  setUsers:  function (data) {this.users = data}
}
const bcrypt = require('bcrypt')

const loginController =async (req,res) => {
  const {user, pwd} = req.body;
  if(!user || !pwd) return res.status(400).json({"message": "UsserName and Password are required"});
  const foundUser = userDB.users.find(person => person.username === user);
  console.log(foundUser)
  if(!foundUser) return res.status(401).json({"message": "you are not authorized"}) //unauthorized
  const match = await bcrypt.compare(pwd, foundUser.pwd);
  if(match) {
    res.status(200).json({"message": "you have logged in"})
  }else {
    res.status(401).end();
  }
}

module.exports = {loginController};