const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.im4po.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const productCollection = client.db("kenakata").collection("products");
  const orderCollection = client.db("kenakata").collection("orders");

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/products", (req, res) => {
    productCollection.find({}).toArray((err, doc) => {
      res.send(doc);
    });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.delete("/deleteProduct/:id", (req, res) => {
    const productId = req.params.id;
    productCollection.deleteOne({ _id: ObjectID(productId) }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });
});

app.listen(process.env.DB_PORT || port);
