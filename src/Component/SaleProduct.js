import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
  updateDoc,
  doc, // Import the updateDoc and doc functions
} from 'firebase/firestore';

function SaleProduct() {
  // State variables
  const [customerName, setCustomerName] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [date, setDate] = useState('');
  const [products, setProducts] = useState([]);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null); // Store the selected product

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productCollectionRef = collection(db, 'ProductData');
        const productsSnapshot = await getDocs(productCollectionRef);
        const productData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchProducts();
  }, []);

  // Update price, available quantity, and selected product when the product name changes
  useEffect(() => {
    const selectedProduct = products.find((product) => product.name === productName);
    if (selectedProduct) {
      setPrice(selectedProduct.price || 0);
      setAvailableQuantity(selectedProduct.quantity || 0);
      setSelectedProduct(selectedProduct); // Store the selected product
    }
  }, [productName, products]);

  // Calculate total price when quantity or price changes
  useEffect(() => {
    setTotalPrice(parseFloat(quantity) * parseFloat(price));
  }, [quantity, price]);

  // Format the date string
  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert quantity to a number
    const saleQuantity = parseInt(quantity);

    // Check if the sale quantity exceeds available quantity
    if (saleQuantity > availableQuantity) {
      alert('Sale quantity exceeds available quantity.');
      return;
    }

    try {
      // Add sale data to Firestore
      const salesCollectionRef = collection(db, 'SalesData');

      await addDoc(salesCollectionRef, {
        customerName,
        productName,
        quantity: saleQuantity,
        price: parseFloat(price),
        totalPrice,
        date: formatDate(date),
      });

      // Deduct sold quantity from the product list in Firestore
      const productRef = doc(db, 'ProductData', selectedProduct.id);
      await updateDoc(productRef, {
        quantity: availableQuantity - saleQuantity,
      });

      // Reset form fields
      setCustomerName('');
      setProductName('');
      setQuantity('');
      setPrice(0);
      setTotalPrice(0);
      setDate('');
      alert('Order submitted successfully');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="product-detail">
      <div className='Product'>
        <h1>Sale Product</h1>
        <form onSubmit={handleSubmit} className="sale-product-form">
          <div className="grid">
            {/* Form inputs */}
            <div className="field">
              <label htmlFor="customerName">Customer Name:</label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="productName">Product Name:</label>
              <select
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                value={price}
                readOnly // Make the price input read-only
              />
            </div>
            <div className="field">
              <label htmlFor="totalPrice">Total Price:</label>
              <input
                type="number"
                id="totalPrice"
                value={totalPrice}
                readOnly // Make the total price input read-only
              />
            </div>
            <div className="field">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn">Submit Sale</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SaleProduct;
