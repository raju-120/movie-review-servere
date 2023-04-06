const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT|| 5000;

//middlewire
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.e80rczo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{

        const reviewCollections = client.db('movieReviews').collection('reviews');
        const commentsCollections = client.db('movieReviews').collection('comments');

        app.get('/reviewLists', async (req, res) =>{
            const query = {};
            const cursor = reviewCollections.find(query);
            const reviewLists = await cursor.toArray();
            res.send(reviewLists);
        });

        app.get('/reviewLists/:id', async(req, res) =>{
            const _id = req.params.id;
            const query = { _id: new ObjectId(_id) };
            const reviewList =  await reviewCollections.findOne(query);
            console.log(reviewList);
            console.log(_id);
            res.send(reviewList);
        })

        //Comments API
        app.get('/comments', async(req, res) =>{
            
            let query = {};
            if(req.query.email){
                query= {
                    email: req.query.email
                }
            }
            const cursor = commentsCollections.find(query);
            const comments = await cursor.toArray();
            res.send(comments);
        });
        
        app.post('/comments', async(req, res) =>{
            const comments = req.body;
            const result = await commentsCollections.insertOne(comments);
            res.send(result);

        })
    }
    finally{}
}
run().catch(err => console.error(err));


app.get('/', (req, res) =>{
    res.send('movie review server is running');
});
app.listen(port, () =>{
    console.log(`The server is running on ${port}`);
});