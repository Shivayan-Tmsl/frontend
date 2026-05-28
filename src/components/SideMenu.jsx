import React from 'react';
import { useState } from 'react';
import {MdDashboard} from "react-icons/md";
import {FaMoneyBillWave} from "react-icons/fa";
import {FaWallet} from "react-icons/fa";
import {MdLogout} from "react-icons/md";
import { useNavigate, useLocation } from 'react-router-dom';

const SideMenu = () => {
    
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const location = useLocation();

    const activeMenu = location.pathname;

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
    
  return (
    <div className='flex flex-col gap-10 items-center  justify-center px-6'>
        <h1 className='text-2xl text-green-700 mt-5 font-bold'>{user?.name}</h1>
        <div className={activeMenu==="/"? "bg-green-300 text-white font-bold text-xl flex gap-4 rounded-xl p-3 items-center justify-center w-full font-bold ": "text-xl text-bold text-black flex gap-4 items-center p-3 justify-center"} ><MdDashboard className='' /><span onClick={()=>{navigate("/")}} className='cursor-pointer'>Dashboard</span></div>
        <div className={activeMenu==="/income"? "bg-green-300 text-white font-bold text-xl flex gap-4 rounded-xl p-3 items-center justify-center w-full": "text-xl text-bold text-black flex gap-4 items-center p-3 justify-center font-bold"} ><FaMoneyBillWave className='' /><span onClick={()=>{navigate("/income")}} className='cursor-pointer'>Income</span></div>
        <div className={activeMenu==="/expense"? "bg-green-300 text-white font-bold text-xl flex gap-4 rounded-xl p-3 items-center justify-center w-full": "text-xl text-bold text-black flex gap-4 items-center p-3 justify-center font-bold"}><FaWallet /><span onClick={()=>{navigate("/expense")}} className='cursor-pointer'>Expense</span></div>
        <div className={activeMenu==="logout"? "bg-green-300 text-white font-bold text-xl flex gap-4 rounded-xl p-3 items-center justify-center w-full": "text-xl text-bold text-black flex gap-4 items-center p-3 justify-center font-bold"} ><MdLogout /><span className='cursor-pointer' onClick={handleLogout}>Logout</span></div>
      
    </div>
  )
}

export default SideMenu
