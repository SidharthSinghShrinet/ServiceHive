import React from "react";
import {useNavigate} from "react-router-dom";
import AxiosInstance from "../routes/AxiosInstance";
import {toast} from "react-toastify";

function Logout() {
    let navigate = useNavigate();
    async function handleLogout(){
        try {
            let response = await AxiosInstance.get("/users/logout",{
                withCredentials:true
            })
            console.log(response);
            if(response.data.response.success){
                navigate("/login");
                toast.success(response.data.response.message);
                localStorage.removeItem("loginStatus");
            }
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <button onClick={handleLogout} className="bg-gray-300 text-black text-lg p-0.5 rounded-xl lg:p-2">
      Logout
    </button>
  );
}

export default Logout;
