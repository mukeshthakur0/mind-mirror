import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home';
import  Section from './pages/section'
import AuthPage from './pages/login'
import SignUpPage from './pages/signup';
import Dashboard from "./pages/dashboard";
import { useLocation } from 'react-router-dom';
import Sidebar from "./components/sidebar";
import JournalSection from "./pages/journel";
import ProtectedRoute from "./components/protected";

function App() {
  const location = useLocation();
   const hideNavbarRoutes = ["/Dashboard"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Section />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<AuthPage />} />
       
        <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><JournalSection /></ProtectedRoute>} />
      </Routes>
      
   </div>
   
  );


}

export default App;