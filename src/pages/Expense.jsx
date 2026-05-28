import React from 'react';
import SideMenu from '../components/SideMenu';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import ExpenseLineChart from '../components/ExpenseLineChart';
import { GiPayMoney } from 'react-icons/gi';
import { FaPlus } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';

const Expense = () => {
   const [expenseData, setExpenseData] = useState(null);
   const [loading, setLoading] = useState(false);
   const [expenseForm, setExpenseForm] = useState(false);
   const [category, setCategory] = useState("");
   const [amount, setAmount] = useState("");
   const [date, setDate] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

 
   useEffect(() => {
     
     if(!token){
     navigate("/login");
   }
   }, [token, navigate]);

  const fetchExpenseData = async () => {
    if (!token) return;
    if (loading) return; // Prevent multiple requests

    setLoading(true);

    try {
      const response = await axios.get("https://backend-ygfl.onrender.com/api/v1/expense/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setExpenseData(data);
      
    } catch (error) {
      
      console.error("Error fetching expense data:", error);
    } finally {
      setLoading(false);
    }


    
  }

  useEffect(() => {
    fetchExpenseData();
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle form submission logic here
    setLoading(true);
    try {
      const response = await axios.post("https://backend-ygfl.onrender.com/api/v1/expense/add", {
        category,
        amount,
        date
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error adding expense:", error);
    }finally{
      setLoading(false);
      setExpenseForm(false);
      fetchExpenseData();
    }

  }

  const handleDownload = async () => {
  setLoading(true);

  try {
    const response = await axios.get(
      "https://backend-ygfl.onrender.com/api/v1/expense/download",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data]);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", "expenses.xlsx");

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (error) {
    console.error("Error downloading expense data:", error);
  } finally {
    setLoading(false);
  }
};

const handleDelete = async(e) => {
  setLoading(true);
  try {
    await axios.delete(`https://backend-ygfl.onrender.com/api/v1/expense/delete/${e}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
  } finally {    setLoading(false);
    fetchExpenseData();
  }
  
}


  return (
    <div className='h-full flex-1  bg-gray-100 flex flex-col w-full'>
      <Navbar />
      <div className='flex'>

      {/* Sidebar */}
      <div className='w-1/5 fixed top-[60px] left-0 h-[calc(100vh-60px)] bg-white shadow-md mt-0.5 rounded-xl lg:block hidden'>
        <SideMenu />
      </div>

      <div className='flex w-full flex-col ml-0 lg:ml-[20%] mt-16 p-5 '>
      <div className='w-full  '>
        
        <div className='bg-white shadow-md rounded-xl p-5'>
          
          <div className='flex justify-between'><h1 className='text-xl font-bold text-gray-700 mb-5'>Expense Overview</h1><button  className='bg-green-200 hover:bg-green-300 text-green-700 font-bold p-2 rounded-full sm:rounded-xl flex items-center justify-center gap-2 w-12 h-12 sm:w-auto sm:px-4'onClick={()=>setExpenseForm(true)}><FaPlus /> <span className='hidden sm:flex items-center gap-1'><span>Add</span><span>Expense</span></span></button></div>
          {expenseForm && (
            <div className='fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4'>
              <div className='w-lg h-md bg-white shadow-md flex flex-col rounded-xl p-5 gap-5'>
                <div className='flex bg-gray-200 justify-between rounded-xl top-0 left-0 right-0'><h1 className='font-bold'>Add Expense</h1><FaTimes onClick={()=>{setExpenseForm(false);}} /></div>
                <form className='flex flex-col gap-4 rounded-xl'onSubmit={handleSubmit}>
                  <input type="text" placeholder='Category' className='p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl' value={category} onChange={(e) => setCategory(e.target.value)} />
                  <input type="number" placeholder='Amount' className='p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl' value={amount} onChange={(e) => setAmount(e.target.value)} />
                  <input type="date" placeholder='Date' className='p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl' value={date} onChange={(e) => setDate(e.target.value)} />
                  <button className='bg-green-200 hover:bg-green-300 text-green-700 font-bold p-2 rounded-xl flex items-center justify-center gap-2'type='submit'>Add Expense</button>
                </form>

              </div>
              </div>
          )}
          <p className='text-gray-500'>Track your spending traits over time and gain insights into where your money goes</p>
          <div className='mt-7'>
          <ExpenseLineChart expenseData={expenseData} />
          </div>
          
          
        </div>

      
              <div className='bg-white shadow-md rounded-xl p-5 mt-16'>
                <div className='flex justify-between'><h1 className='text-xl font-bold text-gray-700 mb-5'>All Expenses</h1><button className='bg-gray-100 shadow-md font-bold p-2 rounded-xl flex items-center justify-center gap-2'onClick={handleDownload}><FaDownload /> Download</button></div>
                
                <div className='mt-7 flex flex-col gap-4'>
                  <div className='grid sm:grid-cols-2 gap-4 grid-cols-1'>
                  {expenseData && expenseData.length > 0 ? (
                    expenseData.map((item) => (
                      
                      <div key={item._id} className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'>
                        
                        <div className='flex gap-4'>
      
                        <div className='rounded-full w-12 h-12 bg-red-200 flex items-center justify-center hover:bg-red-300'>
                          <GiPayMoney className='text-sm' />
                        </div>
      
                        <div className='flex flex-col'>
                          <h2 className='font-bold text-gray-700'>{item.category}</h2>
                          <p className='text-gray-500'>{new Date(item.date).toLocaleDateString()}</p>
                        </div>
      
      
                        </div>
                        <div className='flex gap-3.5 items-center justify-center'><p className='font-bold text-red-500'>Rs {item.amount.toFixed(2)}</p><FaTrash onClick={() => handleDelete(item._id)} /></div>
                      </div>
                      
                    ))
                  ) : (
                    <p className='text-gray-500'>No expense data available.</p>
                  )}
                  </div>
                  
                </div>
              </div>
      
              
      
      
              
        </div>
        </div>

      </div>
      
    </div>
  )
}

export default Expense
