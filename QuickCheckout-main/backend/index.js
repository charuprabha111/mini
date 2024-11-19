const express = require('express');
const cors = require('cors');
const app = express();

// require('dotenv').config()

app.use(cors(
    {
        origin: ["https://quick-checkout-mu.vercel.app"],
        methods: ["POST" , "GET" , "PATCH" , "PUT" , "DELETE" ],
        credentials: true
    }
));
// app.use(cors())

app.use(express.json());

const apiKey = `${process.env.API_KEY}`
const authDomain = `${process.env.AUTH_DOMAIN}`
const databaseURL = `${process.env.DB_URL}`
const projectId = `${process.env.PROJECT_ID}`
const storageBucket = `${process.env.STORAGE_BUCKET}`
const messagingSenderId = `${process.env.MESSAGING_SENDER_ID}`
const appId = `${process.env.APP_ID}`
const measurementId = `${process.env.MEASUREMENT_ID}`
  
const firebaseConfig = {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId
}


const port = process.env.PORT || 5186;

app.get('/',(req,res)=>{
    res.send('hello guys....');
})

app.get('/firebase-config',(req,res)=>{
    res.send(firebaseConfig);
})

app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})