import { useState } from "react";
import { useEffect } from "react";
import Axios from 'axios';
import {Link} from 'react-router-dom';
import styles from "./forms.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

Axios.defaults.withCredentials=true;

const defaultUser={
    name:"",
    password:"",
};

export default function Login(){

    const [user,setUser]=useState(defaultUser);
    const{name,password}=user;
    //const history=useNavigate();
    const [errMsg, setErrMsg]=useState("");
    const onChange=(e)=>{
        setUser((prevState)=>({
            ...prevState,[e.target.id]:e.target.value,
        }));
    }
    const onSubmit=(e)=>{
        e.preventDefault();
        console.log(user);
        try{
            Axios.post("http://localhost:3001/auth/login",user)
            .then(res=>{
                if(res.data.status===201){
                    window.open("/prodList");
                    console.log(res.data.message);
                }
                else
                  if(res.data.status===422){
                    console.log(res.data.message);
                    setErrMsg(res.data.message);
                  }
             }); 

            setUser(defaultUser);
            
        }catch(error){
            console.log(error);
            alert("The account could not be created,verify your internet connection and try again later");
        }
    }

    useEffect(()=>{
        Axios.get("http://localhost:3001/auth/login")
        .then(res=>{
            if(res.data.loggedIn)
            window.open("/prodList");
            console.log(res);
         }); 
    },[]);

    return(
        <>
            
            <Form className={styles.form} id="usersForm" onSubmit={onSubmit}>
            <h3 className={styles.header}>Login</h3>
            
              <Form.Group className={styles.group}>
                <Form.Label htmlFor="name">Name*</Form.Label>
                <Form.Control required type="text" name="name" id="name" value={name} onChange={onChange}/>
              </Form.Group >
              <Form.Group className={styles.group}>
                <Form.Label htmlFor="password">Password*</Form.Label>
                <Form.Control required type="password" name="password" id="password" value={password} onChange={onChange}/>
                </Form.Group>
                <p className={styles.errMsg}>{errMsg}</p>
                <Button className={styles.submit_button} type="submit">Submit</Button><br/>
                <Link to='/signup'>Create an account</Link>
            </Form>
        </>
    );

}