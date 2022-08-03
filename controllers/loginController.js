const userDB = {
  users: require('../model/users.json'),
  setUsers:  function (data) {this.users = data}
}
const bcrypt = require('bcrypt')

const jwt  = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();
const fsPromises  = require('fs').promises;

const loginController =async (req,res) => {
  const {user, pwd} = req.body;
  if(!user || !pwd) return res.status(400).json({"message": "UsserName and Password are required"});
  const foundUser = userDB.users.find(person => person.username === user);
  console.log(foundUser)
  if(!foundUser) return res.status(401).json({"message": "you are not authorized"}) //unauthorized
  const match = await bcrypt.compare(pwd, foundUser.pwd);
  if(match) {
    const accessToken = jwt.sign(
      {"username": foundUser.username},
      process.env.ACCESS_SECRET_KEY,
      {expiresIn: "30s"}
    );
    const refreshToken = jwt.sign(
      {"username": foundUser.username},
      process.env.REFRESH_SECRET_KEY,
      {expiresIn: "1d"}
    );
      //saving refresh token with user
    const otherUsers = userDB.users.filter(person => person.username !== foundUser.username);
    const upgradeUser = { ...foundUser, refreshToken};
    userDB.setUsers([...otherUsers, upgradeUser]);
    await fsPromises.writeFile(
      path.join(__dirname, '..', "model", "users.json"),
        JSON.stringify(userDB.users)
    )
    //sending token to client
    res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
    res.json({accessToken});
  }else {
    res.status(401).end();
  }
}

module.exports = {loginController};