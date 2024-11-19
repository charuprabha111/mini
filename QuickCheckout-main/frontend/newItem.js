import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

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

// Get form input elements
const codeInput = document.getElementById('code');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const submitButton = document.getElementById('btn11');

// Start barcode scanning when the page loads
window.onload = startBarcodeScanner;

// Initialize QuaggaJS for barcode scanning
function startBarcodeScanner() {
    Quagga.init({
        inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: document.querySelector('#video'), // Attach the video stream to the #video element
            constraints: {
                width: 640,
                height: 480,
                facingMode: 'environment' // Use the back camera
            }
        },
        decoder: {
            readers: ["ean_reader", "upc_reader", "code_128_reader"], // Supports common barcode formats
            debug: true // Enable debug mode for troubleshooting
        },
        locate: true, // Try to locate the barcode in the camera feed
        locator: {
            patchSize: "medium", // Can be "x-small", "small", "medium", "large"
            halfSample: true
        }
    }, function(err) {
        if (err) {
            console.error("Error initializing Quagga:", err);
            return;
        }
        console.log("Quagga initialized successfully.");
        Quagga.start();
    });

    // Detect barcode and set value in barcode input
    Quagga.onDetected(result => {
        const code = result.codeResult.code;
        codeInput.value = code; // Automatically set the barcode value
        alert("Barcode detected: " + code);
        Quagga.stop(); // Stop scanner after detecting one barcode
    });
}

// Add event listener to the Submit button
submitButton.addEventListener('click', async (event) => {
    event.preventDefault();

    // Get values from input fields
    const code = codeInput.value.trim();
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);

    // Basic input validation
    if (!code || !name || isNaN(price)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    try {
        // Add item to Firestore collection 'items'
        await addDoc(collection(db, "items"), {
            barcode: code,
            name: name,
            price: price
        });

        alert("Item added successfully!");

        // Clear input fields
        codeInput.value = "";
        nameInput.value = "";
        priceInput.value = "";

        // Restart the barcode scanner
        startBarcodeScanner();

    } catch (error) {
        console.error("Error adding item:", error);
        alert("Failed to add item: " + error.message);
    }
});
