import { useState, useEffect } from 'react';
import axios from 'axios';
import Error from './components/Error'

import './App.css';

function App() {

  // setup state
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState([]);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      setError("error retrieving products: " + error);
    }
  }

  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/cart");
      setCart(response.data);
    } catch (error) {
      setError("error retrieving cart: " + error);
    }
  }

  const addCart = async (item) => {
    try {
      const response = await axios.post('/api/cart/' + item.id)
    } catch (error) {
      setError("error trying to remove item: " + error);
    }
  }

  const updateItemQuantity = async (item, newQuantity) => {
    try {
      const response = await axios.put('/api/cart/' + item.id + '/' + newQuantity)
    } catch (error) {
      setError("error trying to update item's quantity: " + error);
    }
  }

  const deleteCart = async (item) => {
    try {
      const response = await axios.delete('/api/cart/' + item.id)
    } catch (error) {
      setError("error trying to remove item: " + error);
    }
  }


  const addToCart = async (item) => {
    await addCart(item)
    await fetchCart()
  }

  const deleteFromCart = async (item) => {
    await deleteCart(item)
    await fetchCart();
  }

  const reduceQuantity = async (item) => {
    if (item.quantity - 1 !== 0) {
      await updateItemQuantity(item, item.quantity - 1)
    } else {
      await deleteCart(item);
    }
    await fetchCart();
  }

  const increaseQuantity = async (item) => {
    await updateItemQuantity(item, item.quantity + 1)
    await fetchCart();
  }


  // fetch ticket data
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);


  const formatCartItem = (element) => {
    const toReturn = products.find(n => Number(n.id) === Number(element.id));
    return toReturn.name + ',  ' + element.quantity
  }


  // render results
  return (
    <div className="App">

      <Error error={error} />
      <div className='lists_holder'>

        <div className='cart_list'>
          <h1>Cart</h1>
          {cart.map(item => (
            <div key={item.id}>
              <div className='cart_item_col'>
                {formatCartItem(item)}
              </div>
              <div className='cart_buttons_col'>
                <button onClick={e => increaseQuantity(item)}>+</button>
                <button onClick={e => reduceQuantity(item)}>-</button>
                <button onClick={e => deleteFromCart(item)}>Remove Item</button>
              </div>

            </div>
          ))}
        </div>

        <div className='product_list'>
          <h1>Products</h1>
          {products.map(element => (
            <div key={element.id}>
              <div>
                {element.name}, <i>{element.price}</i>
                <button onClick={e => addToCart(element)}>Add to cart</button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
