const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
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
// app.use(bodyParser.urlencoded({ extended: false }))

client.connect(err => {
    if (err) console.log(err)
    else console.log("Client connected!")
})

app.get('/lists', (req, res) => {
    console.log('get lists called!')
    client.db(dbName)
        .collection(listCollectionName)
        .find().toArray()
        .then(r => res.send(r))
        .catch(err => console.log(err))
})

app.get('/items', (req, res) => {
    console.log('get items called!')
    client.db(dbName)
        .collection(itemCollectionName)
        .find().toArray()
        .then(r => res.send(r))
        .catch(err => console.log(err))
})

app.post('/lists', (req, res) => {
    console.log('post list called!')
    if (Object.keys(req.body).length == 0) {
        res.send("Recieved empty body. Please include body with POST request.")
        console.log('POST request body is empty. Cannot process request.')
        return
    }
    client.db(dbName)
        .collection(listCollectionName)
        .insertOne(req.body)
        .then(r => res.send(r.ops))
        .catch(err => console.log(err))
})

app.post('/items', (req, res) => {
    console.log('post item called!')
    if (Object.keys(req.body).length == 0) {
        res.send("Recieved empty body. Please include body with POST request.")
        console.log('POST request body is empty. Cannot process request.')
        return
    }
    client.db(dbName)
        .collection(itemCollectionName)
        .insertOne(req.body)
        .then(r => res.send(r.ops))
        .catch(err => console.log(err))
})

app.put('/lists/', (req, res) => {
    console.log('put list called!')
    console.log('req.body:', req.body)

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
    console.log("query: ", query)
    console.log("update: ", update)
    console.log("options: ", options)
    client.db(dbName)
        .collection(listCollectionName)
        .updateOne(query, update, options)
        .then(r => res.send(r.ops))
        .catch(err => console.log(err))
})

app.put('/items/', (req, res) => {
    console.log('put items called!')
    console.log('req.body:', req.body)

    const query = { _id: MongoDb.ObjectId(req.body._id) }
    const update = {
        "$set": {
            name: req.body.name,
            desc: req.body.desc,
            due: req.body.due,
            isComplete: req.body.isComplete
        }
    }
    const options = {
        returnNewDocument: true
    }
    console.log("query: ", query)
    console.log("update: ", update)
    console.log("options: ", options)
    client.db(dbName)
        .collection(itemCollectionName)
        .updateOne(query, update, options)
        .then(r => res.send(r.ops))
        .catch(err => console.log(err))
})


app.delete('/lists/', (req, res) => {
    console.log('delete list called!')
    client.db(dbName)
        .collection(listCollectionName)
        .deleteOne({ _id: MongoDb.ObjectId(req.body._id) })
        .then(r => res.send(r.ops))
        .catch(err => console.log(err))
    client.db(dbName)
        .collection(itemCollectionName)
        .deleteMany({ list_id: req.body._id })
        .then(r => res.send(r.ops))
        .catch(err => console.log(err))
})


app.delete('/items/', (req, res) => {
    console.log('delete item called!')
    client.db(dbName)
        .collection(itemCollectionName)
        .deleteOne(req.body)
        .then(r => res.send(r.ops))
        .catch(err => console.log(err))
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./build'))

    app.get(*, () => {
        res.sendFile(path.join(__dirname,'build','index.html'))
    })
}

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`))


