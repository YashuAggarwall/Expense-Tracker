const express= require("express");
const mongoose= require("mongoose");
const jwt= require("jsonwebtoken");
const bcrypt= require("bcrypt");
const cors= require("cors")
require('dotenv').config();
const User= require("./models/User");
const Expense = require("./models/Expense");

let app=express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MongooseUri)
.then(()=>{
    console.log("Database Connected")}
).catch((err)=>{
    console.log("Error occured", err);}
)


app.post("/signup", async(req,res)=>{
    let {name, username, password}=req.body;
    const exist=await User.findOne({username});
    const hashedpassword=await bcrypt.hash(password,10);
try{
    if(exist){
        return res.status(400).json({success:false, message:"User Already Exist"});
    }
    
        const newUser=  new User({
            name: name,
            username: username,
            password: hashedpassword
        })
        await newUser.save();
        return res.status(200).json({success: true , message:"User added Successfully"})
    
    
}catch(err){
    console.log(`Error occured ${err}`);
    return res.status(500).json({message:"Unknown error occured"});
}
    

})


app.post('/login' , async (req,res) => {
    let {username , password}= req.body;
    const exist= await User.findOne({username});
    try{
        if(!exist){
            return res.status(400).json({success:false, message:"User Does not Exist"});

        }
        const verify=await bcrypt.compare(password, exist.password);
        if(verify){
            const token=jwt.sign({id:exist._id}, process.env.secret, {expiresIn: "1hr"})
            return res.status(200).json({
                success: true,
                message:"Loggined",
                token: token,
                username: username
            })
        }
        else{
            return res.status(400).json({
                success: false,
                message:"Invalid credentials"
            })
        }
    }catch(err){
    console.log(`Error occured ${err}`);
    return res.status(500).json({message:"Unknown error occured"});
}
    

})


app.post('/add-expense',async(req,res) =>{
    let {category, price, username}= req.body;

    try{
        let newExpense= new Expense({
            category: category,
            price: price,
            username:username
        })
        
        await newExpense.save();
        return res.status(201).json({success:true, message:"Addded to Database"})

    }catch(err){
    console.log(`Error occured ${err}`);
    return res.status(500).json({message:"Unknown error occured"});
}
})


app.get('/expenses/:username', async (req,res) =>{
    let {username}= req.params;
    try{ 
    const exist=await Expense.find({username});
    if(exist.length==0){
        return res.status(400).json({message:"No expenses added"})
    }
   return res.status(200).json({success:true, message:"Expenses found", data:exist})
    }catch(err){
    console.log(`Error occured ${err}`);
    return res.status(500).json({message:"Unknown error occured"});
}
})


app.delete('/expense-delete/:username' , async(req,res) =>{
      let {username}= req.params;
      try{
        const exist=await Expense.find({username});
    if(exist.length==0){
        return res.status(400).json({message:"No expenses found"})
    }
    await Expense.deleteMany({username});
    return res.status(200).json({success:true, message:"Expenses deleted"})
   
      }catch(err){
    console.log(`Error occured ${err}`);
    return res.status(500).json({message:"Unknown error occured"});
}
      
})


app.put('/expense-edit/:id', async(req,res) =>{
    let {id}= req.params;
    let {category , price}= req.body;
    const exist= await Expense.findById(id);
    try{
        if(!exist){
            return res.status(404).json({message:"No expense Found"})
        }

        await Expense.findByIdAndUpdate(id, {
            category:category,
            price: price
        })

        return res.status(200).json({success: true, message:"Data Updated"})

    }catch(err){
    console.log(`Error occured ${err}`);
    return res.status(500).json({message:"Unknown error occured"});
}
})


app.get('/summary/:username',async (req,res) =>{
    let {username}= req.params;
    const exist=await Expense.find({username});
    let total=0;


    try{
        if(exist.length===0){
        return res.status(404).json({message:"No expense Found"})
        }

        for(let i=0; i<exist.length; i++ ){
            total=total+ exist[i].price;
        }

        return res.status(200).json({success:true, message:`The Total Expense is ${total} `})



    }catch(err){
    console.log(`Error occured ${err}`);
    return res.status(500).json({message:"Unknown error occured"});
}


})


app.listen(5000,()=>{
    console.log("Server running at Port 5000");
})
