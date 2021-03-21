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

app.get('/manifest/:rover', async (req, res) => {
  const rover = req.params.rover;
  try {
    let manifest = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ manifest });
  } catch (err) {
    console.log('error:', err);
  }
});

app.get('/photos/:rover/:max_sol', async (req, res) => {
  const rover = req.params.rover;
  const maxSol = req.params.max_sol;
  try {
    let photos = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${maxSol}&page=1&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ photos });
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
