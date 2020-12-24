# Employee Tracker  ![](https://img.shields.io/badge/License-MIT-green)
  ## Table of Content
  * [Description](##Description)
  * [Installation Instructions](##Installation-Instructions)
  * [Usage Instructions](##Usage-Information)
  * [Contribution Guidelines](##Contribution-Guidelines)
  * [Test Instructions](##Test-Instructions)
  * [Questions](##Questions)
  
  ## Description
  This is a Node CLI program that allows the user to view, add, update, and delete elements in their database for employees, roles, and departments.

  ### Functionalities
  * View 
    * View all departments
    * View all roles
    * View all employees
    * View employees by manager
    * View the total utilized budget of a department
  * Add
    * Add a department
    * Add a role
    * Add an employee
  * Update
    * Update an employee's role
    * Update an employee's manager
  * Delete
    * Delete a department (this will delete the roles and employees associated with that department)
    * Delete a role (this will delete the employees associated with that role)
    * Delete an employee


  ## Installation Instructions
  Do a git pull command at this [github repo](https://github.com/alzcheng/employee-tracker) to a local folder.  Open mySQL workbench and use the schema.sql to generate the database.  Modify the connection code to connect to the local sql database.

  ## Usage Information
  Open the terminal in the folder containing app.js.  Type node app.js in the terminal to start the program. 

  ## Contribution Guidelines
  The contributions for this project is subjected to [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md). 

  ## Test Instructions
  Use the seed.sql file to generate a sample database in the mySQL.  Use this database for testing of the interactions between the program and the sql database. 

  ## License
  This project and the application(s) hereinto is(are) covered under the MIT License.  
  
  ## Questions
  For any questions about this project, please first visit my Github repo [here](https://github.com/alzcheng). 
  If the answers are not found in my repo, you can email me directly at <albertzcheng@gmail.com>.
