const express = require('express');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors = require('cors');
const app = express();
const port = process.env.PORT ||5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0b46zlg.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

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
  
    await client.connect();
  

    const mediaCollection = client.db('media').collection('mediaCollection');
    const aboutCollection = client.db('media').collection('aboutCollection');
    const commentCollection = client.db('media').collection('commentCollection');
   




    app.get('/comment/:id', async (req, res) => {
      const query = {postId:req.params.id};
      const cursor = commentCollection.find(query);
      const comments = await cursor.toArray();
      res.send(comments)
    })
    app.put('/comment/:id', async (req, res) => {
      const query = {postId:req.params.id};
      const cursor = commentCollection.find(query);
      const comments = await cursor.toArray();
      res.send(comments)
    })

    app.post('/comment',async(req,res)=>{
      const comment = req.body;
      const result = await commentCollection.insertOne(comment)
      res.send(result)
    })
 

    app.get('/media', async (req, res) => {
      const query = {};
      const cursor = mediaCollection.find(query);
      const medias = await cursor.toArray();
      res.send(medias)
    })

    app.get('/media/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const media = await mediaCollection.findOne(query);
      res.send(media)
    })


    app.post('/media',async(req,res)=>{
      const media = req.body;
      const result = await mediaCollection.insertOne(media)
      res.send(result)
    })

    app.get('/about/:email', async (req, res) => {
      const email = req.params.email;
      const user = await aboutCollection.findOne({ emailName: email })
    
      res.send(user)
    })

    app.put('/about/:email', async (req, res) => {
      const email = req.params.email;
      const update = req.body;
      const query = { emailName: email }
      const result = await aboutCollection.updateOne(query, { $set: update }, { upsert: false })
      res.send(result)
    })

    app.post('/about',async(req,res)=>{
      const about = req.body;
      const result = await aboutCollection.insertOne(about)
      res.send(result)
    })

  } finally {
    // Ensures that the client will close when you finish/error
 
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

