const connection = require("./connection.js");

let orm = {

    //insert (table, array of cols, array of values to update)
    insert: (table, cols, values) => {
        return new Promise((resolve, reject) => {
            let query = `INSERT INTO ?? (${cols.toString()}) VALUES (?)`;
            connection.query(query, [table, values], (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });
        })
    },

    //select all from table
    select: (selection, table) => {
        return new Promise((resolve, reject) => {
            let query = `SELECT ${selection.toString()} FROM ??`;
            connection.query(query, [table], (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });
        })
    },
    
    //join two tables
    doubleJoin: (selection, tOne, tTwo, key1, key2) => {
        return new Promise((resolve, reject) => {
            let query = `SELECT ${selection.toString()} FROM ${tOne} AS tOne
            JOIN ${tTwo} AS tTwo ON tOne.${key1}=tTwo.${key2};`
            connection.query(query, (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });
        })
    },

    allEmployeeData: () => {
        return new Promise((resolve, reject) => {
            let query = `SELECT tOne.id, tOne.first_name, tOne.last_name, tTwo.title, tTwo.salary, tThree.department, CONCAT(tFour.first_name, " ",tFour.last_name) AS manager
            FROM employees AS tOne
            LEFT JOIN roles AS tTwo ON tOne.role_id=tTwo.id
            LEFT JOIN departments AS tThree ON tTwo.department_id=tThree.id
            LEFT JOIN employees AS tFour ON tOne.manager_id=tFour.id;`
            connection.query(query, (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });
        })
    },
    
    //update value
    set: (table, newValues, criteria) => {
        return new Promise((resolve, reject) => {
            let query = `UPDATE ?? SET ? WHERE ?`;
            connection.query(query, [table, newValues, criteria], (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });
        })
    },

    //remove row
    remove: (table, field, criteria) => {
        return new Promise((resolve, reject) => {
            let query =`DELETE FROM ?? WHERE ??=?`;
            connection.query(query, [table, field, criteria], (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });
        })
    },

    end: () => {
        connection.end();
        process.exit();
    }
};

module.exports = orm;