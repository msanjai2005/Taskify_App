import React, { useState } from 'react'
import Authbar from '../components/Authbar'
import Input from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const EmailVerify = () => {
  const {backendurl, userData, isLoading, setIsLoading, setIsAuthenticated} = useContext(AppContext);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault?.(); // In case you wrap it in a form later
    
    // Validation
    if (!otp.trim()) {
      setError('Please enter OTP');
      return;
    }
    
    try {
      setError("");
      setIsLoading(true);
      
      const res = await axios.post(
        `${backendurl}/api/auth/email-verify`, 
        { otp }, 
        { withCredentials: true }
      );
      
      if(res.data.success){
        setIsAuthenticated(true);
        toast.success("Email Verified Successfully");
        navigate('/dashboard');
      } else {
        setError(res.data.message || "Verification failed");
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Error verifying email";
      setError(errorMsg);
      console.error("Email verification error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const resendOtp = async () => {
    try {
      setIsResending(true);
      const res = await axios.post(
        `${backendurl}/api/auth/resend-otp`, 
        {}, 
        { withCredentials: true }
      );
      
      if(res.data.success){
        toast.success("OTP resent successfully!");
        console.log(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Error resending OTP";
      toast.error(errorMsg);
      console.error("Resend OTP error:", error);
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div>
      <Authbar/>
      <div className="w-full min-h-[90dvh] p-3 sm:p-10 bg-gray-100 flex justify-center items-center">
        <div className="w-full sm:w-[450px] py-8 px-5 sm:px-10 bg-white rounded-xl shadow flex flex-col gap-4 sm:gap-6">
          {error && (
            <div className="text-red-500 bg-red-50 w-full py-3 px-4 border border-red-200 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="flex flex-col justify-center items-center text-gray-600">
            <h1 className="text-2xl font-bold text-blue-800 mb-2">Verify your Email</h1>
            <p className="text-center mt-2">The verification OTP has been sent to your email</p>
            <p className="font-medium text-gray-800 mt-2">{userData?.email || "your email"}</p>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
            <Input
              label="OTP"
              type="text"
              value={otp}
              placeholder="Enter 6-digit verification OTP"
              onChange={(e) => {
                setOtp(e.target.value);
                if(error) setError(""); // Clear error when user starts typing
              }}
              autoFocus
              maxLength={6} // Assuming 6-digit OTP
            />
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 text-white text-[17px] active:scale-[0.98]
                rounded-lg cursor-pointer font-bold bg-gradient-to-r from-blue-600 to-blue-500 
                hover:from-blue-500 hover:to-blue-600 disabled:opacity-70 disabled:cursor-not-allowed
                transition-all duration-200 ease-in-out mt-4"
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <Loading size="h-6 w-6" color="white"/>
                </div>
              ) : "Verify Email"}
            </button>
          </form>
          
          <div className="text-center pt-2">
            <p className="text-gray-600 text-[14px] sm:text-[16px]">
              Not received OTP yet?{" "}
              <button
                type="button"
                onClick={resendOtp}
                disabled={isResending}
                className="text-blue-700 font-medium hover:text-blue-800 
                  disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {isResending ? "Resending..." : "Resend verification OTP"}
              </button>
            </p>
            <p className="text-gray-500 text-sm mt-3">
              OTP expires in 10 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerify