const express = require('express');
const formData = require("express-form-data");

const PORT = process.env.PORT || 3000;
const API_ENDPOINT = process.env.API_ENDPOINT || '';

const { User, Book } = require('./models');

const store = {
  user: null,
  users: [
    { id: 1, mail: 'test@mail.ru' },
  ],
  books: [],
};

const app = express();

app.use(formData.parse());

app.post(`${process.env.API_ENDPOINT}user/login`, (req, res) => {
  const { users } = store;
  const { mail } = req.body;
  const user = users.find(b => b.mail === mail);

  if (mail) {
    if (user) {
      store.user = user;
      res.status(201);
      res.json(user);
    } else {
      res.status(404);
      res.json('User is not found');
    }
  } else {
    res.status(400);
    res.json('User mail is not found');
  }
});

app.get(`${API_ENDPOINT}books/`, (req, res) => {
  const { books } = store;

  res.json(books);
});

app.get(`${API_ENDPOINT}books/:id`, (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const book = books.find(b => b.id === id);

  if (book) {
    res.json(book);
  } else {
    res.status(404);
    res.json('Book is not found');
  }
});

app.post(`${API_ENDPOINT}books/`, (req, res) => {
  const { books } = store;
  const { title, description, authors, favorite, fileCover, fileName } = req.body;
  const book = new Book({
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
  });

  books.push(book);

  res.status(201);
  res.json(book);
});

app.put(`${API_ENDPOINT}books/:id`, (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName } = req.body;
  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex > -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      title: title === undefined ? books[bookIndex].title : title,
      description: description === undefined ? books[bookIndex].description : description,
      authors: authors === undefined ? books[bookIndex].authors : authors,
      favorite: favorite === undefined ? books[bookIndex].favorite : favorite,
      fileCover: fileCover === undefined ? books[bookIndex].fileCover : fileCover,
      fileName: fileName === undefined ? books[bookIndex].fileName : fileName,
    };
    res.json(books[bookIndex]);
  } else {
    res.status(404);
    res.json('Book is not found');
  }
});

app.delete(`${API_ENDPOINT}books/:id`, (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex > -1) {
    books.splice(bookIndex, 1);
    res.json(true);
  } else {
    res.status(404);
    res.json('Book is not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});