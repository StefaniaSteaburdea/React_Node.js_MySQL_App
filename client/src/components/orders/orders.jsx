import { useState } from "react";
import { useEffect } from "react";
import Axios from 'axios';
import styles from './orders.module.css'

export function Orders(){
    
    const[data,setData]=useState(null);
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState(false);

    useEffect(()=>{
        const fetchPosts=async()=>{
            try{
            setLoading(true);
            const response=await Axios.get("http://localhost:3001/order/read-orders");
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

    return(
        <>
        {error && "Error, try again later"}
        {loading && "Loading..."}
        <div className="container_cards">
        <table>
            <thead>
            <tr>
                <th>Order ID</th>
                <th>Name</th>
                <th>Adress</th>
                <th>Phone</th>
                <th>Price</th>
                <th>Products</th>
            </tr></thead>
            <tbody>
        { data && data.map((post)=>{
                return(
                    <tr key={post.order_id}>
                    <td>{post.order_id}</td>
                    <td>{post.name}</td>
                    <td>{post.adress}</td>
                    <td>{post.phone}</td>
                    <td>{post.price}$</td>
                    <td  className={styles.container}>
                   { post.prods && post.prods.map((product)=>{
                            return(
                               <div key={product.id} > 
                                    Product: {product.name},
                                    Quantity: {product.quantity} 
                               </div>
                                );
                        })}</td>
                    </tr>
                );   
            }
        )}
        </tbody>
        </table>
        </div>
        </>
    )
}