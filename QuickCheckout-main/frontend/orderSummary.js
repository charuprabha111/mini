import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALf0kWiEBWKBUHOCWOLwwbshc8678CQ_M",
  authDomain: "sass-66c7f.firebaseapp.com",
  projectId: "sass-66c7f",
  storageBucket: "sass-66c7f.appspot.com",
  messagingSenderId: "485007199733",
  appId: "1:485007199733:web:dbf3c7c8a05f6ab03324bc",
  measurementId: "G-HS4N83RJ1P"
};

// Initialize Firebase, Firestore, and Auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const orderContainer = document.getElementById('orderContainer'); // Container to display order summary

// Fetch and display the logged-in user's orders based on their username in Firestore
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Fetch the logged-in user's name from the 'users' collection based on their email
    const userQuery = query(collection(db, 'users'), where('username', '==', user.email));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const username = userDoc.data().name; // Retrieve the 'name' field

      // Call displayOrderSummary with the username
      displayOrderSummary(username);
    } else {
      console.log("User document not found.");
      orderContainer.textContent = 'No orders found for this user.';
    }
  } else {
    orderContainer.textContent = 'User not logged in.';
  }
});

// Function to display order summary for a specific username
const displayOrderSummary = async (username) => {
  console.log("Querying orders for username:", username); // Log the username for debugging
  const orderQuery = query(collection(db, 'receipts'), where('username', '==', username));
  const querySnapshot = await getDocs(orderQuery);

  if (!querySnapshot.empty) {
    querySnapshot.forEach(doc => {
      const orderData = doc.data();
      console.log("Found order data:", orderData); // Log each document found

      const orderDiv = document.createElement('div');
      orderDiv.classList.add('order');

      const itemsList = document.createElement('ul');
      itemsList.classList.add('items-list');

      orderData.items.forEach(item => {
        const itemElement = document.createElement('li');
        itemElement.textContent = `${item.name} - Quantity: ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`;
        itemsList.appendChild(itemElement);
      });

      const totalDiv = document.createElement('div');
      totalDiv.textContent = `Total: ₹${orderData.total.toFixed(2)}`;
      orderDiv.appendChild(itemsList);
      orderDiv.appendChild(totalDiv);

      const dateDiv = document.createElement('div');
      dateDiv.textContent = `Order Date: ${new Date(orderData.date).toLocaleString()}`;
      orderDiv.appendChild(dateDiv);

      orderContainer.appendChild(orderDiv);
    });
  } else {
    console.log("No orders found in Firestore.");
    orderContainer.textContent = 'No orders found for this user.';
  }
};
