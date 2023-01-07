import './App.css';
import React from 'react';
import ProductForm from './components/forms/productForm';
import ProdDetails from './components/prodDetails/prodDetails';
import ProductsList from './components/productsList';
import Login from './components/forms/login';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import MyNavbar from './components/navBar/myNavbar';
import SignUp from './components/forms/signup';
import Cart from './components/cart/cart';
import CartProvider from './context/cartContext';
import { Orders } from './components/orders/orders';
import { OrdersUser } from './components/orders/ordersUser';

function App() {

  return (
    <CartProvider>
    <div className="App">
      <Router>
        <React.Fragment>
          <MyNavbar/>
        </React.Fragment>
        <Routes>
          
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/prodList' element={<ProductsList/>}/>
          <Route path='/prodForm' element={<ProductForm/>}/>
          <Route path='/prodDetails/:id' element={<ProdDetails/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/orders' element={<Orders/>}/>
          <Route path='/ordersUser' element={<OrdersUser/>}/>
        </Routes>
      </Router>
    </div>
    </CartProvider>
  );
}

export default App;
