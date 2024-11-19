// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

document.getElementById('login').addEventListener('click', async (event) => {
  event.preventDefault(); // Prevent the form from submitting

  // Get user input
  const username = document.getElementById('emailbox').value;
  const password = document.getElementById('passbox').value;

  try {
    // Sign in the user with email and password
    const userCredential = await signInWithEmailAndPassword(auth, username, password);
    const user = userCredential.user;

    // Check if the user is an admin
    if (user.uid === "AWbyzVklPiN9Dz9CtvqeJQ0ufoD3") {
      alert("Login successful!");
      window.location.href = './adashboard.html'; // Redirect to admin dashboard
    } else {
      alert("Access denied! Only admin can log in.");
      await auth.signOut(); // Sign out if not an admin
    }
  } catch (error) {
    console.error("Error logging in:", error);
    alert(error.message);
  }
});
