import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

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

const inventoryTable = document.getElementById("inventoryTable");

// Function to fetch and display items from Firestore
async function displayInventory() {
    inventoryTable.innerHTML = ""; // Clear existing table rows

    // Get all items from 'items' collection
    const querySnapshot = await getDocs(collection(db, "items"));
    querySnapshot.forEach((doc) => {
        const item = doc.data();
        const itemId = doc.id;

        // Create table row for each item
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.barcode}</td>
            <td>${item.name}</td>
            <td>₹<span id="original-price-${itemId}">${item.price}</span></td>
            <td>
                <input type="number" id="discount-${itemId}" value="${item.discount || 0}" min="0" max="100">
            </td>
            <td>₹<span id="updated-price-${itemId}">${item.price}</span></td>
            <td>
                <input type="number" id="quantity-${itemId}" value="${item.quantity || 0}" min="0">
            </td>
            <td>
                <button onclick="applyDiscount('${itemId}')">Apply Discount</button>
                <button onclick="deleteItem('${itemId}')">Delete</button>
                <button onclick="updateItem('${itemId}')">Update</button>
            </td>
        `;
        inventoryTable.appendChild(row);
    });
}

// Function to apply discount and update the displayed price
window.applyDiscount = function(itemId) {
    const originalPrice = parseFloat(document.getElementById(`original-price-${itemId}`).textContent);
    const discount = parseFloat(document.getElementById(`discount-${itemId}`).value);

    if (isNaN(discount) || discount < 0 || discount > 100) {
        alert("Please enter a valid discount percentage (0-100).");
        return;
    }

    const updatedPrice = originalPrice - (originalPrice * discount) / 100;
    document.getElementById(`updated-price-${itemId}`).textContent = updatedPrice.toFixed(2);
};

// Function to delete an item from Firestore
window.deleteItem = async function(itemId) {
    if (confirm("Are you sure you want to delete this item?")) {
        await deleteDoc(doc(db, "items", itemId));
        alert("Item deleted successfully!");
        displayInventory(); // Refresh the inventory display
    }
};

// Function to update an item's details in Firestore
window.updateItem = async function(itemId) {
    const quantityInput = document.getElementById(`quantity-${itemId}`);
    const discountInput = document.getElementById(`discount-${itemId}`);
    const updatedPriceElement = document.getElementById(`updated-price-${itemId}`);

    const newQuantity = parseInt(quantityInput.value);
    const newDiscount = parseFloat(discountInput.value);
    const newPrice = parseFloat(updatedPriceElement.textContent);

    if (isNaN(newQuantity) || newQuantity < 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    await updateDoc(doc(db, "items", itemId), {
        quantity: newQuantity,
        discount: newDiscount,
        price: newPrice
    });

    alert("Item updated successfully!");
    displayInventory(); // Refresh the inventory display
};

// Load inventory on page load
displayInventory();
