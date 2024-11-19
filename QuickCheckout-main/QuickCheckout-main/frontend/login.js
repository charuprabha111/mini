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

const emailbox = document.getElementById('emailbox');
const passbox = document.getElementById('passbox');
const login = document.getElementById('login');

function showCustomAlert(message) {
    const customAlert = document.getElementById('custom-alert');
    const customAlertMessage = document.getElementById('custom-alert-message');
  
    customAlertMessage.textContent = message;
    customAlert.style.display = 'block';
  
    const closeBtn = document.getElementById('custom-alert-close-btn');
    closeBtn.addEventListener('click', function () {
      customAlert.style.display = 'none';
    });
  }

login.addEventListener('click',(e)=>{
    e.preventDefault();
    if(emailbox.value==='' || passbox.value==='')
        return window.alert('fill all fields');
    async function userCheck () {
        const docRef = doc(db,'merchants',emailbox.value);
        // try {
        //     const docSnap = await getDoc(docRef);
        //     if(docSnap.exists()) {
        //         // console.log(docSnap.data());
        //         if(docSnap.data().password !== passbox.value){
        //             return window.alert('password is incorrect');
        //         }
        //         else{
        //             console.log('logged in successfully');
        //             const url = window.location.href;
        //             window.location.href = url.split('/').slice(0, -1).join('/') + `/dashboard.html?mrid=${emailbox.value}`;
        //         }
        //     } else {
        //         return window.alert('no merchant registered by this email/phone');
        //     }
        
        // } catch(error) {
        //     console.log(error)
        // }
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              if (docSnap.data().password !== passbox.value) {
                showCustomAlert('Password is incorrect');
              } else {
                console.log('Logged in successfully');
                const url = window.location.href;
                window.location.href = url.split('/').slice(0, -1).join('/') + `/dashboard.html?mrid=${emailbox.value}`;
              }
            } else {
              showCustomAlert('No merchant registered by this username');
            }
          } catch (error) {
            console.error('Error:', error);
            showCustomAlert('An error occurred. Please try again later.');
          }
    }
    userCheck();
})