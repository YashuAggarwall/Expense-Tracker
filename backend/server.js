const express= require("express");
const mongoose= require("mongoose");
const jwt= require("jsonwebtoken");
const bcrypt= require("bcrypt");
const cors= require("cors")
require('dotenv').config();
const User= require("./models/User");
const Expense = require("./models/Expense");
const { nanoid } = require('nanoid'); 

const Group= require("./models/Group")
const GroupExpense=require("./models/GroupExpense");



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
                username: username, 
                id:exist._id
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
            price: Number(price),
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
    

    const total = exist.reduce((acc, curr) => acc + curr.price, 0);
    return res.status(200).json({ success: true, message: "Expenses found", data: exist, total: total });

    }catch(err){
    console.log(`Error occured ${err}`);
    return res.status(500).json({message:"Unknown error occured"});
}
})

// Delete Expense
app.delete('/delete/:id',async (req,res)=>{
    let {id}=req.params;
    try{
        await Expense.findOneAndDelete({_id:id})
        return res.status(200).json({success:true})
    }catch(e){
        console.error(e);
    }
})

// Delete All Expenses
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


// Calculator

app.post("/divider",(req,res) =>{
    let {amount,tip,member}= req.body;
    let amountShare= amount/member;
    let tipShare= tip/member;

    return res.status(200).json({success:true, amountShare, tipShare})
})




// GROUP EXPENSES


// Make a group
app.post("/group",async (req,res) =>{
    let{name, createdBy}=req.body;
    if (!name || !createdBy) {
  return res.status(400).json({ success: false, message: "Missing name or createdBy" });
}

    try{
    const inviteCode= nanoid(10);
    const newGroup= new Group({
        name:name,
        createdBy:new mongoose.Types.ObjectId(createdBy),
        members:[new mongoose.Types.ObjectId(createdBy)],
        inviteCode
    })
    await newGroup.save();
    return res.status(200).json({success:true, message:"Group created", inviteCode})
}catch(e){
    console.log(e);
    return res.status(400).json({success:false, message:"Something went wrong"})
}
})




// JOIN GROUP
app.post('/join-group/:inviteCode', async (req, res) => {
  const { inviteCode } = req.params;
  const { memberID } = req.body;
  console.log("Invite code from req:", inviteCode)


  try {
    const exist = await Group.findOne({ inviteCode });
    if (!exist) {
      return res.status(400).json({ success: false, message: "No such group exist" });
    }
    const memberObjectId = new mongoose.Types.ObjectId(memberID);
    const alreadyMember = exist.members.some(id => id.equals(memberObjectId));
    if (alreadyMember) {
      return res.status(200).json({ success: true, message: "User already exists in group" });
    }

    // Push and save
    exist.members.push(memberObjectId);
    await exist.save();

    return res.status(200).json({ success: true, message: "Welcome to group" });

  } catch (e) {
    console.error("Join group error:", e);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
});


// Add Expense in Group
app.post("/group-expenses/:invitelink",async (req,res) =>{
    const {invitelink}= req.params;
    const { paidBy, expense, category, description } = req.body;
        const user=await User.findOne({_id:paidBy})
    
   
    try{
        
    const group = await Group.findOne({ inviteCode: invitelink });
    const length= group.members.length;
    console.log(length);


    if(!paidBy ||!expense ||!category || !description){
        return res.status(400).json({message:"Please fill all details"})
    }
 

    let newExpense= new GroupExpense({
        groupId: group._id,
        paidBy:user.name,
        expense: Number(expense),
        category:category.trim().toLowerCase(), 
        description:description.trim()

    })
    await newExpense.save();
    return res.status(201).json({success:true, message:"Expense added",total:length
    })

}catch(e){
    console.error("Error:", e);
    return res.status(500).json({message:"Something went wrong"})
}
})


// Fetch Group Name and Members
app.get("/groupchat/:inviteCode",async (req,res)=>{
    let {inviteCode}= req.params;
   
    let group = await Group.findOne({ inviteCode }).populate("members").populate("createdBy");
   
    
    try{
        if(!group){
            return res.status(400).json({success:false, message:"No group found"})
        }
        let expenses=await GroupExpense.find({groupId:group._id})
       
        return res.status(200).json({
            success:true,
            group:group,
        expenses:expenses});
    }catch(e){
    return res.status(500).json({message:"Something went wrong"})
    }
})

//  Delete Expense From Group
app.delete("/group-delete/:id",async (req,res) =>{
    let {id}=req.params;
    try{
        await GroupExpense.findOneAndDelete({_id:id})
        return res.status(200).json({success:true})
    }catch(e){
        console.error(e);
    }

})




if (process.env.NODE_ENV !== 'test') {
  app.listen(5000, () => {
    console.log("Server running at 5000")
});
}

module.exports = app;