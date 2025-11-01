import { useEffect } from 'react'
import AxiosInstance from '../routes/AxiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setSwappableSlots } from '../../redux/events';

function SwappableSlots() {
    let dispatch = useDispatch();
    const swappableSlots = useSelector((state) => state.events.swappableSlots);
    useEffect(()=>{
        async function getEvents(){
            try {
                let response = await AxiosInstance.get("/swap/all");
                if(response.data.response.success){
                    dispatch(setSwappableSlots(response.data.response.data));
                }
            } catch (error) {
                console.log(error);
            }
        }
        getEvents();
    },[swappableSlots]);
  return (
    <div>
        <div className="w-full h-fit flex justify-center items-center">
        <div className="w-[85%] shadow-2xl h-[90%] rounded-2xl p-4">
          <p className="text-center font-bold text-3xl underline mb-5">
            Swappable Slots
          </p>
          <div className="w-full h-[10%] grid grid-cols-4 text-2xl font-bold mb-5">
            <p>Title</p>
            <p>Start Time</p>
            <p>End Time</p>
            <p>Status</p>
          </div>
          <div className="w-full h-[90%]">
            {swappableSlots.length > 0 &&
              swappableSlots.map((event,idx) => {
                return (
                  <div key={idx} className="w-full h-fit grid grid-cols-4 text-lg pb-2 font-semibold">
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
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwappableSlots