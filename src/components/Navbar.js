// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle active link
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Handle logo click for admin (secret button)
  const handleLogoClick = (e) => {
    // You can add double-click or other secret pattern here
    navigate("/admin/login");
  };

  // Show subtle admin hint on logo hover
  const handleLogoMouseEnter = () => {
    setShowAdminHint(true);
  };

  const handleLogoMouseLeave = () => {
    setShowAdminHint(false);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        {/* Logo + Name - Secret Admin Button */}
        <div className="logo-container">
          <div 
            className="logo-link admin-secret"
            onClick={handleLogoClick}
            onMouseEnter={handleLogoMouseEnter}
            onMouseLeave={handleLogoMouseLeave}
            title="Double click for admin access"
          >
            <img src={logo} alt="Logo" className="logo-image" />
            <h2 className="logo">Srinivas</h2>
            <span className="logo-subtitle">Developer</span>
            
            {/* Subtle admin indicator - only visible on hover */}
            {showAdminHint && (
              <div className="admin-secret-hint">
                <span className="lock-icon"></span>
                <span className="hint-text">#</span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${isActive("/")}`}>
              <i className="nav-icon">🏠</i>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/about" className={`nav-link ${isActive("/about")}`}>
              <i className="nav-icon">👤</i>
              <span>About</span>
            </Link>
          </li>
          <li>
            <Link to="/skills" className={`nav-link ${isActive("/skills")}`}>
              <i className="nav-icon">💻</i>
              <span>Tech Stack</span>
            </Link>
          </li>
          <li>
            <Link to="/projects" className={`nav-link ${isActive("/projects")}`}>
              <i className="nav-icon">🔬</i>
              <span>Experiments</span>
            </Link>
          </li>
          <li>
            <Link to="/certifications" className={`nav-link ${isActive("/certifications")}`}>
              <i className="nav-icon">📜</i>
              <span>Credentials</span>
            </Link>
          </li>
          <li>
            <Link to="/contact" className={`nav-link ${isActive("/contact")}`}>
              <i className="nav-icon">📧</i>
              <span>Contact</span>
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? "open" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <div 
              className="mobile-logo-container"
              onClick={() => navigate("/admin/login")}
              style={{ cursor: 'pointer' }}
            >
              <img src={logo} alt="Logo" className="mobile-logo" />
              <h2>Srinivas</h2>
              <span className="logo-subtitle">Developer</span>
              <span className="mobile-admin-hint">Tap for Admin</span>
            </div>
          </div>
          
          <ul className="mobile-nav-links">
            <li>
              <Link to="/" className={`mobile-nav-link ${isActive("/")}`}>
                <i className="nav-icon">🏠</i>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className={`mobile-nav-link ${isActive("/about")}`}>
                <i className="nav-icon">👤</i>
                <span>About</span>
              </Link>
            </li>
            <li>
              <Link to="/skills" className={`mobile-nav-link ${isActive("/skills")}`}>
                <i className="nav-icon">💻</i>
                <span>Tech Stack</span>
              </Link>
            </li>
            <li>
              <Link to="/projects" className={`mobile-nav-link ${isActive("/projects")}`}>
                <i className="nav-icon">🔬</i>
                <span>Experiments</span>
              </Link>
            </li>
            <li>
              <Link to="/certifications" className={`mobile-nav-link ${isActive("/certifications")}`}>
                <i className="nav-icon">📜</i>
                <span>Credentials</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`mobile-nav-link ${isActive("/contact")}`}>
                <i className="nav-icon">📧</i>
                <span>Contact</span>
              </Link>
            </li>
          </ul>
          
          <div className="mobile-menu-footer">
            <p className="secret-hint">
              <i>👁️</i> Logo is your secret key
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;