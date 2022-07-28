const express  = require('express');
const router = express.Router();

const employeesControllers = require('../../controllers/employeesControllers')

router.route('/')
  .get(employeesControllers.getAllEmployees)
  .post(employeesControllers.addAnEmployee)
  .put(employeesControllers.updateEmployee)
  .delete(employeesControllers.deleteEmployee);
  

router.route('/:id')
  .get(employeesControllers.getAnEmployee)

module.exports = router;