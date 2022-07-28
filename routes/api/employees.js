const express  = require('express');
const router = express.Router();
const path = require('path');

const employeesControllers = require('../../controllers/employeesControllers')

const data = {};
data.employees = require('../../models/employees.json')

router.route('/')
  .get(employeesControllers.getAllEmployees)
  .post(employeesControllers.addAnEmployee)
  .put(employeesControllers.updateEmployee)
  .delete(employeesControllers.deleteEmployee);
  

router.route('/:id')
  .get(employeesControllers.getAnEmployee)

module.exports = router;