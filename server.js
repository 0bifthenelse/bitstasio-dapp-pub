const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(express.static('dist'));
app.use("/*", express.static('dist'));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
});

app.listen(port, () => {
  console.log('dapp running on port ' + port);
});