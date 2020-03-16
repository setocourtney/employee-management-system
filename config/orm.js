const connection = require("./connection.js");

// function createQuestArray(num) {
//     let array = [];
//     for (i = 0; i < num; i++) {
//         array.push("?");
//     };
//     return array.join(", ");
// };

let orm = {

    //insert (table, array of cols, array of values to update)
    insert: (table, cols, values, cb) => {
        let query = `INSERT INTO ?? (${cols.toString()}) VALUES (?)`;
        connection.query(query, [table, values], (err, data) => {
            if (err) throw err;
            cb(data);
        });
    },

    //select all from table
    select: (selection, table, cb) => {
        let query = `SELECT ?? FROM ??`;
        connection.query(query, [selection.toString(), table], (err, data) => {
            if (err) throw err;
            cb(data);
        });
    },
    
    //join two tables
    doubleJoin: (selection, tOne, tTwo, key1, key2, cb) => {
        let query = `SELECT ${selection.toString()} FROM ${tOne} AS tOne
        JOIN ${tTwo} AS tTwo ON tOne.${key1}=tTwo.${key2};`
        connection.query(query, (err, data) => {
            if (err) throw err;
            cb(data);
        });
    },

    allEmployeeData: (cb) => {
        let query = `SELECT tOne.id, tOne.first_name, tOne.last_name, tTwo.title, tTwo.salary, tThree.department, CONCAT(tFour.first_name, " ",tFour.last_name) AS manager
        FROM employees AS tOne
        LEFT JOIN roles AS tTwo ON tOne.role_id=tTwo.id
        LEFT JOIN departments AS tThree ON tTwo.department_id=tThree.id
        LEFT JOIN employees AS tFour ON tOne.manager_id=tFour.id;`
        connection.query(query, (err, data) => {
            if (err) throw err;
            cb(data);
        });
    },
    
    getManagers: (cb) => {
        let query = `
        SELECT tOne.*, CONCAT(tTwo.first_name, " ",tTwo.last_name) AS manager 
        FROM employees AS tOne
        LEFT JOIN employees AS tTwo 
        ON tOne.manager_id=tTwo.id`;
        connection.query(query, (err, data) => {
            if (err) throw err;
            cb(data);
        });
    },

    //update value
    set: (table, newValues, criteria, cb) => {
        let query = `UPDATE ?? SET ? WHERE ?`;
        connection.query(query, [table, newValues, criteria], (err, data) => {
            if (err) throw err;
            cb(data);
        });
    },

    //remove row
    remove: (table, criteria, cb) => {
        let query =`DELETE FROM ?? WHERE ?`;
        connection.query(query, [table, criteria], (err, data) => {
            if (err) throw err;
            cb(data);
        });
    },

    end: () => {
        connection.end();
        process.exit();
    }
};


module.exports = orm;