import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Dashboard } from "./Dashboard";
const apiUrl = import.meta.env.REACT_APP_API_URL;

export const Signin = () => {
  const [username, setUsername] = useState(null);
  const [pass, setPass] = useState(null);
  const navigate = useNavigate(); 

  const submit = async (e) => {
    e.preventDefault();
    const response = await axios.post(apiUrl, {
      username: username,
      password: pass
    })
    localStorage.setItem("token", response.data.token)
    navigate('/Dashboard')
  };


    return <div className="bg-stone-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChange={(e)=>{setUsername(e.target.value)}} placeholder="adnan@mail.com" label={"Email"} />
        <InputBox onChange={(e)=>{setPass(e.target.value)}} placeholder="pass@123" label={"Password"} />
        <div className="pt-4">
          <Button onClick={submit} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}