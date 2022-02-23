const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const API_ENDPOINT = process.env.API_ENDPOINT || '';

const loggerMiddleware = require('./middleware/logger');
const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const userApiRouter = require('./routes/api/user');
const bookApiRouter = require('./routes/api/book');
const bookRouter = require('./routes/book');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(loggerMiddleware);

app.use('/public', express.static(__dirname + '/public'));

app.use('/', indexRouter);
app.use('/books', bookRouter);

app.use(`${API_ENDPOINT}user`, userApiRouter);
app.use(`${API_ENDPOINT}books`, bookApiRouter);

app.use(errorMiddleware);

const UserDB = process.env.DB_USERNAME || 'root';
const PasswordDB = process.env.DB_PASSWORD || 'password';
const NameDB = process.env.DB_NAME || 'books_database';
const HostDb = process.env.DB_HOST || 'mongodb://localhost:27017/';

async function start() {
  try {
    await mongoose.connect(HostDb, {
      user: UserDB,
      pass: PasswordDB,
      dbName: NameDB,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();