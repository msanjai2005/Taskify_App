import React, { useContext, useState } from 'react'
import Authbar from '../components/Authbar';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router';
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import axios from 'axios';
import { Homebar } from './Home';
import toast from 'react-hot-toast';

const ForgetPassword = () => {

  const {backendurl, isLoading, setIsLoading} = useContext(AppContext);

  const [email,setEmail] = useState('');
  const [newPassword,setNewPassword] = useState('');
  const [otp,setOtp] = useState('');
  const [ok, setOk] = useState(false);
  const [error,setError] = useState("");
  const navigate = useNavigate();

  const handleSubmitEmail = async(e)=>{
    setError("");
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${backendurl}/api/auth/send-reset-password-otp`,{email});
      if(res.data.success){
        setOk(true);
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
    }
    setIsLoading(false);
    
  }

  const handleSubmit = async(e)=>{
    setError("");
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${backendurl}/api/auth/reset-password`,{email,newPassword,otp});
      console.log(res);
      if(res.data.success){
        navigate('/login');
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
    }
    setIsLoading(false);
  }

  const handleResendOtp = async()=>{
    try {
      const res = await axios.post(`${backendurl}/api/auth/resend-reset-password-otp`,{email});
      console.log(res);
      if(res.data.success){
        toast.success(res.data.message);
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div>
      <Homebar/>
      {ok?(<div className="w-full min-h-[90dvh] p-3 sm:p-10 bg-gray-100 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full sm:w-[400px] px-4 py-10 sm:p-10  bg-white rounded-xl shadow flex flex-col gap-2 sm:gap-3 justify-center items-center">
          <div className="flex flex-col justify-center items-center text-gray-500">
            <h1 className="text-2xl font-bold text-blue-800 ">Change your Password</h1>
            <p className="mb-5 sm:mb-10">
              Enter your new password and otp
            </p>
          </div>
          <Input
            label="New Password"
            type="text"
            value={newPassword}
            placeholder="Enter your New Password"
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          <div className="w-full">
            <Input
              label="OTP"
              type="text"
              value={otp}
              placeholder="Enter the otp"
              onChange={(e) => {
                setOtp(e.target.value);
              }}
            />
          </div>
          <button type="submit"
            onKeyDown={(e)=>{
              if(e.key =='Enter'){handleSubmit(e);}
            }}
            className="w-full px-2 py-1 text-white text-[17px] active:scale-99
            rounded-md cursor-pointer font-bold bg-linear-to-r from-blue-600 to-blue-400 
            hover:bg-linear-to-r hover:from-blue-400 hover:to-blue-600 transition"
          >
            {isLoading?(<Loading size="h-6 w-6" color="white"/>):"Change"}
          </button>
            <p className='text-red-500 font-semibold'>{error}</p>
          <p className="text-gray-700">
           otp not received?{" "}
            <span
              className="underline text-blue-700 cursor-pointer "
              onClick={handleResendOtp}
            >
              Resend the otp
            </span>
          </p>
        </form>
      </div>):(<div className="w-full min-h-[90dvh] p-3 sm:p-10 bg-gray-100 flex justify-center items-center">
        <form onSubmit={handleSubmitEmail} className="w-full sm:w-[450px] py-15 px-5 sm:px-10 bg-white rounded-xl shadow flex flex-col gap-2 sm:gap-5 justify-center items-center">
          <div className="flex flex-col justify-center items-center text-gray-500">
            <h1 className="text-2xl font-bold text-blue-800 ">Forget Password</h1>
            <p className="text-center mt-5">Enter your email for password reset OTP</p>
          </div>
          <Input
            label="Email"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <p className='text-red-500 font-semibold'>{error}</p>
          <button type="submit"
            onKeyDown={(e)=>{
              if(e.key =='Enter'){handleSubmitEmail(e);}
            }}
            className="w-full px-2 py-1 text-white text-[17px] active:scale-99
            rounded-md cursor-pointer font-bold bg-linear-to-r from-blue-600 to-blue-400 
            hover:bg-linear-to-r hover:from-blue-400 hover:to-blue-600 transition"
          >
            {isLoading?(<Loading size="h-6 w-6" color="white"/>):"Submit"}
          </button>
        </form>
      </div>)}
    </div>
  )
}

export default ForgetPassword;
