import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./productCard.module.css";
import Img from '../../assets/fashioncard.png';
import CloseButton from 'react-bootstrap/esm/CloseButton';
import Axios from 'axios';
import { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useContext } from 'react';
import {CartContext} from '../../context/cartContext'


const defaultUser={
  username:"",
  password:"",
  phone:"",
  adress:"",
};


export default function ProductCard( {product}){

    const {idproducts,productName,price,photo} =product;
    const navigate=useNavigate();
    const [user,setUser]=useState(defaultUser);
    useEffect(()=>{
      Axios.get("http://localhost:3001/auth/login")
      .then(res=>{
          if(res.data.loggedIn)
          setUser(res.data.user);
       }); 
  },[]);

  const cart=useContext(CartContext);
    const addToCart=()=>{
      if(user.username!=="")
      cart.addOneToCart(product);
      else
        navigate("/login");
    }
    
    const deleteProd=()=>{
      const id=product.idproducts;
      console.log(id);
      Axios.delete(`http://localhost:3001/products/delete/${id}`);
      window.open("/prodList");
    }


    const goToEdit=()=>{
      navigate('/prodForm',{state:product});
        }
    return(
        <>
            <Card className={styles.card} key={idproducts}>
            {user.username==="Admin"&&<div className={styles.close_container}><CloseButton className={styles.close_button} onClick={deleteProd}/></div>}
             <div onClick={()=>{ navigate(`/prodDetails/${idproducts}`);}}>
              <Card.Img variant="top" src={`http://localhost:3001/uploads/${photo}`} 
                                      onError={(e) =>(
                                        
                                          (e.target.src =Img))
                                        }
                                        alt="" className={styles.photo} />
              <Card.Body className={styles.container_txt}>
                <Card.Title className={styles.ajustHeight}>{productName}</Card.Title>
                <Card.Text>{price}$ </Card.Text>
              </Card.Body>
              </div>
              <div className={styles.container_btn}>
              {user.username==="Admin"&&<Button  className={styles.del_button} onClick={()=>{goToEdit()}}>Update</Button>}
              {user.username!=="Admin"&&<Button className={styles.del_button} onClick={addToCart}>Add to cart</Button>}
              </div>
            </Card> 
        </>
    );
}