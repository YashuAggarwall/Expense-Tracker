const mongoose= require('mongoose');

const expenseSchema= new mongoose.Schema({
    category:{type: String , required: true},
    price:{type: Number , required: true},
    username:{type:String , required: true}
})

const Expense= mongoose.model("Expense", expenseSchema);

module.exports= Expense;