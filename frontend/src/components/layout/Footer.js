import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 w-full">
      <div className="max-w-screen-xl mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} StayFinder. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
