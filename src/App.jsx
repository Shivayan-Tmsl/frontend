import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Expense from './pages/Expense';
import Income from './pages/Income';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  

  return (
    <>
    <div>
      <Router>
        <Routes>
          <Route path = "/" element={<Dashboard/>} />
          <Route path = "/expense" element={<Expense/>} />
          <Route path = "/income" element={<Income/>} />
          <Route path = "/signup" element={<Signup/>} />
          <Route path = "/login" element={<Login/>} />
        </Routes>
      </Router>

    </div>
      
    </>
  )
}

export default App
