import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Home from './Home'; // Add a Home component for the root path
import PdfBuilder from './pdfMaker/pdfBuilder';
function App() {
  return (
    <div>

      <Routes>
 
        <Route path="/" element={<PdfBuilder />} />
       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
      </Routes>
    </div>
  );
}

export default App;
