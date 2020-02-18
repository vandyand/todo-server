const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = process.env.PORT || 4001


const MongoDb = require('mongodb')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://vandyand:u2LAPxFaYkzysmso@cluster0-thvmu.mongodb.net/tvdemodb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const dbName = 'tododb'
const listCollectionName = 'todolists'
const itemCollectionName = 'todoitems'

app.use(cors())
app.use(bodyParser.json())

app.get('/lists', (req, res) => {
    console.log('get lists called!')
    client.connect(err => {
        if (err) res.send(err)
        client.db(dbName)
            .collection(listCollectionName)
            .find().toArray()
            .then(r => res.send(r))
            .catch(err => console.log(err))
    })
})

app.get('/items', (req, res) => {
    console.log('get items called!')
    client.connect(err => {
        if (err) res.send(err)
        client.db(dbName)
            .collection(itemCollectionName)
            .find().toArray()
            .then(r => res.send(r))
            .catch(err => console.log(err))
    })
})

app.post('/lists', (req, res) => {
    console.log('post list called!')
    if (Object.keys(req.body).length == 0) {
        res.send("Recieved empty body. Please include body with POST request.")
        console.log('POST request body is empty. Cannot process request.')
        return
    }
    client.connect(err => {
        if (err) res.send(err)
        client.db(dbName)
            .collection(listCollectionName)
            .insertOne(req.body)
            .then(r => res.send(r.ops))
            .catch(err => console.log(err))
    })
})

app.post('/items', (req, res) => {
    console.log('post item called!')
    if (Object.keys(req.body).length == 0) {
        res.send("Recieved empty body. Please include body with POST request.")
        console.log('POST request body is empty. Cannot process request.')
        return
    }
    client.connect(err => {
        if (err) res.send(err)
        client.db(dbName)
            .collection(itemCollectionName)
            .insertOne(req.body)
            .then(r => res.send(r.ops))
            .catch(err => console.log(err))
    })
})

app.put('/lists/', (req, res) => {
    console.log('put list called!')

    const query = { _id: MongoDb.ObjectId(req.body._id) }
    const update = {
        "$set": {
            name: req.body.name,
            desc: req.body.desc
        }
    }
    const options = {
        returnNewDocument: true
    }
    client.connect(err => {
        if (err) res.send(err)
        client.db(dbName)
            .collection(listCollectionName)
            .findOneAndUpdate(query, update, options)
            .then(r => res.send(r.ops))
            .catch(err => console.log(err))
    })
})

app.put('/items/', (req, res) => {
    console.log('put items called!')

    const query = { _id: MongoDb.ObjectId(req.body._id) }
    const update = {
        "$set": {
            name: req.body.name,
            desc: req.body.desc,
            due: req.body.due
        }
    }
    const options = {
        returnNewDocument: true
    }
    client.connect(err => {
        if (err) res.send(err)
        client.db(dbName)
            .collection(itemCollectionName)
            .findOneAndUpdate(query, update, options)
            .then(r => res.send(r.ops))
            .catch(err => console.log(err))
    })
})


app.delete('/lists/', (req, res) => {
    console.log('delete list called!')
    client.connect(err => {
        if (err) res.send(err)
        client.db(dbName)
            .collection(listCollectionName)
            .deleteOne({ _id: MongoDb.ObjectId(req.body._id) })
            .then(r => res.send(r.ops))
            .catch(err => console.log(err))
    })
    client.connect(err => {
        if (err) res.send(err)
        client.db(dbName)
            .collection(itemCollectionName)
            .deleteMany({ list_id: req.body._id })
            .then(r => res.send(r.ops))
            .catch(err => console.log(err))
    })
})


app.delete('/items/', (req, res) => {
    console.log('delete list called!')
    client.connect(err => {
        if (err) res.send(err)
        client.db(dbName)
            .collection(itemCollectionName)
            .deleteOne(req.body)
            .then(r => res.send(r.ops))
            .catch(err => console.log(err))
    })
})


app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`))


