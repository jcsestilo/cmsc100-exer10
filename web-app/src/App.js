import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route exact={true} path="/" element={<Home/>} />
        <Route exact={true} path="/game" element={<SignUp/>} />

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
