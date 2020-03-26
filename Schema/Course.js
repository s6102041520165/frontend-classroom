const connect = require("../config/db");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    unique: true,
    ref: 'User',
  },
  name: { type: String }
});

module.exports = connect.model('Course', CourseSchema);