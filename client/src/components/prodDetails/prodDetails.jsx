import React, { useContext } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Axios from 'axios';
import styles from "./prodDetails.module.css";
import Card from "react-bootstrap/esm/Card";
import Button from 'react-bootstrap/Button';
import {CartContext} from '../../context/cartContext';

const defaultUser={
    username:"",
    password:"",
    phone:"",
    adress:"",
  };

export default function ProdDetails({cartItems,handleClick}){
const {id}=useParams();
const[data,setData]=useState(null);
const[loading,setLoading]=useState(false);
const[error,setError]=useState(false);

const navigate=useNavigate();
    useEffect(()=>{
        const fetchPosts=async()=>{
            try{
            setLoading(true);
            const response=await Axios.get(`http://localhost:3001/products/get-by-id/${id}`);
            setData(response.data);
            setLoading(false);
            setError(false);
            }catch(e){
                setLoading(false);
                setError(true);
            }
        };
        fetchPosts();
    },[]);

    const [user,setUser]=useState(defaultUser);

    useEffect(()=>{
      Axios.get("http://localhost:3001/auth/login")
      .then(res=>{
          if(res.data.loggedIn)
          setUser(res.data.user);
       }); 
  },[]);

  const cart=useContext(CartContext);
  const addToCart=(product)=>{
    if(user.username!=="")
    cart.addOneToCart(product);
    else
      navigate("/login");
  }
  const deleteProd=(product)=>{
    const id=product.idproducts;
    console.log(id);
    Axios.delete(`http://localhost:3001/products/delete/${id}`);
    navigate("/prodList");
  }


  const goToEdit=(product)=>{
    navigate('/prodForm',{state:product});
      }

    return(
        <>
        {error && "Error, try again later"}
        {loading && "Loading..."}
        <div className="container">
        <Card className={styles.card}>
        { data && data.map((post)=>{
                return(
                    <table >
                    <tr>
                        <td className={styles.photo}><img src={`http://localhost:3001/uploads/${post.photo}`} alt="" className={styles.photo}/></td>
                        <td className={styles.items}> 
                        <div key={post.id}>
                           <h2 > {post.productName} </h2>
                            <h4>Price:{post.price}$</h4>
                            <p>{post.descr}</p>
                            <p>Material:{post.material}</p>
                            <p>Color:{post.color}</p>
                            {user.username==="Admin"&&<Button className={styles.button} onClick={()=>goToEdit(post)}>Update</Button>}
                            {user.username==="Admin"&&<Button className={styles.button} onClick={()=>deleteProd(post)}>Delete</Button>}
                            {user.username!=="Admin"&&<Button className={styles.button} onClick={()=>addToCart(post)}>Add to cart</Button>}
                           </div></td>
                    </tr>
                    </table>
                );   
            }
        )}
        </Card>
        </div>
        </>
    );
}