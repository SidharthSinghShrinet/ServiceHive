const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema({
    requester:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    myslot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
        required:true
    },
    theirslot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
        required:true
    },
    status:{
        type:String,
        enum:["ACCEPTED","REJECTED","PENDING"],
        default:"PENDING"
    }
},{
    timestamps:true
});

module.exports = mongoose.model("SwapRequest",swapRequestSchema);