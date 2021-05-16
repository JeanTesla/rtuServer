// ------------------ Jean Tesla -------------------- //
// ------------------ Jean Tesla -------------------- //
// ------------------ Jean Tesla -------------------- //

const HEX = 16
const DEC = 10

const { crc16 } = require('easy-crc');
const dataDictionary = require('./dataDictionary');
const SerialPort = require('serialport');
const port = new SerialPort('COM12', {
    baudRate: 19200,
});

// --- A --- //
port.on('readable', function () {
    const frame = port.read();
    disassembleFrame(frame, rxRes);
})
// --- B --- //
function setStateMachine(frame) {
    const idMaquina = frame[0];
    const velocidadeMaquina = frame[4] + frame[5];
    (dataDictionary[idMaquina]).velocidade = velocidadeMaquina
}

// --- C --- //
function rxRes(brokenFrame, base = HEX) {
    const rf = brokenFrame
    let resFrame_array = [];
    //console.log(checksum.toString(16))
    resFrame_array.push(parseInt(rf.adress, 16))
    resFrame_array.push(parseInt(rf.function, 16))
    resFrame_array.push(parseInt(rf.dataAdress[0], 16))
    resFrame_array.push(parseInt(rf.dataAdress[1], 16))
    resFrame_array.push(parseInt(rf.numberOfRegisters[0], 16))
    resFrame_array.push(parseInt(rf.numberOfRegisters[1], 16))
    const checksum = crc16('MODBUS', resFrame_array).toString(HEX);
    resFrame_array.push(parseInt(checksum.substring(0, 2).toString(DEC), HEX))
    resFrame_array.push(parseInt(checksum.substring(2, 4).toString(DEC), HEX))
    
    port.write(new Buffer.from(resFrame_array))
}

// --- D --- //
function disassembleFrame(frame, resCallback) {
    let brokenFrame;
    if (frame instanceof Buffer) {
        const countBytes = frame.length;
        const arrayBytes = Object.values(frame);
        const arrayDisregardIndices = [0, countBytes - 2, countBytes - 1];
        let pdu = [];
        let arrayBytes_dataContent = []

        arrayBytes.forEach((byte, i) => {
            // --- 1 --- //
            if (!arrayDisregardIndices.includes(i)) {
                pdu.push(byte.toString(16));
            }
            // --- 2 --- //
            if (i > 6 && i < countBytes - 2) {
                arrayBytes_dataContent.push(byte.toString(16))
            }
        });

        // --- 3 --- //
        const limitBytesPerContent = 2;
        // --- 4 --- //
        let dataContent = [];
        const dataContentLength = (arrayBytes_dataContent.length / limitBytesPerContent);
        let countToPushDataContent = 1;
        while (countToPushDataContent <= dataContentLength) {
            dataContent.push(arrayBytes_dataContent.slice(0, limitBytesPerContent))
            for (let i = 1; i <= limitBytesPerContent; i++) {
                arrayBytes_dataContent.shift()
            }
            countToPushDataContent++;
        }
        // --- 5 --- //
        brokenFrame = {
            adress: frame[0].toString(HEX),
            function: frame[1].toString(HEX),
            dataAdress: [frame[2].toString(HEX), frame[3].toString(HEX)],
            numberOfRegisters: [frame[4].toString(HEX), frame[5].toString(HEX)],
            byteCount: frame[6].toString(HEX),
            dataContent,
            pdu,
            checksum: [frame[countBytes - 2].toString(HEX), frame[countBytes - 1].toString(HEX)],
            countBytesPda: countBytes,
            countBytesPdu: pdu.length,
            originFrame: frame
        }
    } else {
        brokenFrame = {};
    }
    resCallback(brokenFrame)
}

// --- E --- //
let countObtainedTx = 0;
function showTx(frame) {
    let stringBuffer = '';
    frame.forEach(element => {
        stringBuffer += element.toString(16) + ' '
    });
    console.log(`${++countObtainedTx}  |  ${stringBuffer}`)
}