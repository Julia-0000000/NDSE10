const express = require('express');
const router = express.Router();

const { Book } = require('../models');
const fileMiddleware = require('../middleware/file');

const store = {
  books: [],
};

router.get('/', (req, res) => {
  const { books } = store;

  res.json(books);
});

router.get('/:id', (req, res) => {
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

router.post('/', fileMiddleware.single('fileBook'), (req, res) => {
  const { books } = store;
  const { title, description, authors, favorite, fileCover } = req.body;
  console.log('f', req.file);
  console.log('req', req.files);
  //console.log('res', res);
  const book = new Book({
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName: req.file ? req.file.filename : '',
    fileBook: req.file ? req.file.path : '',
  });

  books.push(book);

  res.status(201);
  res.json(book);
});

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

router.get('/:id/download', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const book = books.find(b => b.id === id);

  if (book) {
    if (book.fileBook) {
      const filename = book.fileName.split('.');
      const fileExt = filename[filename.length - 1];
      res.download(`${__dirname}/../${book.fileBook}`, `${book.title}.${fileExt}`, err => {
        if (err) {
          res.status(404).json();
        }
      });
    } else {
      res.status(404);
      res.json('Book file is not exist');
    }
  } else {
    res.status(404);
    res.json('Book is not found');
  }
});

module.exports = router;