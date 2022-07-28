const data = {
  employees: require('../model/employees.json'),
  setEmployees: function (data) {this.employees = data}
}

const getAllEmployees = (req,res) => {
  res.json(data.employees)
}

const addAnEmployee = (req,res,next) => {
  const newEmployee = {
    id: data.employees[data.employees.length -1].id +1,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }
  if(!newEmployee.firstName || !newEmployee.lastName) {
    return res.status(400).json({'message': "first and last names are required!!"})
  }
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees)
}

const updateEmployee = (req,res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
  if(!employee) {
    return res.status(400).json({"message": "Employee is not found with this id"})
  }
  if(req.body.firstName) employee.firstname = req.body.firstName;
  if(req.body.lastName) employee.lastname = req.body.lastName;
  const filteredEmployees = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
  const unSortedArray = [...filteredEmployees, employee];
  data.setEmployees(unSortedArray.sort((a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0 ))
  res.json(data.employees)
}

const deleteEmployee = (req,res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
  if(!employee) {
    return res.status(400).json({"message": `Employee id ${req.body.id} is not found!!`})
  };
  const filteredEmployees = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
  data.setEmployees([...filteredEmployees]);
  res.json(data.employees)
}


const getAnEmployee = (req,res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
  if(!employee) {
    return res.status(400).json({"message": `Employee id ${req.body.id} is not found!!`})
  };
  res.json(employee)
}

module.exports = {
  getAllEmployees,
  addAnEmployee,
  updateEmployee,
  deleteEmployee,
  getAnEmployee
}


