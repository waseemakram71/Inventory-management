import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './Component/SignIn';
import Login from './Component/Login'
import Navbar from './Component/Navbar';

import './App.css';
import Products from './Component/Products';
import ProductList from './Component/ProductList';

import SaleProduct from './Component/SaleProduct';

import Home from './Component/Home';
import UpdateProduct from './Component/UpdateProduct';
import Order from './Component/Order';
import { auth } from './Component/firebase';
import { useState } from 'react';



function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if the user is logged in on initial app load
  auth.onAuthStateChanged((user) => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });
  return (
  

<div>

  <BrowserRouter>
  <Navbar loggedIn={loggedIn} handleLogout={() => setLoggedIn(false)} />

  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/SignIn" element={<SignIn />} />
  <Route
            path="/login"
            element={<Login setLoggedIn={setLoggedIn} />}
          />
  {/* <Route path="/dashbord" element={<Dashbord/>} /> */}
  <Route path="/products" element={<Products/>} />
  <Route path="/productList" element={<ProductList/>} />
  <Route path="/SaleProduct" element={<SaleProduct/>} />
  <Route path="/UpdateProduct" element={<UpdateProduct/>} />
  <Route path="/Order" element={<Order/>} />
  </Routes>
  </BrowserRouter>

</div>


  )
}

export default App
