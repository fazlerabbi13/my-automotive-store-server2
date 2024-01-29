const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');





// middlewere
app.use(
  cors({
    origin: ["http://localhost:5173", "https://automotive-160b6.web.app"],
    credentials: true,
  })
);
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nruv7rx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("automotiveDB").collection("automotiveProducts")
    const cartDatabase = client.db("automotiveCartDB").collection("automotiveCartProducts")
    // add and get api
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      const result = await database.insertOne(newProduct);
      res.send(result);
    })

    app.get('/products', async (req, res) => {
      const cursor = database.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    //  brand products api
    app.get('/products/:brand', async (req, res) => {
      const cursor = database.find(req.params);
      const result = await cursor.toArray();
      res.send(result);
    })
    // cart section server

    app.post('/carts', async (req, res) => {
      const newCart = req.body;
      const result = await cartDatabase.insertOne(newCart);
      res.send(result)
    })

    app.get('/carts', async (req, res) => {
      const cursor = cartDatabase.find();
      const result = await cursor.toArray()
      res.send(result)
    })
    // product details api
    app.get('/productDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await database.findOne(query);
      res.send(result);
     
    })
    // update product api
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await database.findOne(query);
      res.send(result);
    })

    app.put('/products/:id', async (req, res) => {
      const id =req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateProduct =req.body
      const product = {
        $set: {
          image:updateProduct.image,
          name:updateProduct.name,
          brand:updateProduct.brand,
          product:updateProduct.product,
          price:updateProduct.price,
          short:updateProduct.short
        }
      }
      const result = await database.updateOne(filter,product,options)
      res.send(result)
    })
    // delete cart product api
    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cartDatabase.deleteOne(query);
      res.send(result);
    })
    // server testing api
    app.get('/', (req, res) => {
      res.send('simple crud is running')
    })

    app.listen(port, () => {
      console.log(`simple crud is running on port ${port}`)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
 }
  run().catch(console.dir);
