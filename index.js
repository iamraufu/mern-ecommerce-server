const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: false }), cors(
    // {
    //     origin: 'http://localhost:3000',
    // }
))

const port = 4000;

app.get('/', (req, res) => {
  res.send('Welcome to The Backend of MERN E-Commerce!')
})

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ohxhr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  const paidCollection = client.db("MERN_E-Commerce").collection("Paid");
  const failedCollection = client.db("MERN_E-Commerce").collection("Failed");
  const ordersCollection = client.db("MERN_E-Commerce").collection("Orders");
  const usersCollection = client.db("MERN_E-Commerce").collection("Users");
  const productsCollection = client.db("MERN_E-Commerce").collection("Products");
  const cartsCollection = client.db("MERN_E-Commerce").collection("Carts");
  const reviewsCollection = client.db("MERN_E-Commerce").collection("Reviews");


  // post paid collection 
  app.post('/paid', async (req, res) => {

    const { cus_name, cus_email, cus_phone, pg_card_bank_name, pay_status, card_number, card_holder, ip_address, amount, mer_txnid, pay_time, card_type, opt_a, opt_b, opt_c } = req.body;

    console.log(req.body);

    const paymentDetails = {
      pay_status,
      cart: opt_c,
      payment_type: opt_b,
      address: opt_a,
      payment_mode: card_type,
      purchased: pay_time,
      amount,
      name: cus_name,
      email: cus_email,
      phone: cus_phone,
      transaction_id: mer_txnid,
      ip_address,
      bank_name: pg_card_bank_name,
      card_number,
      card_holder
  }
    paidCollection.insertOne(paymentDetails, (err) => {
      err ?  console.log(err) : res.redirect('http://localhost:3000/profile');
    })
  })

  // get paid collection
  app.get('/paid', async (req, res) => {
    paidCollection.find({}).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // get paid collection by id
  app.get('/paid/:id', async (req, res) => {
    const { id } = req.params;
    paidCollection.find({ _id: ObjectId(id) }).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  //  update paid collection by id
  app.put('/paid/:id', async (req, res) => {
    const { id } = req.params;
    const { cus_name, cus_email, cus_phone, pg_card_bank_name, pay_status, card_number, card_holder, ip_address, amount, mer_txnid, pay_time, card_type, opt_a, opt_b, opt_c } = req.body;

    const paymentDetails = {
      pay_status,
      cart: opt_c,
      payment_type: opt_b,
      address: opt_a,
      payment_mode: card_type,
      purchased: pay_time,
      amount,
      name: cus_name,
      email: cus_email,
      phone: cus_phone,
      transaction_id: mer_txnid,
      delivery_status,
      ip_address,
      bank_name: pg_card_bank_name,
      card_number,
      card_holder
  }

    paidCollection.updateOne({ _id: ObjectId(id) }, { $set: paymentDetails }, (err) => {
      err ? console.log(err) : res.redirect('http://localhost:3000/profile');
    })
  })

// delete all paid collection
  app.delete('/paid', async (req, res) => {
    paidCollection.deleteMany({}, (err) => {
      err ? console.log(err) : res.redirect('http://localhost:3000/profile');
    })
  })

  // post failed payment collection
  app.post('/failed', async (req, res) => {
    const { cus_name, cus_email, cus_phone, pay_status, pg_card_bank_name, card_number, card_holder, ip_address, amount, mer_txnid, pay_time, card_type, opt_a, opt_b, opt_c } = req.body;

    const failedDetails = {
      pay_status,
      id_quantity: opt_c,
      payment_type: opt_b,
      address: opt_a,
      payment_mode: card_type,
      amount,
      name: cus_name,
      email: cus_email,
      phone: cus_phone,
      transaction_id: mer_txnid,
      ip_address,
      bank_name: pg_card_bank_name,
      card_number,
      card_holder
  }

    failedCollection.insertOne(failedDetails, (err) => {
      err ?  console.log(err) : res.redirect('http://localhost:3000/');
    })
  })

  // get failed payment collection
  app.get('/failed', async (req, res) => {
    failedCollection.find({}).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // get failed payment collection by id
  app.get('/failed/:id', async (req, res) => {
    const { id } = req.params;
    failedCollection.find({ _id: ObjectId(id) }).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // post orders collection
  app.post('/order', async (req, res) => {
    ordersCollection.insertOne(req.body, (err) => {
      err ?  console.log(err) : res.redirect('http://localhost:3000/order/:id');
    })
  })

  // get orders collection
  app.get('/orders', async (req, res) => {
    ordersCollection.find({}).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // get orders collection by id
  app.get('/order/:id', async (req, res) => {
    const { id } = req.params;
    ordersCollection.find({ _id: ObjectId(id) }).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // get orders collection by email
  app.get('/order/:email', async (req, res) => {
    const { email } = req.params;
    ordersCollection.find({ email }).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // post users collection
  app.post('/user', async (req, res) => {
    const users = req.body;
    usersCollection.insertOne(users, (err) => {
      err &&  console.log(err);
    })
  })

  // get users collection
  app.get('/users', async (req, res) => {
    usersCollection.find({}).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // get users collection by id
  app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    usersCollection.find({ _id: ObjectId(id) }).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // post products collection
  app.post('/products', async (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products, (err) => {
      err ?  console.log(err) : res.redirect('http://localhost:3000/products');
    })
  })

  // get products collection
  app.get('/products', async (req, res) => {
    productsCollection.find({}).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // get products collection by id
  app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    productsCollection.find({ _id: ObjectId(id) }).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // post carts collection
  app.post('/carts', async (req, res) => {
    const carts = req.body;
    cartsCollection.insertOne(carts, (err) => {
      err ?  console.log(err) : res.redirect('http://localhost:3000/carts');
    })
  })

  // get carts collection
  app.get('/carts', async (req, res) => {
    cartsCollection.find({}).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // get carts collection by id
  app.get('/carts/:id', async (req, res) => {
    const { id } = req.params;
    cartsCollection.find({ _id: ObjectId(id) }).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // post reviews collection
  app.post('/reviews', async (req, res) => {
    const reviews = req.body;
    reviewsCollection.insertOne(reviews, (err) => {
      err ?  console.log(err) : res.redirect('http://localhost:3000/reviews');
    })
  })

  // get reviews collection
  app.get('/reviews', async (req, res) => {
    reviewsCollection.find({}).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // get reviews collection by id
  app.get('/reviews/:id', async (req, res) => {
    const { id } = req.params;
    reviewsCollection.find({ _id: ObjectId(id) }).toArray((err, result) => {
      err ? console.log(err) : res.send(result);
    })
  })

  // get all collections
  app.get('/collections', async (req, res) => {
    const collections = [
      {
        name: 'orders',
        url: 'http://localhost:3000/orders'
      },
      {
        name: 'users',
        url: 'http://localhost:3000/users'
      },
      {
        name: 'products',
        url: 'http://localhost:3000/products'
      },
      {
        name: 'carts',
        url: 'http://localhost:3000/carts'
      },
      {
        name: 'reviews',
        url: 'http://localhost:3000/reviews'
      }
    ];
    res.send(collections);
  })

  err ? console.log(err) : console.log('Connected to MongoDB');

});


app.listen(port, () => {
  console.log(`MERN E-Commerce Backend is Running on port ${port}`);
})