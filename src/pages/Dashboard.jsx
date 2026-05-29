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
   <div className='min-h-screen bg-gray-100 flex flex-col overflow-x-hidden'>
  <Navbar />

  {/* FIX 1: Added max-w-full and overflow-x-hidden to prevent lateral content blowouts */}
  <div className='flex flex-1 w-full max-w-full overflow-x-hidden pt-16'>

    {/* Sidebar */}
    <div className='w-1/5 fixed top-16 left-0 h-[calc(100vh-16px)] bg-white shadow-md rounded-xl lg:block hidden z-40'>
      <SideMenu />
    </div>

    {/* Main Content Wrapper */}
    {/* FIX 2: Corrected widths and margins so mobile is clean, and desktop accounts for the 1/5 (20%) fixed sidebar */}
    <div className='w-full min-w-0 lg:w-4/5 lg:ml-[20%] flex flex-col pb-10'>

      {/* Top Summary Cards */}
      {/* FIX 3: Cleaned up conflicting top margin spaces ('mt-20' and 'mt-14' combined were adding huge gaps) */}
      <div className='w-full rounded-xl px-4 lg:px-6 mt-6'>
        <div className='bg-white shadow-md w-full flex flex-col lg:flex-row justify-evenly p-5 sm:p-7 rounded-xl gap-4'>

          <div className='flex items-center justify-center gap-3 bg-gray-50 rounded-xl p-4 shadow-md w-full min-w-0'>
            <div className='rounded-full w-14 h-14 sm:w-20 sm:h-20 bg-emerald-200 flex items-center justify-center hover:bg-emerald-300 flex-shrink-0'>
              <FaWallet className='text-xl sm:text-2xl' />
            </div>
            {/* FIX 4: Lowered mobile text sizing slightly so layout doesn't split sentences on small devices */}
            <div className='text-base sm:text-xl font-bold truncate'>
              Total Balance : Rs {dashboardData?.totalBalance || 0}
            </div>
          </div>

          <div className='flex items-center justify-center gap-3 bg-gray-50 rounded-xl p-4 shadow-md w-full min-w-0'>
            <div className='rounded-full w-14 h-14 sm:w-20 sm:h-20 bg-emerald-200 flex items-center justify-center hover:bg-emerald-300 flex-shrink-0'>
              <GiReceiveMoney className='text-2xl sm:text-3xl' />
            </div>
            <div className='text-base sm:text-xl font-bold truncate'>
              Total Income : Rs {dashboardData?.totalIncome || 0}
            </div>
          </div>

          <div className='flex items-center justify-center gap-3 bg-gray-50 rounded-xl p-4 shadow-md w-full min-w-0'>
            <div className='rounded-full w-14 h-14 sm:w-20 sm:h-20 bg-emerald-200 flex items-center justify-center hover:bg-emerald-300 flex-shrink-0'>
              <GiPayMoney className='text-2xl sm:text-3xl' />
            </div>
            <div className='text-base sm:text-xl font-bold truncate'>
              Total Expense : Rs {dashboardData?.totalExpense || 0}
            </div>
          </div>

        </div>
      </div>

      {/* Middle Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 px-4 lg:px-6 w-full box-border'>

        {/* Recent Transactions */}
        <div className='bg-white shadow-md p-6 sm:p-8 rounded-xl flex flex-col min-w-0'>
          <p className='text-md font-bold'>Recent Transactions</p>

          <div className='flex flex-col gap-4 mt-4'>
            {dashboardData?.recentTransactions.map((item, index) => (
              <div key={index} className='flex items-center justify-between p-3 rounded-md bg-gray-50 shadow-sm gap-2 min-w-0'>
                <div className='flex items-center gap-3 min-w-0'>
                  <div className='rounded-full w-10 h-10 p-2 bg-blue-200 flex items-center justify-center flex-shrink-0'>
                    {item.type === 'income' ? <GiReceiveMoney className='text-xl' /> : <GiPayMoney className='text-xl' />}
                  </div>
                  <div className='min-w-0'>
                    <p className='font-bold truncate text-sm sm:text-base'>{item.title}</p>
                    <p className='text-xs sm:text-sm text-gray-500'>
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`font-bold text-sm sm:text-base flex-shrink-0 ${item.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                  {item.type === 'income' ? '+' : '-'} Rs {item.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Income Overview */}
        <div className='bg-white shadow-md p-6 sm:p-8 rounded-xl flex flex-col min-w-0'>
          <p className='text-md font-bold'>Income Overview</p>
          <div className='w-full overflow-hidden flex items-center justify-center mt-4'>
            <PieChartComponent dashboardData={dashboardData} />
          </div>
        </div>

        {/* Expenses Section */}
        <div className='bg-white shadow-md p-6 sm:p-8 rounded-xl flex flex-col min-w-0'>
          {/* FIX 5: Changed rigid 'gap-72' layout to justify-between so header text doesn't push the link element out of bounds */}
          <div className='text-md font-bold flex items-center justify-between w-full'>
            <span>Expenses</span> 
            <span className='flex items-center gap-2 bg-gray-50 shadow-sm border border-gray-100 rounded-xl py-1 px-3 text-xs sm:text-sm cursor-pointer select-none hover:bg-gray-100 transition-colors' onClick={()=>{navigate("/expense")}}>
              See more <LuArrowRight />
            </span>
          </div>
          {dashboardData?.last60DaysExpenses.transactions?.length > 0 ? (
            <div className='flex flex-col gap-4 mt-4'>
              {dashboardData?.last60DaysExpenses.transactions.slice(0, 5).map((item, index) => (
                <div key={index} className='flex items-center justify-between p-3 rounded-md bg-gray-50 shadow-sm gap-2 min-w-0'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='rounded-full w-10 h-10 p-2 bg-red-200 flex items-center justify-center flex-shrink-0'>
                      <GiPayMoney className='text-xl' />
                    </div>
                    <div className='min-w-0'>
                      <p className='font-bold truncate text-sm sm:text-base'>{item.category}</p>
                      <p className='text-xs sm:text-sm text-gray-500'>
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className='font-bold text-sm sm:text-base text-red-500 flex-shrink-0'>
                    - Rs {item.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 mt-4 text-sm'>No expenses to display.</p>
          )}
        </div>

        {/* Expenses Bar Chart */}
        <div className='bg-white shadow-md p-6 sm:p-8 rounded-xl flex flex-col min-w-0'>
          <p className='text-md font-bold'>Last 60 Days Expenses</p>
          <div className='mt-4 w-full overflow-x-auto flex items-center justify-center'>
            <BarChartComponent dashboardData={dashboardData} />
          </div>
        </div>

        {/* Incomes Section */}
        <div className='bg-white shadow-md p-6 sm:p-8 rounded-xl flex flex-col min-w-0'>
          {/* FIX 5 b: Changed flex gap-72 to justify-between */}
          <div className='text-md font-bold flex items-center justify-between w-full'>
            <span>Incomes</span>
            <span className='flex items-center gap-2 bg-gray-50 shadow-sm border border-gray-100 rounded-xl py-1 px-3 text-xs sm:text-sm cursor-pointer select-none hover:bg-gray-100 transition-colors' onClick={()=>{navigate("/income")}}>
              See more <LuArrowRight />
            </span>
          </div>
          {dashboardData?.last60DaysIncome.transactions?.length > 0 ? (
            <div className='flex flex-col gap-4 mt-4'>
              {dashboardData?.last60DaysIncome.transactions.slice(0, 5).map((item, index) => (
                <div key={index} className='flex items-center justify-between p-3 rounded-md bg-gray-50 shadow-sm gap-2 min-w-0'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='rounded-full w-10 h-10 p-2 bg-green-200 flex items-center justify-center flex-shrink-0'>
                      <GiReceiveMoney className='text-xl' />
                    </div>
                    <div className='min-w-0'>
                      <p className='font-bold truncate text-sm sm:text-base'>{item.source}</p>
                      <p className='text-xs sm:text-sm text-gray-500'>
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className='font-bold text-sm sm:text-base text-green-500 flex-shrink-0'>
                    + Rs {item.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 mt-4 text-sm'>No incomes to display.</p>
          )}
        </div>

        {/* Last 60 Days Income Chart */}
        <div className='bg-white shadow-md p-6 sm:p-8 rounded-xl flex flex-col min-w-0'>
          <p className='text-md font-bold'>Last 60 Days Income</p>
          <div className='w-full overflow-hidden flex items-center justify-center mt-4'>
            <IncomePieChart dashboardData={dashboardData} />
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
  )
}

export default Dashboard
