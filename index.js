const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT|| 5000;

//middlewire
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mgijdnm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        const reviewCollection =client.db('movieReview').collection('reviews') ;

        app.get('/reviews', async(req, res) =>{
            const query = {}
            const cursor = reviewCollection.find(query);
            const reviewLists = await cursor.toArray();
            res.send(reviewLists);
        })
    }
    finally{

    }
}
run().catch(err => console.error(err));



app.get('/', (req, res) =>{
    res.send('movie review server is running');
});
app.listen(port, () =>{
    console.log(`The server is running on ${port}`);
});