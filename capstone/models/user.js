const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userschema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    blog_id: {
      type: String,
      required:true
    }
  },
);

const User = mongoose.model("users", userschema);
module.exports = User;
