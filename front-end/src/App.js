import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  // setup state
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const fetchProducts = async() => {
    try {      
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch(error) {
      setError("error retrieving products: " + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchProducts();
  },[]);


  // render results
  return (
    <div className="App">
      {error}
      <h1>Products</h1>
      {products.map( element => (
        <div key={element.id}>
          <div>
            <h4>{element.name}, <i>{element.price}</i></h4> 
          </div>
        </div>
      ))}     
    </div>
  );
}

export default App;
