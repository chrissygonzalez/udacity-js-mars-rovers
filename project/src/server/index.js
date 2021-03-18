require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// your API calls
app.get('/curiosity', async (req, res) => {
  try {
    let photos = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=3060&page=1&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ photos });
  } catch (err) {
    console.log('error:', err);
  }
});

app.get('/opportunity', async (req, res) => {
  try {
    let photos = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=1000&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ photos });
  } catch (err) {
    console.log('error:', err);
  }
});

app.get('/spirit', async (req, res) => {
  try {
    let photos = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=1000&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ photos });
  } catch (err) {
    console.log('error:', err);
  }
});

app.get('/curiosity/manifest', async (req, res) => {
  try {
    let manifest = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ manifest });
  } catch (err) {
    console.log('error:', err);
  }
});

app.get('/opportunity/manifest', async (req, res) => {
  try {
    let manifest = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ manifest });
  } catch (err) {
    console.log('error:', err);
  }
});

app.get('/spirit/manifest', async (req, res) => {
  try {
    let manifest = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/manifests/spirit?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ manifest });
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
