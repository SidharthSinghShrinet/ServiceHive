import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../routes/AxiosInstance";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  let [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  function handleChange(e){
    let {name,value} = e.target;
    setLoginDetails({...loginDetails,[name]:value});
  }
  async function handleSubmit(e){
    e.preventDefault();
    try {
      let response = await AxiosInstance.post("/users/login",loginDetails);
      if(response.data.response.success){
        localStorage.setItem("loginStatus","true");
        toast.success(response.data.response.message);
        navigate("/marketplace");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
  }
  return (
    <div className="h-screen w-full flex justify-center bg-green-400 items-center">
      <div className="flex justify-center flex-col items-center border bg-white border-gray-100 p-4 rounded-2xl shadow-2xl">
        <h1 className="text-xl font-bold tracking-wide">Login Page</h1>
        <div>
          <form action="" className="flex flex-col gap-5 m-4">
            <TextField
              id="email-input"
              name="email"
              label="Email"
              variant="outlined"
              value={loginDetails.email}
              onChange={handleChange}
            />
            <TextField
              id="password-input"
              name="password"
              label="Password"
              variant="outlined"
              value={loginDetails.password}
              onChange={handleChange}
            />
            <Button onClick={handleSubmit} variant="contained">Login</Button>
          </form>
        </div>
        <p>
          Create a new account?{" "}
          <Link to={"/"} className="text-pink-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
