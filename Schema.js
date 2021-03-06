const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: String,
    img: String,
  });
  
  const userSchema = new mongoose.Schema({
    email: String,
    books: [bookSchema],
  });
  
  const user = mongoose.model("User", userSchema);
        
  module.exports=user