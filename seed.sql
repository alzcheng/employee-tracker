INSERT INTO
    department (name) VALUE ("Engineering"),
    ("Finance"),
    ("Operations");

INSERT INTO
    role (title, salary, department_id) VALUE ("Engineer", 90000, 1),
    ("Engineer", 85000, 3),
    ("Accountant", 120000, 1),
    ("Accountant", 100000, 2),
    ("Accountant", 110000, 3);

INSERT INTO
    employee (first_name, last_name, role_id) VALUE ("Albert", "Cheng", 1);

INSERT INTO
    employee (first_name, last_name, role_id, manager_id) VALUE ("John", "Smith", 2, 1);


   