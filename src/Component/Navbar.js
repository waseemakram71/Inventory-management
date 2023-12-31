

import React from 'react';
import { NavLink } from 'react-router-dom';
import { auth } from './firebase';

const Navbar = ({ loggedIn }) => {
  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        console.log('User signed out successfully.');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <nav style={{ display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'center', background: '#223344' }}>
      <div>
        <p style={{ fontWeight: 1000, color: 'white', width: 'auto', margin: 'auto' }}>
          Inventory <span style={{ color: 'orange', fontStyle: 'italic' }}> Management System</span>
        </p>
      </div>



      <ul style={{ display: 'flex', listStyle: 'none', gap: '40px', textDecoration: 'none', alignItems: 'center' }}>
        <li>
          <NavLink className="nav-bar-link" to="/">
            Home
          </NavLink>
        </li>

        {/* Conditionally render the 'Signup' and 'Login' links */}
        {!loggedIn && (
          <>
            <li>
              <NavLink className="nav-bar-link" to="/SignIn">
                SignIn
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-bar-link" to="/login">
                Login
              </NavLink>
            </li>
          </>
        )}

        {/* Conditionally render the 'Add Donor' link based on the loggedIn prop */}
        {loggedIn && (
          <li>
            {/* <NavLink className="nav-bar-link" to="/products"> */}
            
            {/* </NavLink> */}
          </li>
        )}
         <li>
            <NavLink className="nav-bar-link" to="/products">
              Products
            </NavLink>
          </li>

        <li>
          <NavLink className="nav-bar-link" to="/productList">
           Product List
          </NavLink>
        </li>
        
        <li>
          <NavLink className="nav-bar-link" to="/SaleProduct">
            Sale Product
          </NavLink>
          
        </li>
        <li>
          <NavLink className="nav-bar-link" to="/UpdateProduct">
            UpdateProduct
          </NavLink>
          
        </li>
        <li>
          <NavLink className="nav-bar-link" to="/Order">
           Orders
          </NavLink>
        </li>

        {/* Conditionally render the 'Sign Out' button based on the loggedIn prop */}
        {loggedIn && (
          <li>
            <button onClick={handleLogout} style={{ width: 'auto' }}>
              LogOut
            </button>
          </li>
        )}
      </ul>
      
    </nav>
  );
};

export default Navbar;
