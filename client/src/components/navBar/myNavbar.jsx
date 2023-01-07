import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Img from '../../assets/shopping-bag.png';
import Img2 from '../../assets/Logout.png';
import styles from "./myNavbar.module.css";
import {CartContext} from '../../context/cartContext';

const defaultUser={
  username:"",
  password:"",
  phone:"",
  adress:"",
};

export default function MyNavbar(){

  const history=useNavigate();
  const [user,setUser]=useState(defaultUser);

  useEffect(()=>{
    Axios.get("http://localhost:3001/auth/login")
    .then(res=>{
        if(res.data.loggedIn)
        setUser(res.data.user);
     }); 
},[]);

  const logout=()=>{
      Axios.get("http://localhost:3001/auth/logout")
      .then(res=>{
          if(!res.data.loggedIn){
          history("/login");
          setUser(defaultUser);
          }
       });
  };
  const c=useContext(CartContext);
  const allProducts=c.items.reduce((sum,product)=>sum+product.quantity,0);
  const pr=c.items;
  return (
    <Navbar bg="light" fixed="top" >
      <Container>

          <Nav>
            
            <Navbar.Brand href="/prodList">Brand</Navbar.Brand>
            <Nav.Link href="/prodList">Home</Nav.Link>
            {user.username==="Admin"&&<Nav.Link href="/prodForm">Add Product</Nav.Link>}
            {user.username!==""&&user.username!=="Admin"&&<Nav.Link href="/ordersUser">Orders</Nav.Link>}
            
            {user.username==="Admin"&&<Nav.Link href="/orders">Orders</Nav.Link>}
            {user.username===""&&<Nav.Link href="/login">Login</Nav.Link>}
            
          </Nav>
          <Nav>
          {user.username!==""&&user.username!=="Admin"&&<Link to="/cart"><p className={styles.countitems}>{allProducts}</p><img className={styles.image} src={Img} alt="Cart" items={pr}/></Link>}
          {user.username!==""&&<Link to="/login" onClick={logout}><img className={styles.image2} src={Img2} alt="Cart" items={pr}/></Link>}
          </Nav>
       </Container>
    </Navbar>
  );
}