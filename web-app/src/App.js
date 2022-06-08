import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/home';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import Feed from './pages/Feed';
import Profile from './pages/Profile.js'

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route exact={true} path="/" element={<Home />} />
        <Route exact={true} path="/signup" element={<SignUp />} />
        <Route exact={true} path="/login" element={<LogIn />} />
        <Route exact={true} path="/feed" element={<Feed />} />
        <Route exact={false} path="/feed/profile" element={<Profile />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
