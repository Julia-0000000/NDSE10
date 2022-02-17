const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const API_ENDPOINT = process.env.API_ENDPOINT || '';

const loggerMiddleware = require('./middleware/logger');
const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const userApiRouter = require('./routes/api/user');
const bookApiRouter = require('./routes/api/book');
const bookRouter = require('./routes/book');

const app = express();

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});