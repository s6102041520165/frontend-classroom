const connect = require("../config/db");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: { type: String },
  line_group_Id: { type: String },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course' }
});

module.exports = connect.model('Group', GroupSchema);