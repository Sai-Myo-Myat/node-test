const userDB = {
  users: require('../model/users.json'),
  setUsers:  function (data) {this.users = data}
}

const fsPromises = require('fs').promises;
const path  = require('path');
const bcrypt = require('bcrypt');

const registerController = async (req,res) => {
  const {user, pwd} = req.body;
  if(!user || !pwd) return res.status(400).json({"message": "UsserName and Password are required"});
  const duplicate = userDB.users.find(person => person.username === user) 
  if(duplicate){
    console.log(duplicate)
    return res.status(409).json({"message": "this username is already exited"})
  };
  try{
    //encrypt the pwd
    const hashedPwd = await bcrypt.hash(pwd,10);
    //create new user
    const newUser = {username: user, pwd: hashedPwd};

    userDB.setUsers([...userDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(userDB.users)
    )
    res.status(201).json({"message": "You  registered"})
    console.log(userDB.users, "this is duplicated",duplicate)
  }catch (err) {
    console.log(err)
    res.status(500).json("something went wrong")
  }
}  

module.exports = {registerController}

