const mongoose = require('mongoose');
const getSecret = require('../utils/getSecret');

const connectDB = async () => {
    try {
        const uri = getSecret('MONGODB_URI');
        if (!uri) {
            console.error('Error: MONGODB_URI is not defined');
            process.exit(1);
        }
        await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
