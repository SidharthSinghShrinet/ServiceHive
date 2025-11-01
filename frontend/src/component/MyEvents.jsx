import React, { useEffect } from "react";
import AxiosInstance from "../routes/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setAllEvents } from "../../redux/events";
import SwappableSlots from "./SwappableSlots";

function MyEvents() {
  const dispatch = useDispatch();
  let allEvents = useSelector((state) => state.events.allEvents);
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(null);
  const [updatedInputs, setUpdatedInputs] = React.useState({
    title: "",
    startTime: "",
    endTime: "",
    status: "",
  });
  function handleChange(e) {
    let { name, value } = e.target;
    setUpdatedInputs({ ...updatedInputs, [name]: value });
  }
  function handleEdit(idx) {
    setIndex(idx);
    setOpen(!open);
  }
  async function handleUpdate() {
    try {
      let response = await AxiosInstance.put(`/events/update/${allEvents[index]._id}`,updatedInputs);
    if(response.data.response.success){
        let updateEvents = [...allEvents];
        updateEvents[index] = response.data.response.data;
        dispatch(setAllEvents(updateEvents));
        setOpen(!open);
        setUpdatedInputs({
          title: "",
          startTime: "",
          endTime: "",
          status: "",
        });
    }
    } catch (error) {
      console.log(error);
    }
  }
  async function handleDelete(idx) {
    try {
      let response = await AxiosInstance.delete(
        `/events/delete/${allEvents[idx]._id}`
      );
      if (response.data.response.success) {
        let updateEvents = [...allEvents];
        updateEvents.splice(idx, 1);
        dispatch(setAllEvents(updateEvents));
      }
    } catch (error) {
      console.log(response);
    }
  }
  useEffect(() => {
    async function getEvents() {
      try {
        let response = await AxiosInstance.get("/events/all");
        if (response.data.response.success) {
          dispatch(setAllEvents(response.data.response.data));
        }
      } catch (error) {
        console.log(error);
      }
    }
    getEvents();
  }, []);
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="w-full h-fit flex justify-center items-center">
        <div className="w-[85%] shadow-2xl h-[90%] rounded-2xl p-4">
          <p className="text-center font-bold text-3xl underline mb-5">
            All Events
          </p>
          <div className="w-full h-[10%] grid grid-cols-5 text-2xl font-bold mb-5">
            <p>Title</p>
            <p>Start Time</p>
            <p>End Time</p>
            <p>Status</p>
            <p>Actions</p>
          </div>
          {open && (
            <div className="w-full h-fit grid grid-cols-5 my-5">
              <input
                name="title"
                value={updatedInputs.title}
                onChange={handleChange}
                type="text"
                className="bg-black text-white pl-0.5 rounded-xl"
                placeholder="Enter Title..."
              />
              <input
                name="startTime"
                value={updatedInputs.startTime}
                onChange={handleChange}
                type="text"
                className="bg-black text-white pl-0.5 rounded-xl"
                placeholder="Enter Start Time..."
              />
              <input
                name="endTime"
                value={updatedInputs.endTime}
                onChange={handleChange}
                type="text"
                className="bg-black text-white pl-0.5 rounded-xl"
                placeholder="Enter End Time..."
              />
              <input
                name="status"
                value={updatedInputs.status}
                onChange={handleChange}
                type="text"
                className="bg-black text-white pl-0.5 rounded-xl"
                placeholder="Enter Status..."
              />
              <button
                onClick={handleUpdate}
                className="p-1 text-xl font-bold bg-green-400 rounded-lg"
              >
                Update
              </button>
            </div>
          )}
          <div className="w-full h-[90%] mb-10">
            {allEvents.length > 0 &&
              allEvents.map((event, idx) => {
                return (
                  <div
                    key={idx}
                    className="w-full h-fit grid grid-cols-5 text-lg pb-2 font-semibold"
                  >
                    <p>{event.title}</p>
                    <p>
                      {new Date(event.startTime).toLocaleDateString()},
                      {new Date(event.startTime).toLocaleTimeString()}
                    </p>
                    <p>
                      {new Date(event.endTime).toLocaleDateString()},
                      {new Date(event.endTime).toLocaleTimeString()}
                    </p>
                    <p>{event.status}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(idx)}
                        className="bg-blue-400 p-2 rounded-xl cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="bg-red-600 p-2 rounded-xl cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <SwappableSlots />
    </div>
  );
}

export default MyEvents;
