import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the menu when the hamburger is clicked
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav>
      <div className="nav-logo">
        <Link to="/">New York Side Rentals</Link>
      </div>

      {/* Hamburger Menu Icon */}
      <div className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <ul className="nav-links">
          <li><NavLink to="/register" activeclassname="active">Register</NavLink></li>
          <li><NavLink to="/login" activeclassname="active">Sign In</NavLink></li>
          <li><NavLink to="/available-units" activeclassname="active">Availability</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
