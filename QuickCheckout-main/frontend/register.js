import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

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
const db = getFirestore(app); // Initialize Firestore

const nameInput = document.getElementById('name');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('pass1');
const confirmPasswordInput = document.getElementById('pass2');
const registerButton = document.getElementById('register');

registerButton.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent the form from submitting

    const email = usernameInput.value; // Use username as email
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validate input
    if (nameInput.value === '' || email === '' || password === '' || confirmPassword === '') {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Check if email already exists
    try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length > 0) {
            alert('This email is already registered. Please log in instead.');
            return;
        }

        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('User registered:', user);

        // Store additional user information in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name: nameInput.value,
            username: email, // Assuming you want to store the username as the email for now
            createdAt: new Date(),
        });

        // Redirect to login page or dashboard
        window.location.href = './login.html';
    } catch (error) {
        console.error('Error registering user:', error);
        alert(error.message); // Display error message
    }
});
