INSERT INTO department (name) 
VALUE 
("Executive")
("Engineering"),
("Operations");

INSERT INTO role (title, salary, department_id) 
VALUE 
("CEO", 2000000, 1),
("CTO", 1500000, 1),
("COO", 1500000, 1),
("Eng Head", 150000,2)
("Ops Head", 150000,3)
("Engineer", 100000, 2),
("Operator", 90000, 3),
("Finance", 90000, 2),
("Finance", 90000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUE 
("Raj", "Batra", 1 , NULL),
("Kavi", "Karr", 2, 1), 
("Mani", "Word", 3, 1), 
("Murugan", "Sanders",4, 2), 
("Alpha","Kang", 5, 3), 
("Kannan","Gupta", 6, 4), 
("Albert", "Cheng", 7, 5),
("Winnie", "Zhang", 8, 4),
("Kyle", "Chan", 9, 5);