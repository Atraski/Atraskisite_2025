import React, { useState } from 'react';
import { assets } from '../assets/assets.js';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent text-white flex items-center justify-between px-6 py-4">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
        <img src={assets.logoatraski} alt="atraski-logo" className="w-32" />
        </Link>
      </div>

      {/* Hamburger Icon (mobile) */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)}>
          <img src={assets.hamburger} alt="menu" className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Menu - Desktop */}
      <div className="hidden md:flex space-x-10 items-center ml-auto">
        <ul className="flex gap-6 cursor-pointer text-medium text-white items-center">
          <li><Link to="/about" className='hover:underline whitespace-nowrap'>About Us</Link></li>
          <li><Link to="/business" className="hover:underline">Business</Link></li>
          <li><Link to="/careers" className="hover:underline">Careers</Link></li>
          {/* <li><Link to="/learn" className="hover:underline">Learn</Link></li> */}
        </ul>

        {/* Mail Icon */}
        <div className="ml-4">
          <img src={assets.mail} className="w-6 h-6" alt="mail-icon" />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#1B1B1B] text-white flex flex-col items-center py-4 md:hidden shadow-lg">
          <ul className="flex flex-col gap-4 text-center text-sm font-medium">
            <li>
              <Link to="/about" className="hover:underline" onClick={() => setIsOpen(false)}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/business" className="hover:underline" onClick={() => setIsOpen(false)}>
                Business
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:underline" onClick={() => setIsOpen(false)}>
                Careers
              </Link>
            </li>
            <li>
              <Link to="/learn" className="hover:underline" onClick={() => setIsOpen(false)}>
                Learn
              </Link>
            </li>
          </ul>
          <div className="mt-4">
            <a href="mailto:info@atraski.com">
              <img src={assets.mail} className="w-6 h-6" alt="mail-icon" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
