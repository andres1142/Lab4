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
let id = 0;

//Gets all products
app.get('/api/products', (req, res) => {
    console.log("Getting products");
    res.send(productList);
});

//Gets individual product
app.get('/api/products/:id', (req, res) => {
    console.log('Getting product ' + req.params.id)
    const found = productList.find( element => Number(element.id ) === Number(req.params.id))

    if (found !== undefined) {
        res.send(found)
    } else {
        res.send('Unable to find product ' +  req.params.id)
    }
})

//Post new products
app.post('/api/products', (req, res) => {
    console.log("Creating an product");
    id =  id + 1;
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
    let removeIndex = productList.map( element => {
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


app.listen(3000, () => console.log('Server listening on port 3000!'));


