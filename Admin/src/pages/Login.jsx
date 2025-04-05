import React from "react";
// import { useDispatch } from "react-redux";
// import { authAction } from "../store/auth";
import { useNavigate } from "react-router-dom";
import {auth} from "../firebaseConfig"
import { signInWithEmailAndPassword } from "firebase/auth";


const Login = () => {
    // const dispatch=useDispatch();
    const navigate=useNavigate();

    const handleSubmit=async (e) => {
        const email=e.get("email");
        const password=e.get("password");
        
        

        try {
         const response = await signInWithEmailAndPassword(auth,email,password);
        
         if(!response._tokenResponse.registered)
          {            
            throw new Error("Email or Password is Wrong");
          }
          
           navigate("/admin")
         
          
        } catch (error) {
          alert("Email or Password is Wrong ")
        }
        
        
    }



  return (
    <div className="h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
    <div className="relative bg-white bg-opacity-10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-96 border border-gray-600 transform transition-all duration-500 hover:scale-105">
      <h2 className="text-3xl font-bold text-white text-center mb-6 tracking-wide drop-shadow-lg">
        Admin Login
      </h2>
  
      <form action={handleSubmit} className="flex flex-col space-y-6">
        <div>
          <label htmlFor="email" className="block text-white text-lg font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full p-3 border border-gray-500 bg-gray-700 bg-opacity-50 text-white placeholder-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300"
            placeholder="Enter your email"
          />
        </div>
  
        <div>
          <label htmlFor="password" className="block text-white text-lg font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full p-3 border border-gray-500 bg-gray-700 bg-opacity-50 text-white placeholder-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300"
            placeholder="Enter your password"
          />
        </div>
  
        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:opacity-90 transition-all duration-300 hover:scale-105">
          Login
        </button>
      </form>
    </div>
  </div>
  );
};

export default Login;
