import React, { useState } from 'react'
import Authbar from '../components/Authbar'
import Input from '../components/Input';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const EmailVerify = () => {

  const {backendurl,  userData, isLoading, setIsLoading, setIsAuthenticated} = useContext(AppContext);

  const [otp,setOtp] = useState('');
  const [error,setError] = useState('');

  const navigate = useNavigate();
  const handleSubmit = async()=>{
    try {
      setError("");
      setIsLoading(true);
      const res = await axios.post(backendurl + '/api/auth/email-verify',{otp},{ withCredentials: true });
      if(res.data.success){
        setIsAuthenticated(true);
        navigate('/dashboard');
        toast.success("Email Verified Successfully");
      }else{
        console.log("error in email - else");
        setError(res.data.message)
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || "Error in verify email"); 
      console.log(error?.response?.data?.message || "Error in Email verification catch");
    }
    setIsLoading(false);
  }

  const resendOtp = async()=>{
    try {
      const res = await axios.post(backendurl + '/api/auth/resend-otp',{},{ withCredentials: true });
      if(res.data.success){
        console.log(res.data.message);
      }else{
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error?.Responce?.data?.message || "Error in Email verification");
    }
  }

  return (
    <div>
      <Authbar/>
      <div className="w-full min-h-[90dvh] p-3 sm:p-10 bg-gray-100 flex justify-center items-center">
        <div className="w-full sm:w-[450px] py-15 px-5 sm:px-10 bg-white rounded-xl shadow flex flex-col gap-2 sm:gap-5 justify-center items-center">
          {error && (
            <div className="text-red-500 bg-red-50 w-full py-2 px-3 border border-red-700 rounded text-center">
              {error}
            </div>
          )}
          <div className="flex flex-col justify-center items-center text-gray-500">
            <h1 className="text-2xl font-bold text-blue-800 ">Verify your Email</h1>
            <p className="text-center mt-5">The verification otp has been sent to your email</p>
            <p>{userData?.email}</p>
          </div>
          <Input
            label="OTP"
            type="text"
            value={otp}
            placeholder="Enter verification otp"
            onChange={(e) => {
              setOtp(e.target.value);
            }}
          />
          <button
          onKeyDown={(e)=>{
            if(e.key =='Enter'){()=>handleSubmit(e)}
          }}
            onClick={()=>handleSubmit()}
            className="w-full px-2 py-1 text-white text-[17px] active:scale-99
            rounded-md cursor-pointer font-bold bg-linear-to-r from-blue-600 to-blue-400 
            hover:bg-linear-to-r hover:from-blue-400 hover:to-blue-600 transition"
          >
            {isLoading?(<Loading size="h-6 w-6" color="white"/>):"Verify"}
          </button>
          <p className="text-gray-700 text-[clamp(0.9rem,2vw,1rem)]">
           Not Received yet?{" "}
            <span
              className=" text-blue-700 cursor-pointer "
              onClick={()=>{resendOtp()}}
            >
              Resend verification otp
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default EmailVerify
