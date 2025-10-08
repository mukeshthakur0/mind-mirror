import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link
import logo from '../assets/logo.jpg'; 

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div>
      <nav className="bg-white p-2 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center flex-wrap">
          
          {/* Logo */}
          <div className="w-auto h-12 object-contain overflow-hidden transform shadow-2xl mask-top-left">
            <img
              src={logo}
              alt="Mental Health"
              className="w-full h-full object-cover filter grayscale-0 transition duration-300"
            />
          </div>

          {/* Hamburger Menu Button */}
          <button
            className="md:hidden text-black focus:outline-none"
            onClick={toggleMenu}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Nav Links */}
          <ul className={`w-full md:flex md:items-center md:space-x-6 md:w-auto ${isOpen ? 'block' : 'hidden'}`}>
            <li className="my-2 md:my-0">
              <Link to="/" className="text-gray-600 hover:text-black mx-4 font-festive">Home</Link>
            </li>
            <li className="my-2 md:my-0">
              <Link to="/about" className="text-gray-600 hover:text-black mx-4 font-festive">About</Link>
            </li>
            <li className="my-2 md:my-0">
              <Link to="/signup" className="text-gray-600 hover:text-black mx-4 font-festive">Signup</Link>
            </li>
            <li className="my-2 md:my-0">
              <Link to="/signin" className="text-gray-600 hover:text-black mx-4 font-festive">SignIn</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;  