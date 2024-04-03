const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors')
// console.log(process.env.MONGO_URI) // remove this after you've confirmed it is working
dotenv.config()

// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name

const dbName = 'passop';
const app = express()
app.use(cors())
const port = 3000
app.use(bodyParser.json())
client.connect();


// Get all the passwords
app.get('/', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.find({}).toArray();
  // console.log('Found documents =>', findResult);
  res.json(findResult)
})

// save a password
app.post('/', async (req, res) => {
const password = req.body
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.insertOne(password);
  // console.log('Found documents =>', findResult);
  res.send({success: true, result: findResult})
})


// Delete a password
app.delete('/', async (req, res) => {
  const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password);
    // console.log('Found documents =>', findResult);
    res.send({success: true, result: findResult})
  })


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})


// to run this file write in terminal: code --write server.js