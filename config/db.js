const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
    });
    console.log(`MongodDB connected: ${conn.connection.host}`);
  } catch (err) {
     console.error(err);
     process.exit(1)
  }
};

module.exports = connectDB