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

const euroFormatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
});

function convertEuroToCents(euroFormattedAmount) {
    // Remove the euro symbol and any thousand separators, and replace the decimal separator with a period
    const numericValue = parseFloat(euroFormattedAmount.replace(/[^\d.,-]/g, '').replace(',', '.'));
    // Convert the numeric value to cents
    const centsAmount = Math.round(numericValue * 100);
    return centsAmount;
}

function convertCentsToEuro(amountInCents) {
    // Divide the amount by 100 to convert it to euros
    const amountInEuros = amountInCents / 100;

    // Format the result as a string with comma as the decimal separator
    const euroFormattedAmount = amountInEuros.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return euroFormattedAmount;
}

module.exports = {generateSecureRandom, euroFormatter, convertEuroToCents, convertCentsToEuro};