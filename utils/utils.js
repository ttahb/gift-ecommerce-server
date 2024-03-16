const crypto = require('crypto');

const generateSecureRandom = (min, max) => {
    const range = max - min + 1;
    const byteLength = Math.ceil(Math.log2(range) / 8); 
    let randomValue;
    do {
        const byteArray = crypto.randomBytes(byteLength);
        randomValue = byteArray.readUIntBE(0, byteLength);
    } while (randomValue >= Math.pow(2, 8 * byteLength) - Math.pow(2, 8 * byteLength) % range);
    return min + randomValue % range;
}

module.exports = {generateSecureRandom};