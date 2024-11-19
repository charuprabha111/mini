import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {getFirestore,doc,getDoc,addDoc,collection} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

var firebaseConfig = {};
var app;
var db;

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


const video = document.getElementById('video');
const barcodeInput = document.getElementById('barcodeResult');
const addbtn = document.getElementById('addbtn');
const submitbtn = document.getElementById('submitbtn');
const totalDiv1 = document.getElementById('totalDiv1');
const totalDiv2 = document.getElementById('totalDiv2');
const list = document.querySelector('.list');
const btn01 = document.querySelector('#btn01');
const btn009 = document.querySelector('#btn009');
const input = document.querySelector('input');
const submitDiv = document.querySelector('.submissionAvailable')
var dark = false;
var total = 0;
var index = 1;
var receipt = [];
totalDiv1.textContent = total;
totalDiv2.textContent = total;

btn009.addEventListener('click',()=>{
  if(dark===false){
    document.body.style.backgroundColor = '#222221';
    document.body.style.color = 'white';
    input.style.backgroundColor = '#222221';
    input.style.color = 'white';
    input.style.border = '1px solid white';
    dark = true;
  }
  else{
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';
    input.style.backgroundColor = 'white';
    input.style.color = 'black';
    input.style.border = '1px solid black';
    dark = false;
  }
})

// Function to add new item to database button click event
btn01.addEventListener('click',()=>{
  window.location.href = `newItem.html?mrid=${username}`;
})

// Function to start the camera and barcode detection
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: {facingMode: 'environment'},audio: false })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
      initBarcodeScanner();
    })
    .catch(function (err) {
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
      readers: ['ean_reader', 'upc_reader', 'code_128_reader', 'code_39_reader', 'code_39_vin_reader', 'codabar_reader', 'i2of5_reader', '2of5_reader', 'code_93_reader'],
    },
  }, function (err) {
    if (err) {
      console.error('Error initializing Quagga:', err);
      return;
    }
    Quagga.start();
    Quagga.onDetected(handleBarcodeDetection);
  });
}

function handleBarcodeDetection(result) {
  const code = result.codeResult.code;
  barcodeInput.value = code; // Put the detected barcode in the input field
}

window.onload = function () {
  startCamera();
};



const addHandler = async()=>{
  const productId = barcodeInput.value;
  const productIdString = productId+'-'+username;
  try {
    const docRef = doc(db,'products',productIdString);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        receipt.push(docSnap.data());
        total += docSnap.data().price;
        totalDiv1.textContent = total;
        totalDiv2.textContent = total;
        if(total>=0){
          submitDiv.style.display = 'inline'
        }
        const newDiv = document.createElement('div');
        newDiv.className = 'item';
        const srDiv = document.createElement('div');
        srDiv.textContent = index++;
        srDiv.className = 'srdiv';
        
        const nameDiv = document.createElement('div');
        nameDiv.textContent = docSnap.data().name;
        nameDiv.className = 'namediv'

        const priceDiv = document.createElement('div');
        priceDiv.textContent = docSnap.data().price;
        priceDiv.className = 'pricediv';

        newDiv.appendChild(srDiv);
        newDiv.appendChild(nameDiv);
        newDiv.appendChild(priceDiv);

        list.appendChild(newDiv);
    } 
    else {
        navigator.clipboard.writeText(productId);
        window.alert('No such product found, you need to add item to database; this barcode has been copied to the clipboard');
    }

  } catch(err){
    console.log('error fetching document: ',err);
  }
};
addbtn.addEventListener('click',addHandler);

async function submitHandler () {
  const docRef = await addDoc(collection(db, "receipts"), {
    items: receipt,
    total: total,
    username
  });
  if(total>0){
    var link = `qr.html?id=${docRef.id}&merchant=true&mrid=${username}`;
    window.location.href = link;
  }
  else{
    window.alert('cannot submit with zero amount');
  }
}
submitbtn.addEventListener('click',submitHandler);