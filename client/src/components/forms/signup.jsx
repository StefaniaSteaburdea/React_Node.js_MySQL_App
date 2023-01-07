import { useState } from "react";
import Axios from 'axios';
import {useNavigate} from 'react-router-dom';
import styles from "./forms.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

const defaultUser={
    name:"",
    password:"",
    phone:"",
    adress:"",
};

export default function SignUp(){

    const [user,setUser]=useState(defaultUser);
    const [pass2, setPass2]=useState('');
    const{name,password,phone,adress}=user;
    const history=useNavigate();

    const onChange=(e)=>{
        setUser((prevState)=>({
            ...prevState,[e.target.id]:e.target.value,
        }));
    }
    const onChangePass2=(e)=>{
        setPass2(e.target.value);
    }
    const onSubmit=(e)=>{
        e.preventDefault();
        console.log(user);
        try{
            Axios.post("http://localhost:3001/auth/insert-user",user)
            .then(res=>{
                if(res.status===201){
                    history("/prodList");
                }
                else
                  if(res.status===422){
                    alert(res.message);
                  }
             }); 

            setUser(defaultUser);
            
        }catch(error){
            console.log(error);
            alert("The account could not be created,verify your internet connection and try again later");
        }
    }

    return(
        <>
            
            <Form className={styles.form} id="usersForm" onSubmit={onSubmit}>
            <h3 className={styles.header}>Sign Up</h3>
              <Form.Group className={styles.group}>
                <Form.Label htmlFor="name">Name*</Form.Label>
                <Form.Control required type="text" name="name" id="name" value={name} onChange={onChange}/>
              </Form.Group >
              <Form.Group className={styles.group}>
                <Form.Label htmlFor="password">Password*</Form.Label>
                <Form.Control required type="password" name="password" id="password" value={password} onChange={onChange}/>
                </Form.Group>
              <Form.Group className={styles.group}>
                <Form.Label htmlFor="password2">Password confirmation*</Form.Label>
                <Form.Control required type="password" name="password2" id="password2" value={pass2} onChange={onChangePass2}/>
                </Form.Group>
              <Form.Group className={styles.group}>
                <Form.Label htmlFor="adress">Adress*</Form.Label>
                <Form.Control required type="text" name="adress" id="adress" value={adress} onChange={onChange}/>
              </Form.Group>
              <Form.Group className={styles.group}>
                <Form.Label htmlFor="phone">Phone*</Form.Label>
                <Form.Control type="numeric" name="phone" id="phone" value={phone} onChange={onChange}/>
              </Form.Group>
                <Button className={styles.submit_button} type="submit">Submit</Button><br/>
            </Form>
        </>
    );

}