const getAllEmployees = (req,res) => {
  res.json(data.employees)
}

const addAnEmployee = (req,res) => {
  res.json(req.body)
}

const updateEmployee = (req,res) => {
  res.json({
    "firstName": req.body.firstName,
    "lastName": req.body.lastName
  })
}

const deleteEmployee = (req,res) => {
  res.json({id: req.body.id})
}

const getAnEmployee = (req,res) => {
  res.json({id: req.params.id})
}

module.exports = {
  getAllEmployees,
  addAnEmployee,
  updateEmployee,
  deleteEmployee,
  getAnEmployee
}


