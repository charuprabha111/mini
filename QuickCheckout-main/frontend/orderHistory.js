import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

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

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch and display grouped order history
async function fetchGroupedOrderHistory() {
  const orderHistoryDiv = document.getElementById("orderHistory");
  const receiptsRef = collection(db, "receipts");
  const q = query(receiptsRef, orderBy("date", "desc")); // Order by date descending
  
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      orderHistoryDiv.innerHTML = "<p>No orders found.</p>";
      return;
    }

    // Group orders by username
    const groupedOrders = {};
    querySnapshot.forEach(doc => {
      const { username, items, total, date } = doc.data();
      if (!groupedOrders[username]) {
        groupedOrders[username] = [];
      }
      groupedOrders[username].push({ items, total, date });
    });

    // Render grouped orders
    for (const [username, orders] of Object.entries(groupedOrders)) {
      const userDiv = document.createElement("div");
      userDiv.classList.add("user-orders");
      userDiv.innerHTML = `<h2>User: ${username}</h2>`;

      orders.forEach(order => {
        const formattedDate = new Date(order.date).toLocaleString();

        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order");
        orderDiv.innerHTML = `
          <p>Date: ${formattedDate}</p>
          <div class="order-items">
            <strong>Items:</strong>
          </div>
          <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
        `;

        const itemsDiv = orderDiv.querySelector(".order-items");
        order.items.forEach(item => {
          const itemDiv = document.createElement("div");
          itemDiv.textContent = `${item.name} (Qty: ${item.quantity}, ₹${(item.price * item.quantity).toFixed(2)})`;
          itemsDiv.appendChild(itemDiv);
        });

        userDiv.appendChild(orderDiv);
      });

      orderHistoryDiv.appendChild(userDiv);
    }
  } catch (err) {
    console.error("Error fetching order history:", err);
    orderHistoryDiv.innerHTML = "<p>Error loading order history. Please try again later.</p>";
  }
}

// Call the function on page load
fetchGroupedOrderHistory();
