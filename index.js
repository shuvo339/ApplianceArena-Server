const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v8mpgvp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    //   await client.connect();
    const appliancesCollection = client.db('applianceDB').collection('products');

  //pagination and search products api
   app.get('/products', async(req,res)=>{
    const search = req.query.search;
    const sort = req.query.sort || '';
    const page = parseInt(req.query.page);
    let newpage=0;
    if(page===0){
     newpage = page;
    }else{
     newpage=page-1;
    }
    const size = parseInt(req.query.size);
 
    let query = {
      productName: { $regex: search, $options: 'i' },
    }

    let sortOption = {};
      if (sort && sort === 'low') {
        sortOption['price'] = 1;
        const result = await appliancesCollection.find(query).sort(sortOption).toArray();
        return res.send(result);
      }
      if (sort && sort === 'high') {
        sortOption['price'] = -1;
        const result = await appliancesCollection.find(query).sort(sortOption).toArray();
        return res.send(result);
      }
      if (sort && sort === 'new') {
        sortOption['creationDate'] = -1;
        const result = await appliancesCollection.find(query).sort(sortOption).toArray();
        return res.send(result);
      }
      else if (sort) {
        sortOption[sort] = -1;
      }

     const result = await appliancesCollection.find(query)
    .skip(newpage*size)
    .limit(size)
    .sort(sortOption)
    .toArray();
    res.send(result)
  })

      // Send a ping to confirm a successful connection
    //   await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to ApplianceArena')
})

app.listen(port, () => {
  console.log(`ApplianceArena is running on port ${port}`)
})