import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {getFirestore,doc,getDoc,addDoc,setDoc,collection} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

var firebaseConfig = {};
var app;
var db;

// username will be provided while reaching to this page.
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('mrid');

fetch('https://quick-checkout-api.vercel.app/firebase-config')
    .then(response =>{
        return response.json();
    })
    .then(data =>{
        firebaseConfig = data;
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    })
    .catch(error=>{
        console.log('fetch error: ',error);
    })


const code = document.querySelector('#code');
const names = document.querySelector('#name');
const price = document.querySelector('#price');

const btn11 = document.querySelector('#btn11');
const url = window.location.href;
const baseUrl = url.split('/').slice(0, -1).join('/') + `/dashboard.html?mrid=${username}`;

btn11.addEventListener('click',()=>{
    if(code.value===''||names.value===''||price.value===''){
        return window.alert('enter all fields: barcode, name and price');
    }
    if (/^\d+$/.test(price.value)) {
        const priceVal = parseInt(price.value);  
        if(priceVal<=0) return alert('price cannot be zero or less')
        const codeVal = code.value;
        const nameVal = names.value;

        const customID = codeVal+'-'+username;
        const newData = {
            name: nameVal,
            price: priceVal
        };
        const docRef = doc(db,'products',customID);
        setDoc(docRef,newData, { merge: true })
        .then(() => {
            window.alert("Document successfully written or updated!");
            window.location.href = baseUrl;
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }
    else{
        return window.alert('price should be a number');
    }
})