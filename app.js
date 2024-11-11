const express = require('express');
const app = express();
const port = 3001;
const logger = require('morgan');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const db = require('./app/db')

require("dotenv").config();
require("./app/services/cron/taskReminder"); // Menjalankan cron job

const handleErrorMiddleware = require('./app/middleware/handleError')
const userRouter = require('./app/api/auth/router')
const refreshTokenRouter = require('./app/api/userRefreshToken/router')
const taskRouter = require('./app/api/task/router')

app.use(cors()) //pastiin diatas router

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/', userRouter)
app.use('/api/', refreshTokenRouter)
app.use('/api/', taskRouter)

app.use(handleErrorMiddleware) //error dithrow ke handlerError lalu dihandle oleh middleware ini

app.use('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
