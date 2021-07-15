"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const jwksClient = require("jwks-rsa");

const app = express();
app.use(cors());
app.use(express.json());
const mongoose = require("mongoose");
const { request } = require("express");

const user =require("./Schema")

mongoose.connect("mongodb://denakof:omaaaar@cluster0-shard-00-00.vmc54.mongodb.net:27017,cluster0-shard-00-01.vmc54.mongodb.net:27017,cluster0-shard-00-02.vmc54.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-5hkrwh-shard-0&authSource=admin&retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 3001;


function seedBookCollection() {
  const book1 = new user({
    email: "denakofahi@gmail.com",
    books: [
      {
        name: "The Growth Mindset",
        description:
          "Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.",
        status: "FAVORITE FIVE",
        img: `https://m.media-amazon.com/images/I/61bDwfLudLL._AC_UL640_QL65_.jpg`,
      },
      {
        name: "The Momnt of Lift",
        description:
          "Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.",
        status: "RECOMMENDED TO ME",
        img: `https://m.media-amazon.com/images/I/71LESEKiazL._AC_UY436_QL65_.jpg`,
      },
    ],
  });
  book1.save();
}

// seedBookCollection();

app.get("/", homePageHandler);

app.get("/books", getUser);

app.post("/addBook", addBookHandler);

app.delete("/deleteBook/:bookId", deleteBookHandler);

function getUser(req, res) {
  let inputEmail = req.query.inputEmail;
  // let {ownerName} = req.query
  user.find({ email: inputEmail }, function (error, userData) {
    if (error) {
      res.send("did not work");
    } else {
      console.log(userData[0].books);
      res.send(userData[0].books);
    }
  });
}

function addBookHandler(req, res) {
  console.log(req.body);
  let { name, description, status, img } = req.body;

  user.find({ email: req.query.inputEmail }, (error, ownerData) => {
    if (error) {
      res.send("cant find user");
    } else {
      console.log("before adding", ownerData);
      ownerData[0].books.push({
        name: name,
        description: description,
        status: status,
        img: img,
      });
      console.log("after adding", ownerData[0]);
      ownerData[0].save();
      res.send(ownerData[0].books);
    }
  });
}

function deleteBookHandler(req, res) {
  // console.log(req.params)
  // console.log(req.query)

  let index = Number(req.params.bookId);
  console.log(index);
  let inputEmail = req.query.inputEmail;
  user.find({ email: inputEmail }, (error, ownerData) => {
    if (error) {
      res.send("cant find user");
    } else {
      console.log("before deleting", ownerData[0].books);

      let newBooksArr = ownerData[0].books.filter((element, idx) => {
        if (idx !== index) {
          return true;
        }
        // return idx!==index
      });
      ownerData[0].books = newBooksArr;
      console.log("after deleting", ownerData[0].books);
      ownerData[0].save();
      res.send(ownerData[0].books);
    }
  });
}
app.post("/updateBook/:bookId", updateBookHandler);

function updateBookHandler(req, res) {
  let index = Number(req.params.bookId);
  console.log(req);
  let { name, description, status, img } = req.body;

  user.find({ email: req.query.inputEmail }, (error, ownerData) => {
    if (error) {
      res.send("cant find user");
    } else {
      ownerData[0].books.splice(index, 1, {
        name: name,
        description: description,
        status: status,
        img: img,
      });
      // console.log("after adding", ownerData[0]);
      ownerData[0].save();
      res.send(ownerData[0].books);
    }
  });
}

function homePageHandler(req, res) {
  res.send("all good");
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
