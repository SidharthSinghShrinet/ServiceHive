import { useEffect,useState } from "react";
import AxiosInstance from "../routes/AxiosInstance";
import Logout from "./Logout";
function Navbar() {
  let [username, setUsername] = useState("");
  useEffect(()=>{
    async function getUsername(){
      try {
        let response = await AxiosInstance.get("/users/me");
        if(response.data.response.success){
          setUsername(response.data.response.data.username);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUsername();
  },[]);
  return (
    <div className="w-full h-[70px] bg-black text-white flex justify-between items-center px-2 lg:px-15">
      <p className="text-3xl font-bold">Logo</p>
      <div className="flex gap-2 items-center justify-between">
        <p className="text-xl">Welcome, {username || "Guest"}</p>
        <span className="text-3xl">|</span>
        <Logout/>
      </div>
    </div>
  );
}

export default Navbar;
