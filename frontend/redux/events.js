import { createSlice } from "@reduxjs/toolkit";

const eventsSlice = createSlice({
    name:"events",
    initialState:{
        allEvents:[],
        swappableSlots:[]
    },
    reducers:{
        setAllEvents:(state,action)=>{
            state.allEvents = action.payload;
        },
        setSwappableSlots:(state,action)=>{
            state.swappableSlots = action.payload;
        }
    }
})

export const {setAllEvents,setSwappableSlots} = eventsSlice.actions;
export default eventsSlice.reducer;