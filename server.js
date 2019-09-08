'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true }, function (err) {
  if (err) {
    console.log('DB Error connection')
  } else {
    console.log('Db successfully connected')
  }
});
const Schema = mongoose.Schema;
const urlSchema = new Schema({
  original_url: String
});

urlSchema.plugin(AutoIncrement, {inc_field: 'id'});

const Url = mongoose.model('urls', urlSchema)

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Project challenge
app.post('/api/shorturl/new', function(req, res) {
  const original_url = req.body.url
  const newUrl = new Url({ original_url })
  Url.save(function(err, data) {
    if (err) return res.json({error: "Erro saving data"})
    return res.json({
      short_url: newUrl.id,
      original_url
    })
  })
})

app.get('/api/shorturl', async function(req, res) {
  const urlList = await Url.find()
  res.json({urlList})
})

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log('Node.js listening ...');
});
