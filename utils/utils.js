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

const formatDate = (date) => {
    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
    };

    const formattedDate = new Intl.DateTimeFormat('en', options).format(date);
    console.log('formattedDate', formattedDate)
    return formattedDate;
}

module.exports = {generateSecureRandom, formatDate};