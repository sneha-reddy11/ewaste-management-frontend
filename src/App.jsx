import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from "react";
import { testBackend } from "./api/api";
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Services from './pages/Services'; 


function App() {
  useEffect(() => {
    testBackend()
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/services" element={<Services />} /> 
        
      </Routes>
    </BrowserRouter>
  );

}

export default App;