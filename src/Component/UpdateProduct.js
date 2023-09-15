import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

function UpdateProduct() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch the list of products from Firestore when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productCollectionRef = collection(db, 'ProductData');
        const querySnapshot = await getDocs(productCollectionRef);

        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchProducts();
  }, []);

  // Function to update product quantity in Firestore and local state
  const updateQuantity = async (productId, change) => {
    try {
      // Update the actual quantity in Firestore
      const productRef = doc(db, 'ProductData', productId);
      await updateDoc(productRef, {
        quantity: increment(change), // Increment or decrement the quantity
      });

      // Then update the local state with the new quantity
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId && product.quantity + change >= 0
            ? { ...product, quantity: product.quantity + change }
            : product
        )
      );
    } catch (error) {
      console.error(`Error ${change > 0 ? 'incrementing' : 'decrementing'} quantity: `, error);
    }
  };

  // Function to handle changes in the search input
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter the products based on the search query
  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Product List</h2>
      <input
        style={{ width: '20%', marginBottom: '16px' }}
        type="text"
        placeholder="Search by product name"
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      {searchQuery ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>
                  <button onClick={() => updateQuantity(product.id, -1)}>-</button>
                  {product.quantity}
                  <button onClick={() => updateQuantity(product.id, 1)}>+</button>
                </td>
                <td>{product.description}</td>
                <td>
                  <img src={product.imageUrl} alt={product.name} width="100" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

export default UpdateProduct;
