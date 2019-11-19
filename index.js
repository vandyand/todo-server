const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = process.env.PORT || 4001


const MongoDb = require('mongodb')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://vandyand:u2LAPxFaYkzysmso@cluster0-thvmu.mongodb.net/tvdemodb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.json())
app.use(cors())

app.get('/lists', (req, res) => {
    console.log('get called!')
    client.connect(err => {
        if(err) res.send(err)
        client.db('tododb')
        .collection('todolists')
        .find().toArray()
        .then(r => res.send(r))
        .catch(err => console.log(err))
    })
})

app.get('/items', (req, res) => {
    console.log('get called!')
    client.connect(err => {
        if(err) res.send(err)
        client.db('tododb')
        .collection('todoitems')
        .find().toArray()
        .then(r => res.send(r))
        .catch(err => console.log(err))
    })
})

app.post('/lists',(req, res) => {
    console.log('post called!')
    client.connect(err => {
        if(err) res.send(err)
        client.db('tododb')
        .collection('todolists')
        .insertOne(req.body)
        .then(r => res.send(r.ops))
        .catch(err => console.log(err))
    })
})

app.post('/items',(req, res) => {
    console.log('post called!')
    client.connect(err => {
        if(err) res.send(err)
        client.db('tododb')
        .collection('todoitems')
        .insertOne(req.body)
        .then(r => res.send(r.ops))
        .catch(err => console.log(err))
    })
})


app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`))


