const express= require("express");
const http = require("http");
const { Server } = require("socket.io");
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
const { simplifyDebts } = require("./utils/debtSimplifier");

let app=express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on("connection", (socket) => {
    socket.on("join_group", (inviteCode) => {
        socket.join(inviteCode);
    });
    socket.on("leave_group", (inviteCode) => {
        socket.leave(inviteCode);
    });
});

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
        const exist=await Expense.find({username}).sort({ createdAt: -1, _id: -1 });
        const data = exist.map(e => {
            const obj = e.toObject();
            if (!obj.createdAt && obj._id) {
                try {
                    obj.createdAt = new Date(parseInt(obj._id.toString().substring(0, 8), 16) * 1000).toISOString();
                } catch {
                    obj.createdAt = new Date().toISOString();
                }
            }
            return obj;
        });
        const total = data.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
        return res.status(200).json({ success: true, message: "Expenses found", data, total: total });
    }catch(err){
        console.log(`Error occured ${err}`);
        return res.status(500).json({message:"Unknown error occured"});
    }
})

// Visual Analytics & Spending Insights
app.get('/analytics/:username', async (req, res) => {
    let { username } = req.params;
    try {
        const exist = await Expense.find({ username }).sort({ createdAt: -1, _id: -1 });
        const expenses = exist.map(e => {
            const obj = e.toObject();
            if (!obj.createdAt && obj._id) {
                try {
                    obj.createdAt = new Date(parseInt(obj._id.toString().substring(0, 8), 16) * 1000).toISOString();
                } catch {
                    obj.createdAt = new Date().toISOString();
                }
            }
            return obj;
        });

        const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
        const totalCount = expenses.length;
        const avgPerExpense = totalCount > 0 ? Math.round(totalSpent / totalCount) : 0;

        // Category breakdown
        const categoryMap = {};
        for (const exp of expenses) {
            const cat = exp.category ? exp.category.trim() : 'Uncategorized';
            if (!categoryMap[cat]) {
                categoryMap[cat] = { category: cat, total: 0, count: 0 };
            }
            categoryMap[cat].total += Number(exp.price) || 0;
            categoryMap[cat].count += 1;
        }

        const categoryBreakdown = Object.values(categoryMap)
            .map(c => ({
                ...c,
                percentage: totalSpent > 0 ? Math.round((c.total / totalSpent) * 100) : 0
            }))
            .sort((a, b) => b.total - a.total);

        // Monthly breakdown (last 6 calendar months)
        const monthMap = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleString('default', { month: 'short' });
            monthMap[key] = { key, label, total: 0, count: 0 };
        }

        for (const exp of expenses) {
            const d = new Date(exp.createdAt);
            if (!isNaN(d.getTime())) {
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                if (!monthMap[key]) {
                    const label = d.toLocaleString('default', { month: 'short' });
                    monthMap[key] = { key, label, total: 0, count: 0 };
                }
                monthMap[key].total += Number(exp.price) || 0;
                monthMap[key].count += 1;
            }
        }

        // Sort months chronologically
        const monthlyTrend = Object.values(monthMap).sort((a, b) => a.key.localeCompare(b.key));

        // Largest single purchase
        let largestExpense = null;
        if (expenses.length > 0) {
            largestExpense = [...expenses].sort((a, b) => Number(b.price) - Number(a.price))[0];
        }

        // Top category
        const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

        // Month-over-month calculation
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthKey = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;

        const currentMonthTotal = monthMap[currentMonthKey]?.total || 0;
        const prevMonthTotal = monthMap[prevMonthKey]?.total || 0;

        let momPercent = 0;
        if (prevMonthTotal > 0) {
            momPercent = Math.round(((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100);
        } else if (currentMonthTotal > 0) {
            momPercent = 100;
        }

        // Daily burn rate in current month
        const dayOfMonth = Math.max(1, now.getDate());
        const dailyBurnRate = Math.round(currentMonthTotal / dayOfMonth);

        return res.status(200).json({
            success: true,
            totalSpent,
            totalCount,
            avgPerExpense,
            categoryBreakdown,
            monthlyTrend,
            largestExpense,
            topCategory,
            currentMonthTotal,
            prevMonthTotal,
            momPercent,
            dailyBurnRate
        });
    } catch (err) {
        console.error("Error generating analytics:", err);
        return res.status(500).json({ success: false, message: "Error generating analytics" });
    }
});

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
    let numMembers = Number(member);
    if (!numMembers || numMembers <= 0) {
        return res.status(400).json({ success: false, message: "Number of members must be greater than 0" });
    }
    let amountShare = Math.round((Number(amount) / numMembers) * 100) / 100;
    let tipShare = Math.round((Number(tip || 0) / numMembers) * 100) / 100;

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
app.post("/group-expenses/:invitelink", async (req, res) => {
    const { invitelink } = req.params;
    const { paidBy, expense, category, description } = req.body;

    try {
        if (!paidBy || expense === undefined || expense === null || !category) {
            return res.status(400).json({ message: "Please fill all required details (category and amount)" });
        }

        const group = await Group.findOne({ inviteCode: invitelink });
        if (!group) {
            return res.status(404).json({ message: "Group not found with this invite code" });
        }

        let user = null;
        try {
            user = await User.findById(paidBy);
        } catch (err) {
            user = await User.findOne({ username: paidBy });
        }

        const payerName = user ? (user.name || user.username) : "Member";
        const desc = (description && description.trim()) ? description.trim() : category.trim();

        let newExpense = new GroupExpense({
            groupId: group._id,
            paidBy: payerName,
            expense: Number(expense),
            category: category.trim().toLowerCase(),
            description: desc
        });

        await newExpense.save();
        io.to(invitelink).emit("expense_updated");
        return res.status(201).json({
            success: true,
            message: "Expense added",
            total: group.members.length
        });

    } catch (e) {
        console.error("Error adding group expense:", e);
        return res.status(500).json({ message: "Something went wrong" });
    }
});


// Fetch Group Name and Members
app.get("/groupchat/:inviteCode",async (req,res)=>{
    let {inviteCode}= req.params;
   
    let group = await Group.findOne({ inviteCode }).populate("members").populate("createdBy");
   
    
    try{
        if(!group){
            return res.status(400).json({success:false, message:"No group found"})
        }
        let expenses=await GroupExpense.find({groupId:group._id}).sort({ createdAt: -1 });
       
        return res.status(200).json({
            success:true,
            group:group,
        expenses:expenses});
    }catch(e){
    return res.status(500).json({message:"Something went wrong"})
    }
})

//  Delete Expense From Group
app.delete("/group-delete/:id", async (req, res) => {
    let { id } = req.params;
    try {
        const exp = await GroupExpense.findById(id);
        if (exp) {
            const group = await Group.findById(exp.groupId);
            await GroupExpense.findByIdAndDelete(id);
            if (group) {
                io.to(group.inviteCode).emit("expense_updated");
            }
        }
        return res.status(200).json({ success: true });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false });
    }
});

// Record Settlement between Debtor and Creditor
app.post("/group-settle/:invitelink", async (req, res) => {
    const { invitelink } = req.params;
    const { fromName, toName, amount } = req.body;

    try {
        if (!fromName || !toName || !amount) {
            return res.status(400).json({ message: "Missing settlement details" });
        }

        const group = await Group.findOne({ inviteCode: invitelink });
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const settlementExpense = new GroupExpense({
            groupId: group._id,
            paidBy: fromName,
            settledWith: toName,
            expense: Number(amount),
            category: "settlement",
            description: `${fromName} paid ${toName}`,
            isSettlement: true
        });

        await settlementExpense.save();
        io.to(invitelink).emit("expense_updated");

        return res.status(201).json({
            success: true,
            message: "Settlement recorded successfully"
        });
    } catch (err) {
        console.error("Settlement error:", err);
        return res.status(500).json({ message: "Failed to record settlement" });
    }
});

// Fetch all groups for a user
app.get("/my-groups/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        let user = null;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            user = await User.findById(userId);
        }
        if (!user) {
            user = await User.findOne({ username: userId });
        }

        if (!user) {
            return res.status(200).json({ success: true, groups: [] });
        }

        const groups = await Group.find({
            $or: [{ members: user._id }, { createdBy: user._id }]
        })
        .populate("members", "name username")
        .sort({ updatedAt: -1 });

        const groupList = await Promise.all(
            groups.map(async (g) => {
                const expenses = await GroupExpense.find({ groupId: g._id, isSettlement: { $ne: true } });
                const total = expenses.reduce((sum, item) => sum + (Number(item.expense) || 0), 0);
                return {
                    _id: g._id,
                    name: g.name,
                    inviteCode: g.inviteCode,
                    membersCount: g.members.length,
                    totalSpend: total,
                    createdAt: g.createdAt
                };
            })
        );

        return res.status(200).json({ success: true, groups: groupList });
    } catch (err) {
        console.error("My groups error:", err);
        return res.status(500).json({ message: "Failed to fetch user groups" });
    }
});

// Algorithmic Debt Simplification (Minimum Cash Flow)
app.get("/group-settlements/:inviteCode", async (req, res) => {
    let { inviteCode } = req.params;
    try {
        let group = await Group.findOne({ inviteCode }).populate("members");
        if (!group) {
            return res.status(404).json({ success: false, message: "No group found" });
        }
        let expenses = await GroupExpense.find({ groupId: group._id });
        let analysis = simplifyDebts(group.members, expenses);
        return res.status(200).json({
            success: true,
            group: {
                _id: group._id,
                name: group.name,
                inviteCode: group.inviteCode,
                membersCount: group.members.length
            },
            ...analysis
        });
    } catch (e) {
        console.error("Debt simplification error:", e);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
});




if (process.env.NODE_ENV !== 'test') {
  server.listen(5000, () => {
    console.log("Server running at 5000 with Socket.IO");
  });
}

module.exports = app;