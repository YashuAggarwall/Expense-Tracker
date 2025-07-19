const mongoose= require("mongoose");


const groupSchema= new mongoose.Schema({
    name:{
        type:String, 
        required:true
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],

    inviteCode:{
        type:String, 
        required:true,
        unique:true
    }
},{
    timestamps: true
}
)


const Group= mongoose.model("Group", groupSchema);

module.exports=Group;