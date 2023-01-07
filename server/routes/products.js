const express= require("express");
const route=express.Router();
const multer=require('multer');
const db=require("./db.js");

//-------------------read-all-products----------------------------------

route.get("/read-prod",(req,res)=>{
  
    const sqlSelect="SELECT  * FROM products";
    db.query(sqlSelect, (err,result)=>{
        res.send(result);
    });
}
);

//--------------------read-a-product-by-id-------------------------------

route.get('/get-by-id/:id',(req,res)=>{

const id=req.params.id;
console.log(id);
const sqlSelectById="SELECT * FROM products WHERE idproducts="+id;
db.query(sqlSelectById,(err,result)=>{
    res.send(result);
    console.log(result);
});
});


// -------------------img storage confing--------------------------------

var imgconfig = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads");
    },
    filename:(req,file,callback)=>{
        callback(null,`image-${Date.now()}.${file.originalname}`)
    }
});
var upload = multer({
    storage:imgconfig,
})

//---------------------insert-product------------------------------

route.post("/insert-prod", upload.single('image'),(req,res)=>{

    
    const productName=req.body.productName;
    const color=req.body.color;
    const material=req.body.material;
    const price=req.body.price;
    const descr=req.body.descr;
    let image="";
    if(req.file)
     image=req.file.filename;
    else
     image="";

    console.log("Product name:"+productName+"\nColor:"+color+"\nMaterial:"+material+"\nPrice:"+price+"\nDesc"+descr+"\nImgP:"+image);

    if(productName&&color&&price&&descr&&material){
        const sqlInsert="INSERT INTO products (productName, color, material, price, descr, photo) VALUES (?,?,?,?,?,?)";
        db.query(sqlInsert, [productName, color, material, price, descr, image], (err,result)=>{
        console.log(result);
        if(err) throw err;
        else
         res.status(201).json({status:201,message:"Product added!"});
    });
    }
    else
      res.status(422).json({status:422,message:"Complete all fields"});

});

//--------------------------------delete product---------------------------

route.delete("/delete/:id",(req,res)=>{
    const id=req.params.id;
    const sqlSelectById="DELETE FROM products WHERE idproducts="+id;
    db.query(sqlSelectById,(err,result)=>{
    if(err)
    console.log(err);
    res.status(201).json({status:201,message:"Product added!"});
});
});

//----------------------update-product-----------------------------


route.put("/update", upload.single('image'),(req,res)=>{

    const id=req.body.id;
    const productName=req.body.productName;
    const color=req.body.color;
    const material=req.body.material;
    const price=req.body.price;
    const descr=req.body.descr;
    console.log(id);
    let image="";
    if(req.file)
     image=req.file.filename;
    else
     image="";

    if(id&&image!==''){
        const sqlInsert="UPDATE  products SET productName=?, color=?, material=?, price=?, descr=?, photo=? WHERE idproducts="+id;
        db.query(sqlInsert, [productName, color, material, price, descr, image], (err,result)=>{
        console.log(result);
        if(err) throw err;
        else
         res.status(201).json({status:201,message:"Product added!"});
    });
    }
    else if(id){
        const sqlInsert="UPDATE  products SET productName=?, color=?, material=?, price=?, descr=? WHERE idproducts="+id;
        db.query(sqlInsert, [productName, color, material, price, descr], (err,result)=>{
        console.log(result);
        if(err) throw err;
        else
         res.status(201).json({status:201,message:"Product added!"});
    });}
    else
      res.status(422).json({status:422,message:"err"});

});


module.exports=route;