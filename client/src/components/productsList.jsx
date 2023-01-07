import { useState } from "react";
import { useEffect } from "react";
import Axios from 'axios';
import ProductCard from "./productCard/productCard";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

export default function ProductList(){

    const[data,setData]=useState(null);
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState(false);

    

    useEffect(()=>{
        const fetchPosts=async()=>{
            try{
            setLoading(true);
            const response=await Axios.get("http://localhost:3001/products/read-prod");
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
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
        { data && data.map((post)=>{
                return(
                    <Col key={post.idproducts}>
                    <div >
                      <ProductCard product={post}/>
                    </div>
                    </Col>
                );   
            }
        )}
        </Row>
        </div>
        </>
    )
}