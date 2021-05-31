const { conn } = require('../connections/db')


const saveFrames = async function(frame) {
    const { pdu, dataContent } = frame

    function toJson(data) {
        return JSON.stringify(data)
    }
    //console.log(JSON.stringify(frame))
    conn.query(`INSERT INTO frames (pdu,dataContent) values ('${toJson(pdu)}','${toJson(dataContent)}')`);
}


module.exports = {
    saveFrames
}