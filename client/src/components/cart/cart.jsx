import { useContext, useEffect } from 'react';
import {CartContext} from '../../context/cartContext'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./cart.module.css";
import Button from 'react-bootstrap/esm/Button';
import Axios from 'axios';
import { useState } from 'react';
import '../../App.css';

export default function Cart(){
    const [id,setId]=useState(0);
    useEffect(()=>{
        Axios.get("http://localhost:3001/auth/login")
        .then(res=>{
            if(res.data.loggedIn)
            setId(res.data.user.idusers);
         }); 
    },[]);

    const buyProd=useContext(CartContext);
    const prod=buyProd.items;
    console.log(prod);

    const delAll=()=>{
        var i;
        for(i=0;prod[i];i++)
        {
        buyProd.deleteFromCart(prod[i].id);
        }
    }
    
    const arr=[];

    function productsSendToDB(){
        var i;
        for(i=0;prod[i];i++){
            var id=prod[i].id;
            var quantity=prod[i].quantity;
            console.log("id: "+id+" q: "+quantity);
            arr.push({id:id,quantity:quantity});
        }
    }
    const addToDb=()=>{
        productsSendToDB();
        const data={
            userId:id,
            price:buyProd.getTotalCost(),
            prods:arr
        }

        try{
            Axios.post("http://localhost:3001/order/insert-order",data)
            .then(res=>{
                if(res.status===201){
                    console.log("ok");
                }
                else
                  if(res.status===422){
                    alert(res.message);
                  }
             }); 
            
        }catch(error){
            console.log(error);
            alert("The account could not be created,verify your internet connection and try again later");
        }

    }
    const placeOrder=()=>{
     if(buyProd.getTotalCost()>0){
        try{
            Axios.post("http://localhost:3001/order/place_order",JSON.stringify({items:prod}),{
                headers:{
                    'Content-Type':'application/json'
                }
            }
            )
            .then(res=>{
                if(res.status===201){
                    delAll();
                    addToDb();
                    window.location=res.data.url;
                }
                else
                  if(res.status===500){
                    console.log(res.data.error);
                  }
             }); 

            
        }catch(error){
            console.log(error);
            alert("The order could not be placed,verify your internet connection and try again later");
        }
     } else
       alert("No products");
        
    } 
    return(
        <>
        {prod.length===0&&<p className={styles.noProd}>You haven't chosen any product yet</p>}
        {prod.length>0&&<div>
         <h2 className={styles.title}>My cart</h2>
         {prod && prod.map((product)=>{
            return(
                <div className={styles.container} key={product.id}>
                <table>
                    <tbody>
                    <tr>
                    <td className={styles.imageContainer}><img src={`http://localhost:3001/uploads/${product.photo}`} alt="" className={styles.image} /></td>
                    <td className={styles.infoContainer}>
                        <div className='info-container'>
                            <div><h5>{product.name}</h5></div>
                            <div>Price: {product.price}$ x{product.quantity}</div>
                        </div>
                    </td>
                    <td className={styles.add_del_btn}>
                        <div className='d-flex align-items-center justify-content-center'>
                            <Button className={styles.amount_button} onClick={()=>buyProd.removeOneFromCart(product.id)}>-</Button>
                            
                            <div><p className={styles.numbers} >{product.quantity}</p></div>
                            <Button className={styles.amount_button} onClick={()=>buyProd.addOneToCartt(product)}>+</Button>
                        </div>
                    </td>
                    </tr></tbody>
                </table>
                </div>
            );
         })
         }
         <h3 className={styles.total}>Total: {buyProd.getTotalCost()}$</h3>
         <Button className={styles.submit_button} onClick={placeOrder}>Place order</Button><br/></div>}
        </>
    );
}