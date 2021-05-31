var mysql = require('mysql');

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rtuServer"
});

conn.connect(function(err) {
    if (err) console.log('** Não foi possível conectar ao banco. **');
    console.log("** Banco : OK! **");
});

module.exports = {
    conn
}