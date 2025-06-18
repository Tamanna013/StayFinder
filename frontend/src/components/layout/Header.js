import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold no-underline">
          StayFinder
        </Link>
        <nav>
          <ul className="flex space-x-6 m-0 p-0 list-none">
            <li>
              <Link to="/" className="text-white font-medium hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/host-dashboard" className="text-white font-medium hover:underline">Host Dashboard</Link>
            </li>
            <li>
              <Link to="/login" className="text-white font-medium hover:underline">Login</Link>
            </li>
            <li>
              <Link to="/register" className="text-white font-medium hover:underline">Register</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
