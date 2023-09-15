import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Products = () => {
  // Initialize state variables
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Firestore collection reference
  const productCollectionRef = collection(db, "ProductData");

  // React Router navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload the image to Firebase Storage if selected
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `productImages/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Add product data to Firestore
      await addDoc(productCollectionRef, {
        name,
        price,
        quantity,
        description,
        imageUrl,
      });

      // Reset form and show success message
      setSuccessMessage("Data Submitted Successfully!!");
      resetForm();
      navigate('/ProductList');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSuccessMessage('');
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  // Reset form fields
  const resetForm = () => {
    setName('');
    setPrice('');
    setQuantity('');
    setDescription('');
    setImage(null);
  };

  return (
    <div className="product-detail">
      <div className='Product'>
        <h2>Products</h2>
        <form onSubmit={handleSubmit}>
          <div className='grid'>
            {/* Input fields */}
            <div className='field'>
              <label htmlFor="name"><span>Name:</span></label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  handleInputChange();
                  setName(e.target.value);
                }}
                required
              />
            </div>
            <div className='field'>
              <label htmlFor="price"><span>Price:</span></label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => {
                  handleInputChange();
                  setPrice(e.target.value);
                }}
                required
              />
            </div>
            <div className='field'>
              <label htmlFor="quantity"><span>Quantity:</span></label>
              <input
                type='number'
                id="quantity"
                value={quantity}
                onChange={(e) => {
                  handleInputChange();
                  setQuantity(e.target.value);
                }}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor="image"><span>Image:</span></label>
              <input
                style={{ fontSize: '10px', marginTop: '5px' }}
                className='img'
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <div className='description'>
              <label htmlFor="description"><span >Description:</span></label>
              <textarea
                style={{ width: '200%' }}
                id="description"
                placeholder='Write Here'
                value={description}
                onChange={(e) => {
                  handleInputChange();
                  setDescription(e.target.value);
                }}
                required
              />
            </div>
          </div>
          <button className='submit' type="submit">Add Product</button>
          {successMessage && <p className='success'>{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Products;
