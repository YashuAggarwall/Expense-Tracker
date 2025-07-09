const mongoose= require('mongoose');

const expenseSchema= new mongoose.Schema({
    category:{type: String , required: true},
    price:{type: String , required: true},
    username:{type:String , required: true, unique:true}
})

const Expense= mongoose.model("Expense", expenseSchema);

module.exports= Expense;