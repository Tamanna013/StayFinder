import React from 'react';
import './Footer.css'; // Create this CSS file

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} StayFinder. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;