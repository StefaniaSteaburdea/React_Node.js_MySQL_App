const express= require("express");
const route=express.Router();
const db=require("./db.js");

const stripe=require('stripe')('sk_test_51MLuLbFr5bKcxHIMtN31BaFqIsXqflZBKHl67FXvdljljpYuzXqXz5gNLzlwlifwInwgTXieUL8tzKtDvKLkRdWJ0059eYigtp');

route.post("/place_order", async (req,res)=>{
    try{
        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            line_items:req.body.items.map(item=>{
                item.price=item.price*100;
                return{
                    price_data: {
                        currency:"usd",
                        product_data:{
                            name: item.name
                        },
                        unit_amount: item.price
                    },
                    quantity: item.quantity
                }
            }),
            success_url:`http://localhost:3000/prodList`,
            cancel_url: `http://localhost:3000/cart`,
        });
        res.status(201).json({url:session.url})
    }
    catch(e){
        console.log(e.message);
        res.status(500).json({error:e.message})
    }
});

//--------------------------------insert order to mysql---------------------------

route.post("/insert-order", (req,res)=>{

    const {userId,price,prods}=req.body;
    const sqlInsert="INSERT INTO orders (user_id,price) VALUES (?,?)";
    db.query(sqlInsert, [userId,price], (err,result)=>{
    
    if(err) throw err;
     else
        {
           order_id=result.insertId;
           var i;
           for(i=0;prods[i];i++){
              var quantity=prods[i].quantity;
              var product_id=prods[i].id;
              const sqlInsertt="INSERT INTO order_details (order_id,product_id,quantity) VALUES (?,?,?)";
              db.query(sqlInsertt,[order_id,product_id,quantity],(errr,resultt)=>{
                if(errr) throw errr;
                    
              })
           }
           res.status(201).json({status:201,message:"Order saved"});
        }
    });
        
});

//---------------------------------------read-orders-------------------------------------------------------
const d={
    name:"",
    adress:"",
    phone:"",
    price:"",
    prods:[]
}
function getUsers(){
    const sqlSelect="SELECT  users.username,users.adress,users.phone, orders.price, orders.order_id FROM users INNER JOIN orders ON users.idusers=orders.user_id ";
    db.query(sqlSelect, (err,result)=>{
        return result;
    } );
}

const data=[];
route.get("/read-orders", (req,res)=>{
    
    const sqlSelect="SELECT  users.username,users.adress,users.phone, orders.price, orders.order_id FROM users INNER JOIN orders ON users.idusers=orders.user_id ";
    db.query(sqlSelect, (err,result)=>{
        if(err)
          console.log(err);
          Object.keys(result).forEach( key=>{
            var d={
                order_id:result[key].order_id,
                name:result[key].username,
                adress:result[key].adress,
                phone:result[key].phone,
                price:result[key].price,
                prods:[]
            }
        const queryprod="SELECT order_details.details_id, products.productName, order_details.quantity FROM  order_details INNER JOIN products WHERE order_details.product_id=products.idproducts AND order_details.order_id="+result[key].order_id;
        db.query(queryprod,  (err,resultt) =>{
            if(err)
            console.log(err);
            Object.keys(resultt).forEach(key=>{
               var p={
                    id:resultt[key].details_id,
                    name:resultt[key].productName,
                    quantity:resultt[key].quantity
                }
                console.log(p);
                d.prods.push(p);
            })
                
                data.push(d);
                console.log(data);
            }) 
        }); 
        res.send(data);
        data.length=0;

});
}
);

//-------------------------------read orders users----------------------------------


const dataa=[];
route.get("/read-orders-user", (req,res)=>{
    
    const id=req.session.user.idusers;
    const sqlSelect="SELECT orders.price, orders.order_id FROM orders WHERE orders.user_id="+id;
    db.query(sqlSelect, (err,result)=>{
        if(err)
          console.log(err);
        if(result)
          Object.keys(result).forEach( key=>{
            var d={
                order_id:result[key].order_id,
                price:result[key].price,
                prods:[]
            }
        const queryprod="SELECT order_details.details_id, products.productName, order_details.quantity FROM  order_details INNER JOIN products WHERE order_details.product_id=products.idproducts AND order_details.order_id="+result[key].order_id;
        db.query(queryprod,  (err,resultt) =>{
            if(err)
            console.log(err);
            Object.keys(resultt).forEach(key=>{
               var p={
                    id:resultt[key].details_id,
                    name:resultt[key].productName,
                    quantity:resultt[key].quantity
                }
                console.log(p);
                d.prods.push(p);
            })
                
                data.push(d);
                console.log(data);
            }) 
        }); 
        res.send(data);
        data.length=0;

});
}
);


module.exports=route;