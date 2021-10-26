const CLP_PORT = process.env.npm_package_config_CLP_PORT
const CLP_REQ_FRAME = process.env.npm_package_config_CLP_REQ_FRAME

console.log("Porta CLP configurada -> " + CLP_PORT)
console.log("Frame de requisição configurado -> " +CLP_REQ_FRAME) //Sem Checksum
console.log("Para alterar essas configurações, acesse a propriedade config em package.json")


// ------------------ Jean Tesla -------------------- //
// ------------------ Jean Tesla -------------------- //
// ------------------ Jean Tesla -------------------- //


const HEX = 16
const DEC = 10

const { crc16 } = require('easy-crc');
const { disassembleFrame } = require('./src/frameDeconstructor')
const SerialPort = require('serialport');
const api = require('./src/connections/api');


const port = new SerialPort(CLP_PORT, {
    baudRate: 19200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1
});

// SOLICITANDO DADOS AO CLP
setInterval(function(){
    let reqFrame_array = [];
    // Obtém o frame de solicitação configurado e transforma em Buffer
    CLP_REQ_FRAME.split(' ').forEach(byte =>{
        reqFrame_array.push(byte)
    })
    const checksum = crc16('MODBUS', reqFrame_array).toString(HEX);
    reqFrame_array.push(parseInt(checksum.substring(2, 4).toString(DEC), HEX))
    reqFrame_array.push(parseInt(checksum.substring(0, 2).toString(DEC), HEX))
    port.write(new Buffer.from(reqFrame_array))
},1000)


// --- A --- //
port.on('readable', function () {
    const frame = port.read();
    console.log(disassembleFrame(frame));
});

// --- E --- //
let countObtainedTx = 0;

function showTx(frame) {
    let stringBuffer = '';
    frame.forEach(element => {
        stringBuffer += element.toString(16) + ' '
    });
    console.log(`${++countObtainedTx}  |  ${stringBuffer}`)
}
