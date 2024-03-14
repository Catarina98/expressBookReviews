const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Function to check if the user exists
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).json({message: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.status(300).json({message: books[req.params.isbn]});
 });

 function findBooks(books, filterFunction) {
   const foundBooks = {};
 
   for (const key in books) {
       if (books.hasOwnProperty(key)) {
           if (filterFunction(books[key])) {
               foundBooks[key] = books[key];
           }
       }
   }
 
   return foundBooks;
 }
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const booksByAuthor = findBooks(books, (book) => book.author === req.params.author);

  return res.status(300).json({message: booksByAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const booksByTitle = findBooks(books, (book) => book.title === req.params.title);

  return res.status(300).json({message: booksByTitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let book = books[req.params.isbn];

  if(book !== undefined){
    return res.status(300).json({reviews: books[req.params.isbn].reviews});
  }

  return res.status(404).json("Not found");
});

module.exports.general = public_users;
