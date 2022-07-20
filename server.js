const express = require('express');
const app = express();
const port = 3002;
const cors = require('cors');

app.use(express.static('dist'));
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.listen(port, () => {
  console.log('dapp running on port ' + port);
});