const bcrypt = require('bcryptjs');

// Function to hash a password
const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (err) {
        console.error(err);
        return null;
    }
};

// Example usage
const plainTextPassword = 'yourpassword';
hashPassword(plainTextPassword).then(hashed => {
    if (hashed) {
        console.log(`Hashed password: ${hashed}`);
    } else {
        console.log('Failed to hash password');
    }
});
