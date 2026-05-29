import React, { useState } from 'react';
import { HiMenu } from "react-icons/hi";
import { TbAnalyze } from 'react-icons/tb';
import { MdAccountBalanceWallet } from 'react-icons/md';
import SideMenu from './SideMenu';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import ReactMarkdown from "react-markdown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [month, setMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  const [analyze, setAnalyze] = useState('');
  const [predictedExpense, setPredictedExpense] = useState(0);

  const token = localStorage.getItem("token");

  const handleBudget = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://backend-ygfl.onrender.com/api/v1/budget/set", {
        month,
        amount
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error adding budget:", error);
    } finally {
      setLoading(false);
      setBudgetOpen(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://backend-ygfl.onrender.com/api/v1/gemini/prediction", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnalyze(response.data.geminiResponse);
      setPredictedExpense(response.data.prediction);
    } catch (error) {
      console.error("Error analyzing expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    setAnalyzeOpen(true);
    handleAnalyze();
  };

  return (
    /* FIX 1: Added 'flex items-center' to the wrapper to force its direct children 
      to stay perfectly centered vertically and respect the h-16 restriction.
    */
    <div className='bg-white shadow-md px-4 fixed top-0 left-0 right-0 w-full z-50 box-border h-16 flex items-center'>

      {/* Navbar Row */}
      {/* FIX 2: Added 'flex-nowrap' and 'h-full' to guarantee that components stay side-by-side 
        and never wrap onto a line below the navbar box bounds.
      */}
      <div className='flex items-center justify-between w-full max-w-full flex-nowrap h-full'>

        {/* Left Section */}
        {/* FIX 3: Modified widths to ensure that 'Expense Tracker' truncates nicely on narrow 
          screens instead of pushing the right-side icons completely off-screen.
        */}
        <div className='flex items-center gap-2 min-w-0 mr-2'>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='text-gray-500 hover:text-green-500 lg:hidden flex-shrink-0'
          >
            <HiMenu className='text-2xl' />
          </button>

          <h1 className='text-base sm:text-xl font-bold text-green-700 truncate select-none'>
            Expense Tracker
          </h1>
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-2 flex-nowrap flex-shrink-0'>

          <button className='bg-green-200 hover:bg-green-300 text-green-700 rounded-full flex items-center justify-center p-2 sm:px-4 sm:py-2 flex-shrink-0' onClick={handleClick}>
            <TbAnalyze className='text-xl flex-shrink-0' />
            <span className='hidden md:inline-block font-bold ml-1 whitespace-nowrap'>
              Analyze
            </span>
          </button>

          <button className='bg-green-200 hover:bg-green-300 text-green-700 rounded-full flex items-center justify-center p-2 sm:px-4 sm:py-2 flex-shrink-0' onClick={() => setBudgetOpen(true)}>
            <MdAccountBalanceWallet className='text-xl flex-shrink-0' />
            <span className='hidden md:inline-block font-bold ml-1 whitespace-nowrap'>
              Set Budget
            </span>
          </button>

          {/* Budget Modal */}
          {budgetOpen && (
            <div className='fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4'>
              <div className='w-full max-w-lg bg-white shadow-md flex flex-col rounded-xl p-5 gap-5'>
                <div className='flex bg-gray-200 justify-between items-center rounded-xl p-3'>
                  <h1 className='font-bold'>Set Budget</h1>
                  <FaTimes onClick={() => setBudgetOpen(false)} className='cursor-pointer' />
                </div>

                <form className='flex flex-col gap-4' onSubmit={handleBudget}>
                  <input
                    type="text"
                    placeholder='Month'
                    className='p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder='Amount'
                    className='p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <button
                    className='bg-green-200 hover:bg-green-300 text-green-700 font-bold p-2 rounded-xl flex items-center justify-center gap-2'
                    type='submit'
                  >
                    Set Budget
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Analyze Modal */}
          {analyzeOpen && (
            <div className='fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4'>
              <div className='w-full max-w-lg bg-white shadow-md flex flex-col rounded-xl p-5 gap-5'>
                <div className='flex bg-gray-200 justify-between items-center rounded-xl p-3'>
                  <h1 className='font-bold'>Analyze Expenses</h1>
                  <FaTimes onClick={() => setAnalyzeOpen(false)} className='cursor-pointer' />
                </div>
                <div className='flex flex-col items-center justify-center'>
                  {loading && <p className="mt-2 text-gray-500 font-semibold">Analyzing...</p>}
                  {!loading && analyze && (
                    <div className="mt-4 p-4 bg-white rounded-3xl border border-gray-300 max-h-[400px] overflow-auto text-black w-full">
                      <p className='font-bold mb-2'>{predictedExpense && `Predicted expense for next month: Rs ${predictedExpense.toFixed(2)}`}</p>
                      <ReactMarkdown
                        children={analyze}
                        components={{
                          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-black my-2" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-black my-2" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-black my-2" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-bold text-black" {...props} />,
                          li: ({ node, ...props }) => <li className="ml-6 list-disc my-1" {...props} />,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Side Menu */}
      {isMenuOpen && (
        <div className='lg:hidden absolute top-full left-3 w-2/3 bg-white shadow-xl rounded-xl p-2 border border-gray-100 mt-2 transition-all'>
          <SideMenu />
        </div>
      )}

    </div>
  );
};

export default Navbar;
