const expressAsyncHandler = require("express-async-handler");
const eventCollection = require("../models/event.model");
const ApiResponse = require("../utils/ApiResponse.utils");
const ErrorHandler = require("../utils/ErrorHandler.utils");

const createEvent = expressAsyncHandler(async(req,res,next)=>{
    let {title,startTime,endTime,status} = req.body;
    let userId = req.user._id;
    let event = await eventCollection.create({title,startTime,endTime,status,user:userId});
    if(!event) throw new ErrorHandler(500,"Could not create event");
    new ApiResponse(201,true,"Event created successfully",event).send(res);
})

const getAllEvent = expressAsyncHandler(async(req,res,next)=>{
    let events = await eventCollection.find({user:req.user._id});
    if(events.length === 0) throw new ErrorHandler(404,"No events found");
    new ApiResponse(200,true,"Events found successfully",events).send(res);
})

const updateEvent = expressAsyncHandler(async(req,res,next)=>{
    let userId = req.user._id;
    let eventId = req.params.id;
    // let event = await eventCollection.findByIdAndUpdate({_id:eventId,user:userId},req.body,{new:true,runValidators:true});
    let searchEvent = await eventCollection.findOne({_id:eventId,user:userId});
    if(!searchEvent) throw new ErrorHandler(404,"Event not found");
    let event = await eventCollection.updateOne({_id:eventId,user:userId},{$set:{
        title:req.body.title || searchEvent.title,
        startTime:req.body.startTime || searchEvent.startTime,
        endTime:req.body.endTime || searchEvent.endTime,
        status:req.body.status || searchEvent.status
    }});
    if(!event) throw new ErrorHandler(404,"Event not found");
    let updatedEvent = await eventCollection.findOne({_id:eventId,user:userId});
    new ApiResponse(200,true,"Event updated successfully",updatedEvent).send(res);
})

const deleteEvent = expressAsyncHandler(async(req,res,next)=>{
    let userId = req.user._id;
    let eventId = req.params.id;
    let event = await eventCollection.findByIdAndDelete({_id:eventId,user:userId});
    if(!event) throw new ErrorHandler(404,"Event not found");
    new ApiResponse(200,true,"Event deleted successfully",event).send(res);
})

module.exports = {
    createEvent,
    getAllEvent,
    updateEvent,
    deleteEvent
};