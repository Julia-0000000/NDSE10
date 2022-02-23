const express = require('express');
const router = express.Router();

const Book = require('../models/Book');
const fileMiddleware = require('../middleware/file');

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'text/plain'].join(', ');

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();

    res.render('book/index', {
      title: 'Books',
      books,
    });
  } catch (e) {
    console.error(e);
    res.status(404);
    res.redirect('/404');
  }
});

router.get('/create', (req, res) => {
  res.render('book/create', {
      title: 'Book | create',
      book: {},
      allowedTypes,
  });
});

router.post('/create', fileMiddleware.single('fileBook'), async (req, res) => {
  const { title, description, authors, favorite, fileCover } = req.body;
  const book = new Book({
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName: req.file ? req.file.filename : '',
    fileBook: req.file ? req.file.path : '',
  });

  try {
    await book.save();
    res.redirect('/books');
  } catch (e) {
    console.error(e);
  }
});

router.get('/update/:id', async (req, res) => {
  const { id } = req.params;
  let book;

  try {
    book = await Book.findById(id);
    res.render('book/update', {
      title: 'Book | update',
      book,
      allowedTypes,
    });
  } catch (e) {
    console.error(e);
    res.status(404).redirect('/404');
  }
});

router.post('/update/:id', fileMiddleware.single('fileBook'), async (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover } = req.body;

  try {
    await Book.findByIdAndUpdate(id, { title, description, authors, favorite, fileCover});
    res.redirect(`/books/${id}`);
  } catch (e) {
    console.error(e);
    res.status(404).redirect('/404');
  }
});

router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Book.deleteOne({ _id: id });
    res.redirect('/books');
  } catch (e) {
    console.error(e);
    res.status(404).redirect('/404');
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  let book;

  try {
    book = await Book.findById(id);
    res.render('book/view', {
      title: 'book | view',
      book,
    });
  } catch (e) {
    console.error(e);
    res.status(404).redirect('/404');
  }
});

router.get('/:id/download', async (req, res) => {
  const { id } = req.params;
  let book;

  try {
    book = await Book.findById(id);
    if (book.fileBook) {
      const filename = book.fileName.split('.');
      const fileExt = filename[filename.length - 1];
      res.download(`${__dirname}/../../${book.fileBook}`, `${book.title || 'book'}.${fileExt}`, err => {
        if (err) {
          res.status(404).json();
        }
      });
    } else {
      res.status(404);
      res.redirect('/404');
    }
  } catch (e) {
    console.error(e);
    res.status(404).redirect('/404');
  }
});

module.exports = router;