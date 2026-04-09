import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {user, logout} = useAuth();
  const navigate = useNavigate();

  // Toggle the menu when the hamburger is clicked
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  }

  const getNavClass = ({ isActive }) => isActive ? "nav-link active" : "nav-link";

  const handleLogout = () => {
    logout();
    navigate("/login")
  }

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
          <li><input type="text" placeholder="Search by city, zip, or address" /></li>
          <li><NavLink to="/" onClick={handleLinkClick} className={getNavClass}>Home</NavLink></li>
          <li><NavLink to="/available-units" onClick={handleLinkClick} className={getNavClass}>Availability</NavLink></li>
          {!user ? (
            <>
            <li><NavLink to="/register" onClick={handleLinkClick} className={getNavClass}>Register</NavLink></li>
            <li><NavLink to="/login" onClick={handleLinkClick} className={getNavClass}>Sign In</NavLink></li> 
            </>
          ) : (
            <>
              <li><NavLink to="/dashboard" onClick={handleLinkClick} className={getNavClass}>Dashboard</NavLink></li>
              <li>
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </li>
            </>
          )

          }
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
