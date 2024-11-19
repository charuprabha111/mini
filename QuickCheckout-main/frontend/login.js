import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

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
const auth = getAuth(app); // Initialize Firebase Authentication

const emailbox = document.getElementById('emailbox');
const passbox = document.getElementById('passbox');
const login = document.getElementById('login');

login.addEventListener('click', async (e) => {
    e.preventDefault();
    if (emailbox.value === '' || passbox.value === '') {
        alert('Fill all fields');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, emailbox.value, passbox.value);
        console.log('Logged in successfully:', userCredential.user);
        
        // Redirect to dashboard after successful login
        window.location.href = 'dashboard.html'; // Update with your dashboard page URL
    } catch (error) {
        console.error('Error:', error);
        alert(error.message); // Display error message
    }
});
