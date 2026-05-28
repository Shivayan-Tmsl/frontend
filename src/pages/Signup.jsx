import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import margin from '../assets/margin.jpeg';
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = async(e) => {
    e.preventDefault();

    if(!email){
      setError("Please enter a valid email id!");
      return;
    }

    if(!password){
      setError("Please enter a valid password!");
      return;
    }

    if(!name){
      setError("Please enter a user name!");
      return;
    }

    setError("");

    try {
      const res = await axios.post("https://backend-ygfl.onrender.com/api/v1/auth/signup",{
        name,
        email,
        password,
      });
      const data = res.data;
      if(data.success){
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while signing up. Please try again.")
      
    }


    
  }
  
  
  return (
    <div className="flex items-center min-h-screen pl-10 pr-0">
    
      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center w-1/2">
        <h1 className='text-green-600 text-4xl'>Welcome!</h1>
        <h2 className="text-green-800 mb-6">
          Track today, save tomorrow. Signup now.
        </h2>
    
        <form
          autoComplete="off"
          onSubmit={handleSignup}
          className="flex flex-col gap-4 rounded-2xl p-6 w-full max-w-xl bg-emerald-100 shadow-lg"
        >

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-emerald-200 rounded-xl p-3 w-full"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-emerald-200 rounded-xl p-3 w-full"
          />
    
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-emerald-200 rounded-xl p-3 w-full"
          />

          {error && <p className='text-red-500 '>{error}</p>}



          <button
            type="submit"
            className="bg-emerald-400 w-full rounded-full p-2 hover:bg-emerald-500"
          >
            Signup
          </button>
        </form>
        <p className='flex items-center gap-2 mt-3 ml-5 text-green-400'>Already have an account?<span className='text-blue-600 cursor-pointer underline decoration-blue-700' onClick={()=> navigate("/login")}>Login</span></p>
      </div>
    
      {/* RIGHT SIDE IMAGE */}
      <img
        src={margin}
        alt="Expense Illustration"
        className="hidden md:block w-[40%] h-screen object-cover ml-auto rounded-2xl shadow-lg"
      />
    
    </div>
  )
}

export default Signup
