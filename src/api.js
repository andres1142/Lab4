const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static('public'));

let productList = [];
let cart = [];
let id = 0


/**
 * All Products API interaction
 */

//Gets all products
app.get('/api/products', (req, res) => {
  console.log("Getting products");
  res.send(productList);
});

//Gets individual product
app.get('/api/products/:id', (req, res) => {
  console.log('Getting product ' + req.params.id)
  const found = productList.find(element => Number(element.id) === Number(req.params.id))

  if (found !== undefined) {
    res.send(found)
  } else {
    res.send('Unable to find product ' + req.params.id)
  }
})

//Post new products
app.post('/api/products', (req, res) => {
  console.log("Creating an product");
  id = id + 1;
  let newProduct = {
    id: id,
    name: req.body.name,
    price: req.body.price
  };
  productList.push(newProduct);
  res.send(newProduct);
});

//Deletes a product by id
app.delete('/api/products/:id', (req, res) => {
  console.log("Deleting item " + req.params.id);
  let id = parseInt(req.params.id);
  let removeIndex = productList.map(element => {
    return element.id;
  })
    .indexOf(id);
  if (removeIndex === -1) {
    res.status(404)
      .send("Sorry, that product ID doesn't exist");
    return;
  }
  productList.splice(removeIndex, 1);
  res.sendStatus(200);
});


/**
 *  Cart API interaction
 */

//Gets all products in the cart
app.get('/api/cart', (req, res) => {
  console.log("Getting products in the cart");
  console.log(cart)
  res.send(cart);
});



//Adds a product to the cart
app.post('/api/cart/:id', (req, res) => {
  console.log("Adding product to the cart");
  //Finds the product in the product array
  let toReturn = productList.find(element => Number(element.id) === Number(req.params.id))

  if (toReturn !== undefined) {
    //Checks if it already exists in the cart
    const foundItem = cart.find(element => Number(toReturn.id) === Number(element.id))
    if (foundItem !== undefined) {
      foundItem.quantity = Number(foundItem.quantity) + 1;
      res.send(foundItem)
    } else {
      let newCartItem = {
        id: Number(req.params.id),
        quantity: 1
      };
      cart.push(newCartItem);
      res.send(newCartItem)
    }
  } else {
    res.send('Unable to find product ' + req.params.id)
  }
});

//Changes the quantity of a product
app.put('/api/cart/:id/:quantity', (req, res) => {
  //finds item in the cart
  const foundProduct = cart.find(element => Number(element.id) === Number(req.params.id))
  if (foundProduct === undefined) {
    res.sendStatus(404)
  } else {
    foundProduct.quantity = Number(req.params.quantity)
    if (foundProduct.quantity === 0) {

      let removeIndex = cart.map(element => {
        return foundProduct.id;
      })
        .indexOf(id);
      cart.splice(removeIndex, 1);
    }
    res.status(200).send(foundProduct)
  }
})


//Deletes a product in the cart using an id
app.delete('/api/cart/:id', (req, res) => {

  console.log("Deleting item, " + req.params.id + ' from the cart');

  let removeItem = cart.find(element => Number(element.id) === Number(req.params.id))
  let removeIndex = cart.indexOf(removeItem)

  if (removeItem === undefined) {
    res.status(404)
      .send("Sorry, that product ID doesn't exist in");
    return;
  }
  cart.splice(removeIndex, 1);
  res.sendStatus(200);
});


app.listen(3000, () => console.log('Server listening on port 3000!'));