import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Import Firebase Firestore as 'db'
import { collection, getDocs } from 'firebase/firestore';

function Order() {
  // State variable to store sales data
  const [salesData, setSalesData] = useState([]);

  // Fetch sales data from Firestore when the component mounts
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const salesCollectionRef = collection(db, 'SalesData');
        const snapshot = await getDocs(salesCollectionRef);

        // Map the Firestore document data into an array
        const salesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          
        }));
       

        setSalesData(salesData); // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching sales data: ', error);
      }
    };

    fetchSalesData(); // Call the fetchSalesData function
  }, []);

  return (
    <div>
      <h2> Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.customerName}</td>
              <td>{sale.productName}</td>
              <td>{sale.quantity}</td>
              <td>${sale.price}</td>
              <td>${sale.totalPrice}</td>
              <td>{sale.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Order;
