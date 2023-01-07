const express=require('express');
const bodyParser=require("body-parser");
const cors=require('cors');
const app=express();
const cookieParser=require("cookie-parser");
const session=require("express-session");

app.use(cors({
    origin:["http://localhost:3000"],
    methods:["GET","POST","DELETE","PUT"],
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/uploads',express.static('./uploads'));

//-----------Session login-----------------------

app.use(session({
    key:"userId",
    secret:"subscribe",
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:60*60*24*1000,
    }
}))

//------------Routes-----------------------------

const productRoute=require('./routes/products');
app.use('/products',productRoute);

const userRoute=require('./routes/users');
app.use('/auth',userRoute);

const orderRoute=require('./routes/orders');
app.use('/order',orderRoute);

//-----------Running the server on port 3001-----

app.listen(3001,()=>
{
    console.log("running");
});