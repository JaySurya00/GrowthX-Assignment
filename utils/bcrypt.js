const bcrypt = require('bcrypt');
const saltRounds = 10;


const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
};


const verifyPassword = async (givenPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(givenPassword, hashedPassword);
        return isMatch;
    } catch (err) {
        console.error('Error verifying password:', err);
        throw err;
    }
};

module.exports = { hashPassword, verifyPassword };
