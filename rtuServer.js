// ------------------ Jean Tesla -------------------- //
// ------------------ Jean Tesla -------------------- //
// ------------------ Jean Tesla -------------------- //
const HEX = 16
const DEC = 10

const { crc16 } = require('easy-crc');
const { BugHunter } = require('./src/bugHunter')
const { disassembleFrame } = require('./src/frameDeconstructor')
const testInterface = require('./src/customerInterfaces/testInterface');
const SerialPort = require('serialport');

const port = new SerialPort('COM12', {
    baudRate: 19200,
});

// --- A --- //
port.on('readable', function() {
    const frame = port.read();
    try {
        const brokenFrame = disassembleFrame(frame)
        if (rxRes(brokenFrame)) {
            testInterface.saveFrames(brokenFrame)
        }
    } catch (e) {
        console.log(e)
        BugHunter.saveError(e)
    }
});

// --- C --- //
function rxRes(brokenFrame, base = HEX) {
    const rf = brokenFrame
    let resFrame_array = [];
    //console.log(checksum.toString(16))
    resFrame_array.push(parseInt(rf.adress, base))
    resFrame_array.push(parseInt(rf.function, base))
    resFrame_array.push(parseInt(rf.dataAdress[0], base))
    resFrame_array.push(parseInt(rf.dataAdress[1], base))
    resFrame_array.push(parseInt(rf.numberOfRegisters[0], base))
    resFrame_array.push(parseInt(rf.numberOfRegisters[1], base))
    const checksum = crc16('MODBUS', resFrame_array).toString(HEX);
    resFrame_array.push(parseInt(checksum.substring(0, 2).toString(DEC), base))
    resFrame_array.push(parseInt(checksum.substring(2, 4).toString(DEC), base))

    return port.write(new Buffer.from(resFrame_array)); // True / False
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