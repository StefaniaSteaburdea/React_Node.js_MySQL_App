import { useEffect, useState } from "react";
import Axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';
import styles from "./forms.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

const defaultProduct={
    productName:"",
    color:"",
    material:"",
    price:0,
    descr:"",

};

export default function ProductForm(){

    const [product,setProduct]=useState(defaultProduct);
    const [id,setId]=useState(0);
    const location = useLocation();
    const [isUpdate,setIsUpdate]=useState(false);
    const [image, setImage] = useState([]);
    useEffect( () => {
      if (location.state) {
        setProduct(location.state);
        setIsUpdate(true);
        setId(location.state.idproducts);
        console.log(id);
      } else 
        console.log("Nothing");
      }, [] );
    console.log(product);
    const{idproduct,productName,color,material,price,descr}=product;
    const history=useNavigate();
    
    const onChange=(e)=>{
        setProduct((prevState)=>({
            ...prevState,[e.target.id]:e.target.value,
        }));
    }
    const handleFileChange = (e) => {
        setImage(e.target.files[0]); 
        console.log(image,12);
    }

    const onSubmit=(e)=>{
        e.preventDefault();
        console.log(product);
        try{
            const formData=new FormData();
            formData.append("productName",product.productName);
            formData.append("color",product.color);
            formData.append("material",product.material);
            formData.append("price",product.price);
            formData.append("descr",product.descr);
            formData.append("image",image);

            console.log("image append");
            if(!isUpdate){
                Axios.post("http://localhost:3001/products/insert-prod",formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                })
              .then(res=>{
                  if(res.status===201){
                      history("/prodList");
                  }
                  else
                    if(res.status===422){
                      alert(res.message);
                    }
              }); 

              setProduct(defaultProduct);
            }
            else{
              formData.append("id",id);
              Axios.put("http://localhost:3001/products/update",formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
            .then(res=>{
                if(res.status===201){
                    history("/prodList");
                }
                else
                  if(res.status===422){
                    alert(res.message);
                  }
            }); 
            }
            
            
        }catch(error){
            console.log(error);
            alert("The product could not be saved, try again later");
        }
    }

    return(
        <>
            
            <Form className={styles.form} id="productsForm" encType="multipart/form-data" onSubmit={onSubmit}>
            {!isUpdate&&<h3 className={styles.header}>Add a new product</h3>}
            {isUpdate&&<h3 className={styles.header}>Update product</h3>}
              <Form.Group className={styles.group}>
                <Form.Label htmlFor="productName">Product Name*</Form.Label>
                <Form.Control required type="text" name="productName" id="productName" value={productName} onChange={onChange}/>
              </Form.Group >
              <Form.Group className={styles.group}>
                <Form.Label htmlFor="color">Color*</Form.Label>
                <Form.Control required type="text" name="color" id="color" value={color} onChange={onChange}/>
                </Form.Group>
              <Form.Group className={styles.group}>
                <Form.Label htmlFor="material">Material*</Form.Label>
                <Form.Control required type="text" name="material" id="material" value={material} onChange={onChange}/>
                </Form.Group>
              <Form.Group className={styles.group}>
                <Form.Label htmlFor="price">Price*</Form.Label>
                <Form.Control required type="numeric" name="price" id="price" value={price} onChange={onChange}/>
              </Form.Group>
              <Form.Group className={styles.group}>
                <Form.Label htmlFor="descr">Description</Form.Label>
                <Form.Control as="textarea" rows={3} name="descr" id="descr" value={descr} onChange={onChange}/>
              </Form.Group>
              <Form.Group className={styles.group}>
              {!isUpdate&&<Form.Label htmlFor="photo">Upload file:</Form.Label>}
              {isUpdate&&<Form.Label htmlFor="photo">Change the photo:</Form.Label>}
                <Form.Control type="file" name="photo" id="photo" onChange={handleFileChange}/>
              </Form.Group>
                <Button className={styles.submit_button} type="submit">Submit</Button>
            </Form>
        </>
    );

}