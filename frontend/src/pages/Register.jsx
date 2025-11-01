import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../routes/AxiosInstance";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  let [registerDetails, setRegisterDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  function handleChange(e) {
    let { name, value } = e.target;
    setRegisterDetails({ ...registerDetails, [name]: value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let response = await AxiosInstance.post(
        "/users/register",
        registerDetails
      );
      if (response.data.response.success) {
        navigate("/login");
        toast.success(response.data.response.message);
      }
    } catch (error) {
      toast.error(error.response.data.response.message);
    }
    setRegisterDetails({
      username: "",
      email: "",
      password: "",
    });
  }
  return (
    <div className="h-screen w-full flex justify-center bg-pink-600 items-center">
      <div className="flex justify-center flex-col items-center border bg-white border-gray-100 p-4 rounded-2xl shadow-2xl">
        <h1 className="text-xl font-bold tracking-wide">Register Page</h1>
        <div>
          <form className="flex flex-col gap-5 m-4">
            <TextField
              id="username-input"
              label="Username"
              variant="outlined"
              value={registerDetails.username}
              onChange={handleChange}
              name="username"
            />
            <TextField
              id="email-input"
              label="Email"
              variant="outlined"
              value={registerDetails.email}
              onChange={handleChange}
              name="email"
            />
            <TextField
              id="password-input"
              label="Password"
              variant="outlined"
              value={registerDetails.password}
              onChange={handleChange}
              name="password"
            />
            <Button onClick={handleSubmit} variant="contained">
              Register
            </Button>
          </form>
        </div>
        <p>
          Already have an account?{" "}
          <Link to={"/login"} className="text-green-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
