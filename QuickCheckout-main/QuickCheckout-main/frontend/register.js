import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {getFirestore,doc,getDoc,addDoc,setDoc,collection} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

var db;

fetch('https://quick-checkout-api.vercel.app/firebase-config')
    .then(response =>{
        return response.json();
    })
    .then(data =>{
        var firebaseConfig = {}
        firebaseConfig = data;
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    })
    .catch(error=>{
        console.log('fetch error: ',error);
    })

    
const name = document.getElementById('name');
const username = document.getElementById('username');
const upi = document.getElementById('upi');
const pass1 = document.getElementById('pass1');
const pass2 = document.getElementById('pass2');
const register = document.getElementById('register');
const usernameDiv = document.getElementById('123122');
const url = window.location.href;

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