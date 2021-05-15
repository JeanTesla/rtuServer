// ------------------ Jean Tesla -------------------- //
// ------------------ Jean Tesla -------------------- //
// ------------------ Jean Tesla -------------------- //

const { crc16 } = require('easy-crc');
const dataDictionary = require('./dataDictionary');
const SerialPort = require('serialport');
const port = new SerialPort('COM12', {
    baudRate: 19200,
});

// --- A --- //
port.on('readable', function () {
    const frame = port.read();
    console.log(disassembleFrame(frame));
})
// --- B --- //
function setStateMachine(frame) {
    const idMaquina = frame[0];
    const velocidadeMaquina = frame[4] + frame[5];
    (dataDictionary[idMaquina]).velocidade = velocidadeMaquina
}

// --- C --- //
function rxRes(frame) {
    const data = Buffer.from([01, 01, 00, 01, 00, 01]);
    checksum = crc16('MODBUS', data);
    console.log(checksum.toString(16))

    port.write([0x0001, 0x0003, 0x0002, 0x0000, 0x0003, 0x00f8, 0x0045]);
    return 0xFFFF;
}

// --- D --- //
function disassembleFrame(frame) {
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
        return {
            adress: frame[0].toString(16),
            function: frame[1].toString(16),
            dataAdress: [frame[2].toString(16), frame[3].toString(16)],
            numberOfRegisters: [frame[4].toString(16), frame[5].toString(16)],
            byteCount: frame[6].toString(16),
            dataContent,
            pdu,
            checksum: [frame[countBytes - 2].toString(16), frame[countBytes - 1].toString(16)],
            countBytesPda: countBytes,
            countBytesPdu: pdu.length
        }
    } else {
        return {};
    }
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