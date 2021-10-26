const HEX = 16;
const DEC = 10;

const disassembleFrame = function(frame) {
    let brokenFrame;
    try {
        if (!frame instanceof Buffer) throw new TypeError('O parâmetro passado não é um Buffer.')
        if (Buffer.from(frame).byteLength < 8) throw new RangeError('O Frame recebido não possui a quantidade de Bytes necessária para o funcionamento do script.')

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


    } catch (e) {
        throw new Error(e);
    }
    return brokenFrame;
}

module.exports = {
    disassembleFrame
}