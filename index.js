const express = require('express')
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to ApplianceArena')
})

app.listen(port, () => {
  console.log(`ApplianceArena is running on port ${port}`)
})