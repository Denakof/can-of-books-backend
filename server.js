"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const app = express();
app.use(cors());

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 3001;

const bookSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: String,
});

const userSchema = new mongoose.Schema({
  email: String,
  books: [bookSchema],
});

const user = mongoose.model("User", userSchema);

function seedBookCollection() {
  const book1 = new user({
    email: "denakofahi_21@yahoo.com",
    books: [
      {
        name: "The Growth Mindset",
        description:
          "Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.",
        status: "FAVORITE FIVE", img:`https://m.media-amazon.com/images/I/61bDwfLudLL._AC_UL640_QL65_.jpg`
      },
      {
        name: "The Momnt of Lift",
        description:
          "Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.",
        status: "RECOMMENDED TO ME",   img: `https://m.media-amazon.com/images/I/71LESEKiazL._AC_UY436_QL65_.jpg`
        
      },
    ],
  });
  book1.save();
}
// seedBookCollection();

app.get("/books", getUser);

function getUser(req, res) {
  let inputEmail = req.query.inputEmail;
  // let {ownerName} = req.query
  user.find({ email: inputEmail }, function (error, userData) {
    if (error) {
      res.send("did not work");
    } else {
      res.send(userData[0].books);
    }
  });
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
