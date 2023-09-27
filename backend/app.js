const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Item = require('./model/Item');

const itemController = require('./controller/Item-controller');


const app = express();

const url = 'mongodb+srv://inventory:Inventory123@cluster0.hkszzdx.mongodb.net/inventory?retryWrites=true&w=majority';


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
  next();
});


app.post('/api/items', itemController.addItem);
app.put('/api/items/:id?', itemController.updateItem);
app.delete('/api/items/:id?', itemController.deleteItem);


app.get('/api/items', (req, res) => {
  Item.find()
    .then((inventoryData) => {
      res.status(200).json(inventoryData);
    })
    .catch((err) => {
      console.error('Error fetching inventory data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
