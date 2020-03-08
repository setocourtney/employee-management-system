const connection = require("./connection.js");

function createQuestArray(num) {
    let array = [];
    for (i = 0; i < num; i++) {
        array.push("?");
    };
    return "(" + array.toString() + ")";
};

let orm = {
    //insert (table, array of cols, array of values to update)
    insert: (table, cols, values, cb) => {
        let query = `INSERT INTO ?? (${cols.toString()}) VALUES (${createQuestArray(values.length)})`;
        connection.query(query, [table, values], (err, data) => {
            if (err) throw err;
            cb(data);
        });
    }

    //select all from table
    
    //join all tables

    //update value

};


module.exports = orm;