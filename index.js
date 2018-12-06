const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const tasks = require('./controller/tasks');
const users = require('./controller/users');
const jwt = require('jsonwebtoken');
const models = require('./models');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  if (req.header('x-auth')) {
    let token = req.header('x-auth');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (err) {
      return res.status(401).send(err);
    }
    models.User.findById(decoded.id).then(user => {
      req.user = user;
      next();
    });
  } else {
    next();
  }
});

app.use('/tasks', tasks);
app.use('/users', users);

app.listen(process.env.PORT);
