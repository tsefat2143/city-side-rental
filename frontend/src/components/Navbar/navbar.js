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
        <Link to="/">Spotlight Estates</Link>
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
          <li><NavLink to="/available-units" activeclassname="active">Availability</NavLink></li>
          <li><NavLink to="/tenants" activeclassname="active">Tenants</NavLink></li>
          <li><NavLink to="/contact" activeclassname="active">Contact</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
