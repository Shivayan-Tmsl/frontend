import React from 'react';
import SideMenu from '../components/SideMenu';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { FaWallet } from 'react-icons/fa';
import { GiReceiveMoney } from 'react-icons/gi';
import { GiPayMoney } from 'react-icons/gi';
import { FiDivideCircle } from 'react-icons/fi';
import { LuArrowRight } from 'react-icons/lu';
import PieChartComponent from '../components/PieChartComponent';
import BarChartComponent from '../components/BarChartComponent';
import IncomePieChart from '../components/IncomePieChart';


const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const token = localStorage.getItem("token");
  useEffect(() => {
    
    if(!token){
    navigate("/login");
  }
  }, [token, navigate]);

  

  const fetchDashboardData = async () => {
    if (!token) return;
    if (loading) return; // Prevent multiple requests

    setLoading(true);

    try {
      const response = await axios.get("https://backend-ygfl.onrender.com/api/v1/dashboard/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setDashboardData(data);
      
    } catch (error) {
      
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }


    
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  
  return (
    <div className='h-full bg-gray-100 flex flex-col'>
    <Navbar />

    <div className='flex'>

      {/* Sidebar */}
      <div className='w-1/5 fixed top-[60px] left-0 h-[calc(100vh-60px)] bg-white shadow-md mt-0.5 rounded-xl lg:block hidden'>
        <SideMenu />
      </div>

      {/* Main Content Wrapper */}
      <div className='flex-1 lg:ml-[20%] w-full'>

        {/* Top Summary Cards */}
        <div className='mt-20 w-full rounded-xl px-4 lg:px-6 '>
          <div className='bg-white shadow-md w-full flex flex-col lg:flex-row justify-evenly p-7 rounded-xl gap-4 mt-14'>

            <div className='flex items-center justify-center gap-3 bg-gray-50 rounded-xl p-4 shadow-md w-full'>
              <div className='rounded-full w-14 h-14  sm:w-24 sm:h-24 bg-emerald-200 flex items-center justify-center hover:bg-emerald-300'>
                <FaWallet className='text-xl sm:text-2xl ' />
              </div>
              <div className='text-xl flex flex-col gap-2 font-bold'>
                Total Balance : Rs {dashboardData?.totalBalance || 0}
              </div>
            </div>

            <div className='flex items-center justify-center gap-3 bg-gray-50 rounded-xl p-4 shadow-md w-full'>
              <div className='rounded-full w-14 h-14 sm:w-24 sm:h-24 bg-emerald-200 flex items-center justify-center hover:bg-emerald-300'>
                  <GiReceiveMoney className='text-2xl sm:text-3xl' />
              </div>
              <div className='text-xl flex flex-col gap-2 font-bold'>
                Total Income : Rs {dashboardData?.totalIncome || 0}
              </div>
            </div>

            <div className='flex items-center justify-center gap-3 bg-gray-50 rounded-xl p-4 shadow-md w-full'>
              <div className='rounded-full w-14 h-14  sm:w-24 sm:h-24 bg-emerald-200 flex items-center justify-center hover:bg-emerald-300'>
                <GiPayMoney className='text-2xl sm:text-3xl' />
              </div>
              <div className='text-xl flex flex-col gap-2 font-bold'>
                Total Expense : Rs {dashboardData?.totalExpense || 0}
              </div>
            </div>

          </div>
        </div>

        {/* Middle Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-7 mt-3 px-4 lg:px-6'>

          {/* Recent Transactions */}
          <div className='bg-white shadow-md p-12 rounded-xl flex flex-col aspect-sqaure
          '>
            <p className='text-md font-bold'>Recent Transactions</p>

            <div className='flex flex-col gap-5 mt-4'>
              {dashboardData?.recentTransactions.map((item, index) => (
                <div key={index} className='flex items-center justify-between p-3 rounded-md bg-gray-50 shadow-sm'>

                  <div className='flex items-center gap-3'>
                    <div className='rounded-full w-10 h-10 p-2 bg-blue-200 flex items-center justify-center'>
                      {item.type === 'income'
                        ? <GiReceiveMoney className='text-xl' />
                        : <GiPayMoney className='text-xl' />}
                    </div>

                    <div>
                      <p className='font-bold'>{item.title}</p>
                      <p className='text-sm text-gray-500'>
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className={`font-bold ${item.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {item.type === 'income' ? '+' : '-'} Rs {item.amount.toFixed(2)}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Income Overview */}
          <div className='bg-white shadow-md p-12 rounded-xl flex flex-col aspect-square'>
            <p className='text-md font-bold'>Income Overview</p>
            <PieChartComponent dashboardData={dashboardData}  />
          </div>

          {/* Expenses */}
          <div className='bg-white shadow-md p-12 rounded-xl flex flex-col aspect-square'>
            <p className='text-md font-bold flex gap-72'>Expenses <span className='flex items-center justify-center gap-2 bg-gray-50 shadow-md  rounded-xl p-1' onClick={()=>{navigate("/income")}}>See more <LuArrowRight /></span></p>
            {dashboardData?.last60DaysExpenses.transactions?.length>0 ? (
              <div className='flex flex-col gap-5 mt-4'>
                {dashboardData?.last60DaysExpenses.transactions.slice(0, 5).map((item, index) => (
                  <div key={index} className='flex items-center justify-between p-3 rounded-md bg-gray-50 shadow-sm'>
                    <div className='flex items-center gap-3'>
                      <div className='rounded-full w-10 h-10 p-2 bg-red-200 flex items-center justify-center'>
                        <GiPayMoney className='text-xl' />
                      </div>
                      <div>
                        <p className='font-bold'>{item.category}</p>
                        <p className='text-sm text-gray-500'>
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className='font-bold text-red-500'>
                      - Rs {item.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500'>No expenses to display.</p>
            )}
          </div>

            {/* Expenses Bar Chart */}
          <div className='bg-white shadow-md p-12 rounded-xl flex flex-col aspect-square'>
            <p className='text-md font-bold'>Last 60 Days Expenses</p>
            <div className='mt-6 items-center justify-center'>
            <BarChartComponent dashboardData={dashboardData} /></div>
          </div>

          {/* Incomes */}
          <div className='bg-white shadow-md p-12 rounded-xl flex flex-col aspect-square'>
            <p className='text-md font-bold flex gap-72'>Incomes <span className='flex items-center justify-center gap-2 bg-gray-50 shadow-md  rounded-xl p-1' onClick={()=>{navigate("/income")}}>See more <LuArrowRight /></span></p>
            {dashboardData?.last60DaysIncome.transactions?.length>0 ? (
              <div className='flex flex-col gap-5 mt-4'>
                {dashboardData?.last60DaysIncome.transactions.slice(0, 5).map((item, index) => (
                  <div key={index} className='flex items-center justify-between p-3 rounded-md bg-gray-50 shadow-sm'>
                    <div className='flex items-center gap-3'>
                      <div className='rounded-full w-10 h-10 p-2 bg-green-200 flex items-center justify-center'>
                        <GiReceiveMoney className='text-xl' />
                      </div>
                      <div>
                        <p className='font-bold'>{item.source}</p>
                        <p className='text-sm text-gray-500'>
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className='font-bold text-green-500'>
                      + Rs {item.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500'>No incomes to display.</p>
            )}
          </div>

          <div className='bg-white shadow-md p-12 rounded-xl flex flex-col aspect-square'>
            <p className='text-md font-bold'>Last 60 Days Income</p>
            <IncomePieChart dashboardData={dashboardData}  />
          </div>
            

        </div>

      </div>
    </div>
  </div>
  )
}

export default Dashboard
