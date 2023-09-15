import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

function ProductList() {
  // States for products, current page, and loading indicator
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    // Function to fetch products from Firestore
    const fetchProducts = async () => {
      try {
        const productsCollectionRef = collection(db, 'ProductData');
        const productsSnapshot = await getDocs(productsCollectionRef);

        // Extract product data from the snapshot
        const productsData = productsSnapshot.docs.map((doc) => doc.data());

        setProducts(productsData);
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching products: ', error);
        setIsLoading(false); // Set loading to false on error
      }
    };

    // Call the fetchProducts function when the component mounts
    fetchProducts();
  }, []);

  // Calculate the range of products to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  // Filter the products to display on the current page
  const productsToDisplay = products.slice(startIndex, endIndex);

  // Function to handle next page
  const nextPage = () => {
    if (currentPage < Math.ceil(products.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h1>Product List</h1>
      {isLoading ? (
        // Show loading indicator while data is loading
        <div className="loader"></div>
      ) : (
        <div>
          <div className="product-list">
            {productsToDisplay.map((product, index) => (
              <div className="product-card" key={index}>
                {/* Product card contents */}
                <div className="product-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p style={{ color: 'pink', fontWeight: '400', marginBottom: '10px' }}>
                    Price: ${product.price}
                  </p>
                  <p style={{ margin: '0' }}>Quantity: {product.quantity}</p>
                  <p style={{ margin: '0' }}>Description: {product.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button className='bttn' onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(products.length / itemsPerPage)}
            </span>
            <button className='bttn' onClick={nextPage} disabled={currentPage === Math.ceil(products.length / itemsPerPage)}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
