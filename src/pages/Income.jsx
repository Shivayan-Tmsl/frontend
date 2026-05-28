import React from 'react';
import SideMenu from '../components/SideMenu';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import IncomeBarChartComponent from '../components/IncomeBarChartComponent';
import { GiReceiveMoney } from 'react-icons/gi';
import { FaPlus } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';

const Income = () => {
  const [incomeData, setIncomeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [incomeForm, setIncomeForm] = useState(false);
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();


  useEffect(() => {

    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchIncomeData = async () => {
    if (!token) return;
    if (loading) return; // Prevent multiple requests

    setLoading(true);

    try {
      const response = await axios.get("https://backend-ygfl.onrender.com/api/v1/income/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setIncomeData(data);

    } catch (error) {

      console.error("Error fetching income data:", error);
    } finally {
      setLoading(false);
    }



  }

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    setLoading(true);
    try {
      const response = await axios.post("https://backend-ygfl.onrender.com/api/v1/income/add", {
        source,
        amount,
        date
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error adding income:", error);
    } finally {
      setLoading(false);
      setIncomeForm(false);
      fetchIncomeData();
    }

  }

  const handleDownload = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "https://backend-ygfl.onrender.com/api/v1/income/download",
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

      link.setAttribute("download", "incomes.xlsx");

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (error) {
      console.error("Error downloading income data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
    setLoading(true);
    try {
      await axios.delete(`https://backend-ygfl.onrender.com/api/v1/income/delete/${e}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error deleting income:", error);
    } finally {
      setLoading(false);
      fetchIncomeData();
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
              <div className='flex justify-between items-center'>
                <h1 className='text-xl font-bold text-gray-700 mb-5'>Income Overview</h1>
                <button
                  className='bg-green-200 hover:bg-green-300 text-green-700 font-bold p-2 rounded-full sm:rounded-xl flex items-center justify-center gap-2 w-12 h-12 sm:w-auto sm:px-4'
                  onClick={() => setIncomeForm(true)}
                >
                  <FaPlus />

                  <span className='hidden sm:flex items-center gap-1'>
                    <span>Add</span>
                    <span>Income</span>
                  </span>
                </button></div>
              {incomeForm && (
                <div className='fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4'>
                  <div className='w-lg h-md bg-white shadow-md flex flex-col rounded-xl p-5 gap-5'>
                    <div className='flex bg-gray-200 justify-between rounded-xl top-0 left-0 right-0'><h1 className='font-bold'>Add Income</h1><FaTimes onClick={() => { setIncomeForm(false); }} /></div>
                    <form className='flex flex-col gap-4 rounded-xl' onSubmit={handleSubmit}>
                      <input type="text" placeholder='Source' className='p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl' value={source} onChange={(e) => setSource(e.target.value)} />
                      <input type="number" placeholder='Amount' className='p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl' value={amount} onChange={(e) => setAmount(e.target.value)} />
                      <input type="date" placeholder='Date' className='p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl' value={date} onChange={(e) => setDate(e.target.value)} />
                      <button className='bg-green-200 hover:bg-green-300 text-green-700 font-bold p-2 rounded-xl flex items-center justify-center gap-2' type='submit'>Add Income</button>
                    </form>

                  </div>
                </div>
              )}
              <p className='text-gray-500'>Track your earnings over time and analyze your income trends</p>
              <div className='mt-7'>
                <IncomeBarChartComponent incomeData={incomeData} />
              </div>
            </div>

            <div className='bg-white shadow-md rounded-xl p-5 mt-16'>
              <div className='flex justify-between'><h1 className='text-xl font-bold text-gray-700 mb-5'>Income Sources</h1><button className='bg-gray-100 shadow-md font-bold p-2 rounded-xl flex items-center justify-center gap-2' onClick={handleDownload}><FaDownload /> Download</button></div>

              <div className='mt-7 flex flex-col gap-4'>
                <div className='grid sm:grid-cols-2 gap-4 grid-cols-1'>
                  {incomeData && incomeData.length > 0 ? (
                    incomeData.map((item) => (

                      <div key={item._id} className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'>

                        <div className='flex gap-4'>

                          <div className='rounded-full w-12 h-12 bg-green-200 flex items-center justify-center hover:bg-green-300'>
                            <GiReceiveMoney className='text-sm' />
                          </div>

                          <div className='flex flex-col'>
                            <h2 className='font-bold text-gray-700'>{item.source}</h2>
                            <p className='text-gray-500'>{new Date(item.date).toLocaleDateString()}</p>
                          </div>


                        </div>
                        <div className='flex gap-3.5 items-center justify-center'><p className='font-bold text-green-500'>Rs {item.amount.toFixed(2)}</p><FaTrash onClick={() => handleDelete(item._id)} /></div>
                      </div>

                    ))
                  ) : (
                    <p className='text-gray-500'>No income data available.</p>
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

export default Income
