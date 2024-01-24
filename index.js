const express = require('express')
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// automotive-store
// Md5IsZDCMq2lTB9y

// middlewere
app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://automotive-store:Md5IsZDCMq2lTB9y@cluster0.nruv7rx.mongodb.net/?retryWrites=true&w=majority";

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

    app.post('/products',async(req,res) =>{
        const newProduct = req.body;
        const result = await database.insertOne(newProduct);
        res.send(result);
    })

    app.get('/products',async(req,res) =>{
        const cursor = database.find();
        const result =await cursor.toArray();
        res.send(result);
    })
    app.get('/products/:brand',async(req,res) =>{
      const cursor = database.find(req.params);
      const result =await cursor.toArray();
      res.send(result);
    })
    app.get('/productDetails/:name',async(req,res) =>{
      const cursor =await database.findOne(req.params);
      res.send(cursor);
    })

    app.get('/',(req,res) =>{
        res.send('simple crud is running')
    })
    
    app.listen(port,() =>{
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

