const mongoose = require("mongoose");

const connect = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("mongodb connected host : ", conn.connection.host);
    return conn;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connect;
