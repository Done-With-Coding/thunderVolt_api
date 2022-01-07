require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

require("./db/conn.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
app.use(morgan('dev'));


const {station} = require('./routes');

app.use("/station/", station);

app.listen(3000, () => {
    console.log('App listening on port 3000');
  });
