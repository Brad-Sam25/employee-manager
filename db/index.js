const connection = require("./connection");

class DB {
  // Keeping a reference to the connection on the class in case we need it later
  constructor(connection) {
    this.connection = connection;
  }

  // Find all employees, join with roles and departments to display their roles, salaries, departments, and managers
  findAllEmployees() {
    let query = "SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.department_name ";
    query+= "FROM employee ";
    query+= "LEFT JOIN roles ON role_id = roles.id ";
    query+= "LEFT JOIN department ON department_id = department.id ";
    query+= "ORDER BY employee.id";
    return this.connection.query(
      query
    );
  }

  // Find all employees except the given employee id
  findAllPossibleManagers(employeeId) {
    return this.connection.query(
      "SELECT id, first_name, last_name FROM employee WHERE id != ?",
      employeeId
    );
  }

  // Create a new employee
  createEmployee(employee) {
    return this.connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?,?,?,?)", [employee.first_name, employee.last_name, employee.roleId, employee.manager_id]);
  }


  // Update the given employee's role
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.query(
      // YOUR CODE HERE
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [roleId, employeeId]
    );
  }

  // Update the given employee's manager
  updateEmployeeManager(employeeId, managerId) {
    return this.connection.query(
      "UPDATE employee SET manager_id = ? WHERE id = ?",
      [managerId, employeeId]
    );
  }

  // Find all roles, join with departments to display the department name
  findAllRoles() {
    let query = "SELECT roles.id, roles.title, roles.salary, department.department_name ";
    query+= "FROM roles ";
    query+= "LEFT JOIN department ON department_id = department.id ";
    query+= "ORDER BY roles.id";
    return this.connection.query(
      query
    );
  }

  // Create a new role
  createRole(role) {
    return this.connection.query(
      "INSERT INTO roles (title, salary, department_id) values (?,?,?)", [role.title, role.salary, role.department_id]
      );
  }


  // Find all departments, join with employees and roles and sum up utilized department budget
  findAllDepartments() {
    return this.connection.query(
      "SELECT department.id, department.department_name, SUM(roles.salary) AS utilized_budget FROM department LEFT JOIN roles ON roles.department_id = department.id LEFT JOIN employee ON employee.role_id = roles.id GROUP BY department.id, department.department_name"
    );
  }

  // Create a new department
  createDepartment(department) {
    return this.connection.query(
      "INSERT INTO department (department_name) values (?)", [department.name]
    );
  }

  // Find all employees in a given department, join with roles to display role titles
  findAllEmployeesByDepartment(departmentId) {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id WHERE department.id = ?;",
      departmentId
    );
  }

  // Find all employees by manager, join with departments and roles to display titles and department names
  findAllEmployeesByManager(managerId) {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, department.department_name AS department, roles.title FROM employee LEFT JOIN roles on roles.id = employee.role_id LEFT JOIN department ON department.id = roles.department_id WHERE manager_id = ?;",
      managerId
    );
  }
}

module.exports = new DB(connection);
