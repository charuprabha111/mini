import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, doc, getDoc, addDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
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

const video = document.getElementById('video');
const barcodeInput = document.getElementById('barcodeResult');
const addbtn = document.getElementById('addbtn');
const submitbtn = document.getElementById('submitbtn');
const totalDiv1 = document.getElementById('totalDiv1');
const totalDiv2 = document.getElementById('totalDiv2');
const list = document.querySelector('.list');
const submitDiv = document.querySelector('.submissionAvailable');

let total = 0;
let receipt = [];
let username = ''; // Variable to store the dynamic username

// Fetch the logged-in user's name dynamically
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Query based on the user's email stored as 'username' in the Firestore document
    const userQuery = query(collection(db, 'users'), where('username', '==', user.email));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      username = userDoc.data().name; // Store the 'name' field in the username variable
    } else {
      console.log("User document not found.");
    }
  } else {
    console.log("User is not logged in.");
  }
});

// Start camera and barcode scanning
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      video.srcObject = stream;
      video.play();
      initBarcodeScanner();
    })
    .catch(err => {
      console.error('Error accessing the camera:', err);
    });
}

// Initialize QuaggaJS for barcode scanning
function initBarcodeScanner() {
  Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: video,
      constraints: {
        width: { min: 640 },
        height: { min: 480 },
        aspectRatio: { min: 1, max: 100 },
        facingMode: 'environment'
      },
    },
    decoder: {
      readers: ['ean_reader', 'upc_reader', 'code_128_reader'],
    },
  }, err => {
    if (err) {
      console.error('Error initializing Quagga:', err);
      return;
    }
    Quagga.start();
    Quagga.onDetected(handleBarcodeDetection);
  });
}

// Function to handle detected barcode
function handleBarcodeDetection(result) {
  const code = result.codeResult.code;
  barcodeInput.value = code; // Display barcode in the input field
}

// Add item to cart by checking if it exists in 'items' collection
const addHandler = async () => {
  const productId = barcodeInput.value;

  console.log('Scanned productId:', productId);

  // Query Firestore for the product by barcode
  const itemsCollection = collection(db, 'items');
  const productQuery = query(itemsCollection, where('barcode', '==', productId));

  try {
    const querySnapshot = await getDocs(productQuery);

    if (!querySnapshot.empty) {
      const productDoc = querySnapshot.docs[0];
      const productData = productDoc.data();
      const { name, price } = productData;

      // Check if product already exists in cart
      const existingItem = receipt.find(item => item.name === name);
      if (existingItem) {
        // Increment quantity and update total
        existingItem.quantity += 1;
        total += price;
        
        // Update the quantity and price display in the DOM
        const itemDiv = list.querySelector(`.item[data-name="${name}"]`);
        const quantityInput = itemDiv.querySelector('.quantityInput');
        const priceDiv = itemDiv.querySelector('.pricediv');

        quantityInput.value = existingItem.quantity;
        priceDiv.textContent = `₹${(existingItem.quantity * price).toFixed(2)}`;
      } else {
        // Add new item to receipt
        const newItem = { name, price, quantity: 1 };
        receipt.push(newItem);
        total += price;

        // Display item in the list
        const newDiv = document.createElement('div');
        newDiv.className = 'item';
        newDiv.setAttribute('data-name', name);

        const nameDiv = document.createElement('div');
        nameDiv.textContent = name;
        nameDiv.className = 'namediv';

        // Quantity adjustment controls
        const quantityDiv = document.createElement('div');
        quantityDiv.className = 'quantitydiv';

        const minusButton = document.createElement('button');
        minusButton.textContent = '-';
        minusButton.className = 'quantityBtn';
        minusButton.onclick = () => adjustQuantity(newDiv, -1);

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = 1;
        quantityInput.className = 'quantityInput';
        quantityInput.readOnly = true;

        const plusButton = document.createElement('button');
        plusButton.textContent = '+';
        plusButton.className = 'quantityBtn';
        plusButton.onclick = () => adjustQuantity(newDiv, 1);

        quantityDiv.appendChild(minusButton);
        quantityDiv.appendChild(quantityInput);
        quantityDiv.appendChild(plusButton);

        const priceDiv = document.createElement('div');
        priceDiv.textContent = `₹${price.toFixed(2)}`;
        priceDiv.className = 'pricediv';

        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteBtn';
        deleteButton.onclick = () => deleteItem(newDiv, newItem);

        newDiv.appendChild(nameDiv);
        newDiv.appendChild(quantityDiv);
        newDiv.appendChild(priceDiv);
        newDiv.appendChild(deleteButton);

        list.appendChild(newDiv);
      }

      submitDiv.style.display = total > 0 ? 'inline' : 'none';
      updateTotal();
    } else {
      alert('Product not found in database.');
    }
  } catch (err) {
    console.error('Error fetching product:', err);
  }
};

// Adjust quantity of an item in the cart
function adjustQuantity(itemDiv, delta) {
  const quantityInput = itemDiv.querySelector('.quantityInput');
  const priceDiv = itemDiv.querySelector('.pricediv');
  const itemName = itemDiv.querySelector('.namediv').textContent;

  let item = receipt.find(i => i.name === itemName);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity < 1) item.quantity = 1;

  quantityInput.value = item.quantity;
  priceDiv.textContent = `₹${(item.price * item.quantity).toFixed(2)}`;

  total = receipt.reduce((sum, i) => sum + i.price * i.quantity, 0);
  updateTotal();
}

// Delete item from cart
function deleteItem(itemDiv, item) {
  const index = receipt.findIndex(i => i.name === item.name);

  if (index > -1) {
    total -= item.price * item.quantity;
    receipt.splice(index, 1);
    list.removeChild(itemDiv);
    updateTotal();
  }

  submitDiv.style.display = total > 0 ? 'inline' : 'none';
}

// Update total display
function updateTotal() {
  totalDiv1.textContent = `₹${total.toFixed(2)}`;
  totalDiv2.textContent = `₹${total.toFixed(2)}`;
}

// Submit order to Firestore with dynamic username
submitbtn.addEventListener('click', () => {
  if (total <= 0) {
    alert('Cannot submit with zero amount.');
    return;
  }

  // Populate the order preview modal
  const orderDetailsDiv = document.getElementById('orderDetails');
  orderDetailsDiv.innerHTML = ''; // Clear previous details

  receipt.forEach(item => {
    const itemRow = document.createElement('div');
    itemRow.className = 'order-item';
    itemRow.innerHTML = `
      <span>${item.name}</span>
      <span>Qty: ${item.quantity}</span>
      <span>Price: ₹${(item.price * item.quantity).toFixed(2)}</span>
    `;
    orderDetailsDiv.appendChild(itemRow);
  });

  // Update the total in the modal
  document.getElementById('orderTotal').textContent = `₹${total.toFixed(2)}`;

  // Show the modal
  const modal = document.getElementById('orderPreviewModal');
  modal.style.display = 'block';
});

// Close the modal
document.getElementById('closePreview').addEventListener('click', () => {
  const modal = document.getElementById('orderPreviewModal');
  modal.style.display = 'none';
});

// Confirm the order and submit it
document.getElementById('confirmOrder').addEventListener('click', async () => {
  try {
    const docRef = await addDoc(collection(db, "receipts"), {
      items: receipt,
      total: total,
      username: username, // Use the dynamic username here
      date: new Date().toISOString(), // Add order date
    });

    alert('Order submitted successfully!');
    window.location.href = 'summary.html';

    // Reset the form after submission
    barcodeInput.value = '';
    receipt = [];
    total = 0;
    list.innerHTML = '';
    updateTotal();
    submitDiv.style.display = 'none';

    // Close the modal
    document.getElementById('orderPreviewModal').style.display = 'none';
  } catch (err) {
    console.error('Error submitting order:', err);
  }


});

// Event listeners
addbtn.addEventListener('click', addHandler);
window.addEventListener('load', startCamera);
document.getElementById("btn01").addEventListener("click", () => {
  window.location.href = "ordersummary.html"; // Replace with your actual order summary page path
});
