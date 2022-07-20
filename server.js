// require and initalize necessary connections
const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(routes);

//display msg using console log once app is "listeing"
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});