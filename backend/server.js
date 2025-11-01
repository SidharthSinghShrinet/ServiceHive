const app = require('./app');
const connectDB = require('./src/config/db');

connectDB().then(() => {
    app.listen(process.env.PORT, (err) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
    .catch((error) => {
        console.log("Error occurred while connecting to DB:", error);
        process.exit(1);
    })