const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.z8w3emk.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors())
app.use(express.json())


// coffeedbPractice
// hNPxGUL9S1879x6q
// console.log(process.env.USER)
// console.log(process.env.PASS)


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

        // const database = client.db('coffeesPractice') 
        // const coffeesCollection = database.collection("coffees")

        const coffeesCollection = client.db('coffeesPractice').collection('coffees')

        // first step create data. sent from client site to back-end and send from back-end to mongodb
        app.post('/coffees', async (req, res) => {
            const coffee = req.body;
            console.log(coffee)
            const result = await coffeesCollection.insertOne(coffee);
            res.send(result)
        })

        // second step find all array
        app.get('/coffees', async (req, res) => {
            const cursor = coffeesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // third step single id 
        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await coffeesCollection.findOne(query)
            res.send(result)
        })

        // forth step delete single data
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeesCollection.deleteOne(query)
            res.send(result)
        })

        // fifth step   
        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const coffee = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateCoffee = {
                $set: {
                    name: coffee.name,
                    quantity: coffee.quantity,
                    supplier: coffee.supplier,
                    taste: coffee.taste,
                    category: coffee.category,
                    details: coffee.details,
                    photo: coffee.photo,
                }
            };
            const result = await coffeesCollection.updateOne(filter,updateCoffee,options)
            res.send(result)
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


app.get('/', (req, res) => {
    res.send('Coffee store server is running')
})

app.listen(port, (req, res) => {
    console.log(`Coffee store server is running on PORT:${port}`)
})