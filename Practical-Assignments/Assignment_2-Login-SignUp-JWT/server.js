'use strict';

//const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const User = require('./api/models/userModel');
const bodyParser = require('body-parser');
const jsonwebtoken = require("jsonwebtoken");
const routes = require('./api/routes/userRoutes');
const express = require('express');
const app = express();


const uri = "mongodb+srv://rishav1998:wpZXf12yZpVGDM5o@cluster0.gqrh0.mongodb.net/designlab?retryWrites=true&w=majority";

mongoose 
 .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

 app.use(express.static('public'))

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function (err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

routes(app);

app.use(function (req, res) {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  })
});

const port = process.env.PORT || 3000;
app.listen(port);

console.log(' RESTful API server started on: ' + port);

module.exports = app;