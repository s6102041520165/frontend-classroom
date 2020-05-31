require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_CONNECT, { 
  useNewUrlParser: true,
  useUnifiedTopology: true ,
  useFindAndModify: false,
},() => {
  console.log('Connected to mongodb')
});

mongoose.connection.on("error", err => {
  console.log(err);
});

module.exports = mongoose
