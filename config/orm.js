const connection = require("./connection.js");

let orm = {
    //insert (table, array of cols, array of values to update)
    insert: (table, cols, values, cb) => {
        let query = "INSERT INTO ?? (?) VALUES ?";
        connection.query(query, [table, cols, values], (err, data) => {
            if (err) throw err;
            cb(data);
        });
    };

    //select all from table
    
    //join all tables

    //update value

};


module.exports = orm;