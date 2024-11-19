import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {getFirestore,doc,getDoc} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";



const url = window.location.href;
const baseUrl = url.split('/').slice(0, -1).join('/');

console.log('Base URL:', baseUrl);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('mrid');
const id = urlParams.get('id');
const merchant = urlParams.get('merchant');
const list = document.querySelector('.list');

const newDiv = document.createElement('div');
if(merchant==='true'){
    list.style.display = 'none';

    async function generateQRCode() {
      try {
          const linkToEncode = `${baseUrl}/qr.html?id=${id}&merchant=false&mrid=${username}`; 
          
          const qr = new QRCode({
              content: linkToEncode,
              padding: 4,
              width: 200,
              height: 200
          });
          
          return qr.svg();
      } catch (error) {
          console.error('QR Code generation error:', error);
          throw error;
      }
  }
  
  async function displayQRCode() {
      try {
          const qrImage = await generateQRCode();
          const newDiv = document.createElement('div');
          newDiv.innerHTML = qrImage;
          
          const textDiv = document.createElement('div');
          textDiv.textContent = 'Scan the above QR code for receipt';
          textDiv.style.margin = '18px';
          
          newDiv.appendChild(textDiv);
          newDiv.style.display = 'flex';
          newDiv.style.flexDirection = 'column';
          newDiv.style.height = '60vh';
          newDiv.style.justifyContent = 'center';
          newDiv.style.alignItems = 'center';
          
          document.body.appendChild(newDiv);
      } catch (error) {
          console.log(error);
      }
  }
  
  displayQRCode();
  
      
}
else {
  var firebaseConfig = {};
var app;
var db;
var index = 1;
fetch('https://quick-checkout-api.vercel.app/firebase-config')
    .then(response =>{
        return response.json();
    })
    .then(data =>{
        firebaseConfig = data;
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        
    })
    .then(()=>{
      getData();
    })
    .catch(error=>{
        console.log('fetch error: ',error);
    })

    
    async function getData () {

        const receiptPromise = getDoc(doc(db, 'receipts', id))
        .then(receiptDoc => {
            if (receiptDoc.exists()) {
                return receiptDoc;
            } else {
                throw new Error("Receipt not found");
            }
        });
        const merchantPromise = getDoc(doc(db, 'merchants', username))
            .then(merchantDoc => {
                if (merchantDoc.exists()) {
                    return merchantDoc;
                } else {
                    throw new Error("Merchant not found");
                }
            });
        const [receipt, merchant] = await Promise.all([receiptPromise, merchantPromise]);


        const upiId = merchant.data().upiId;
        const merchantName = merchant.data().name;

        receipt.data().items.forEach((item)=>{
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item'
            // itemDiv.textContent = `item name: ${item.name}, price: ${item.price}`;
            const srDiv = document.createElement('div');
            srDiv.textContent = index++;
            srDiv.className = 'srdiv';
            
            const nameDiv = document.createElement('div');
            nameDiv.textContent = item.name;
            nameDiv.className = 'namediv'
    
            const priceDiv = document.createElement('div');
            priceDiv.textContent = item.price;
            priceDiv.className = 'pricediv';
    
            itemDiv.appendChild(srDiv);
            itemDiv.appendChild(nameDiv);
            itemDiv.appendChild(priceDiv);
    
            list.appendChild(itemDiv);
            // newDiv.appendChild(itemDiv);
        })
        const totalDiv = document.createElement('div');
        totalDiv.textContent = `Total Amount = ${receipt.data().total}`;
        totalDiv.style.textAlign = 'center';
        totalDiv.style.fontSize = '20px'
        totalDiv.style.fontWeight = 'bold';
        totalDiv.style.margin = '20px'
        newDiv.appendChild(totalDiv);

        const paymentDiv = document.createElement('div');
        const aTag = document.createElement('a');
        
       // aTag.style.background = 'red';
        aTag.style.textDecoration = 'none';
        aTag.style.fontSize = "large";
        aTag.style.border='2px solid black';
        aTag.style.borderRadius = '1rem';
        aTag.style.padding = '0.8rem';
        paymentDiv.style.marginTop='3rem';
        aTag.style.color='whitesmoke';
        aTag.style.backgroundColor = 'black';
        aTag.style.fontFamily = 'Arial, sans-serif';
        aTag.style.transition='0.3s';

        aTag.setAttribute('href',`upi://pay?pa=${upiId}&pn=${merchantName}&cu=INR&am=${receipt.data().total}`);
        aTag.innerText = "Pay Now";
        paymentDiv.append(aTag);
        paymentDiv.style.textAlign = 'center';
        newDiv.appendChild(paymentDiv);
    }
    
}
document.body.appendChild(newDiv);

