const { conn } = require('./connections/db')

class BugHunter {
    static saveError = function(exception) {
        conn.query(`INSERT INTO logerros (erro) values ("${exception}")`);
    }
}

module.exports = { BugHunter }