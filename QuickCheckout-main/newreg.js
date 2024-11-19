
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
 import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
 
 const firebaseConfig = {
   apiKey: "AIzaSyALf0kWiEBWKBUHOCWOLwwbshc8678CQ_M",
   authDomain: "sass-66c7f.firebaseapp.com",
   projectId: "sass-66c7f",
   storageBucket: "sass-66c7f.appspot.com",
   messagingSenderId: "485007199733",
   appId: "1:485007199733:web:dbf3c7c8a05f6ab03324bc"
 };

 // Initialize Firebase
 register.addEventListener('click',async(e)=>{
    e.preventDefault();
    if(  name.value==='' ||
         username.value==='' ||
         upi.value==='' ||
         pass1.value==='' ||
         pass2.value===''
    ) {
        return window.alert('fill all fields');
    } 
    if(pass1.value!==pass2.value){
        return window.alert('password mismatch');
    }

    const merchant = {name: name.value, upiId: upi.value, password: pass1.value};
    console.log(merchant);
    const docRef = doc(db,'merchants',username.value);
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            window.alert('Someone already registered by this username');
        } else {
            await setDoc(docRef, merchant);
            window.alert('Merchant registered successfully');
            window.location.href = url.split('/').slice(0, -1).join('/') + `/dashboard.html?mrid=${username.value}`;
        }
    } catch (error) {
        console.error("Error checking document:", error);
    }
})

const userCheck = document.createElement('div');
usernameDiv.appendChild(userCheck);
userCheck.style.textAlign = 'right'
userCheck.style.padding = '1px 1em'
userCheck.style.display = 'none';

setInterval(async() => {
    if(username.value===''){
        userCheck.textContent = 'Enter username';
        userCheck.style.color = 'white';
    }
    else {
        const docRef = doc(db,'merchants',username.value);
        try {
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                userCheck.textContent = 'This username is already taken';
                userCheck.style.color = 'red';
            }   
            else{
                userCheck.textContent = 'This username is available';
                userCheck.style.color = 'green';
            }
        } catch (error) {
            console.error("Error checking document:", error);
        }
    }
}, 1500);
    
username.addEventListener('focusin',()=>{
    userCheck.style.display = 'block';
})

username.addEventListener('focusout',()=>{
    userCheck.style.display = 'none';
})