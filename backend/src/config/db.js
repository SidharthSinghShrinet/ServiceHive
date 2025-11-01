const mongoose = require('mongoose');

const connectDB = async () => {
    let client = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected with:",client.connection.host);
}

module.exports = connectDB;