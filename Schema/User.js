const connect = require("../config/db");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  google_id: { type: String },
  line_id: { type: String },
  f_name: { type: String },
  l_name: { type: String },
});

module.exports = connect.model('User', UserSchema);
