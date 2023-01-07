const express= require("express");
const route=express.Router();
const db=require("./db.js");
const bcrypt= require("bcrypt");

//---------------------SignUp------------------------------

route.post("/insert-user", (req,res)=>{

    const {name,password,adress,phone}=req.body;
    if(password!=""){
        bcrypt.hash(password,10).then((hash)=>{
            if(name!=""&&adress!=""&&phone!=""){
                const sqlInsert="INSERT INTO users (username,password,phone,adress) VALUES (?,?,?,?)";
                db.query(sqlInsert, [name,hash,phone,adress], (err,result)=>{
                console.log(result);
                if(err) throw err;
                else
                 res.status(201).json({status:201,message:"Account created"});
            });
            }
            else
              res.status(422).json({status:422,message:"Complete all fields"});
        });
     }
    else
      res.status(422).json({status:422,message:"Complete all fields"});
});
//--------------------Check if the user is logged in-----------

route.get("/login",(req,res)=>{
    if(req.session.user){
        res.send({loggedIn:true, user:req.session.user});
    }
    else
        res.send({loggedIn:false});
})

//--------------------LogIn------------------------------------

route.post("/login", (req,res)=>{

    const {name,password}=req.body;
    const sqlSelectById="SELECT * FROM users WHERE username='"+name+"'";
    db.query(sqlSelectById,(err,result)=>{
        if(result[0]==undefined){
            res.json({status:422,message:"User doesn't exist!"});
        }
        else{
            bcrypt.compare(password,result[0].password).then((match)=>{
                if(!match)
                 res.json({status:422, message:"The password is not correct"});
                 else{
                    req.session.user=result[0];
                    console.log(req.session.user);
                    res.json({status:201, message:"Loged in", user:result[0]});
                 }
                 
            })
        }
    });
});

//-----------------------------Log Out----------------------------------------
route.get('/logout',(req,res)=>{

    //res.clearCookie();
    req.session.destroy();
    res.sendStatus(200);
    }); 

module.exports=route;