const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

//Function to check if the user is authenticated
const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("isbn: " + req.params.isbn);
  let book = books[req.params.isbn];

  if(book !== undefined){
    // Check if the username and description are provided
    if (req.session.authorization.username && req.body) {
      // Add or update the review for the book
      book.reviews[req.session.authorization.username] = req.body.review;
      return res.status(200).json({ message: "Review added successfully.", reviews: books[req.params.isbn].reviews });
    } else {
        return res.status(400).json({ message: "Username and description are required." });
    }
  }

  return res.status(404).json("Not found");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  console.log("isbn: " + req.params.isbn);
  let book = books[req.params.isbn];

  if(book !== undefined && book.reviews[req.session.authorization.username] !== undefined){
    delete book.reviews[req.session.authorization.username];
    return res.status(200).json({ message: "Review deleted successfully."});
  }

  return res.status(404).json("Not found");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
