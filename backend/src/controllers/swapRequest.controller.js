const expressAsyncHandler = require("express-async-handler");
const ApiResponse = require("../utils/ApiResponse.utils");
const ErrorHandler = require("../utils/ErrorHandler.utils");
const SwapRequestCollection = require("../models/swapRequest.model");
const eventCollection = require("../models/event.model");

const allSwappableSlots = expressAsyncHandler(async(req,res,next)=>{
    let slots = await eventCollection.find({status:"SWAPPABLE",user:{$ne:req.user._id}});
    if(slots.length===0) throw new ErrorHandler(404,"No swappable slots found");
    new ApiResponse(200,true,"Swappable slots found successfully",slots).send(res);
})

const createSwapRequest = expressAsyncHandler(async(req,res,next)=>{
    let {mySlotId,theirSlotId} = req.body;
    let myslot = await eventCollection.findById(mySlotId);
    let theirslot = await eventCollection.findById(theirSlotId);
    if(!myslot || !theirslot) throw new ErrorHandler(404,"One or both slots not found");
    if(myslot.status !== "SWAPPABLE" || theirslot.status !== "SWAPPABLE"){
        throw new ErrorHandler(400,"One or both slots are not swappable");
    }
    const swapRequest = await SwapRequestCollection.create({
        requester:req.user._id,
        receiver:theirslot.user,
        myslot:mySlotId,
        theirslot:theirSlotId,
    });

    myslot.status = "SWAP_PENDING";
    theirslot.status = "SWAP_PENDING";
    myslot.save();
    theirslot.save();
    new ApiResponse(200,true,"Swap request created successfully",swapRequest).send(res);
})

const respondToSwapRequest = expressAsyncHandler(async(req,res,next)=>{
    let {accept} = req.body;
    let swapRequestId = req.params.id;
    // console.log(accept);
    // console.log(swapRequestId);
    const swap = await SwapRequestCollection.findById(swapRequestId).populate("myslot").populate("theirslot");
    // console.log(swap);
    if(!swap) throw new ErrorHandler(404,"Swap request not found");
    if(swap.status!=="PENDING") throw new ErrorHandler(400,"Swap request is not pending");
    if(!accept){
        swap.status = "REJECTED";
        await swap.save();
        swap.myslot.status = "SWAPPABLE";
        swap.theirslot.status = "SWAPPABLE";
        await swap.myslot.save();
        await swap.theirslot.save();
        new ApiResponse(200,true,"Swap request rejected successfully",swap).send(res);
    }
    const tempUser = swap.myslot.user;
    swap.myslot.user = swap.theirslot.user;
    swap.theirslot.user = tempUser;

    swap.myslot.status = "BUSY";
    swap.theirslot.status = "BUSY";

    swap.status = "ACCEPTED";
    await swap.myslot.save()
    await swap.theirslot.save()
    await swap.save();
    new ApiResponse(200,true,"Swap request accepted successfully",swap).send(res);
})

const getSwapRequest = expressAsyncHandler(async(req,res,next)=>{
    let incomingRequest = await SwapRequestCollection.find({receiver:req.user._id})
    .populate("myslot")
    .populate("theirslot")
    .populate("requester","name email");
    
    let outgoingRequest = await SwapRequestCollection.find({requester:req.user._id})
    .populate("myslot")
    .populate("theirslot")
    .populate("receiver","name email");
    new ApiResponse(200,true,"Swap requests found successfully",{
        incomingRequest,
        outgoingRequest
    }).send(res);
})

module.exports = {
    allSwappableSlots,
    createSwapRequest,
    respondToSwapRequest,
    getSwapRequest
};
