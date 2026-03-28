import React, { useState, useEffect } from "react";
import "../styles/footer.css";

function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
    
            <p className="footer-tagline">Turning ideas into elegant solutions</p>
          </div>
          <div className="footer-copyright">
            <p className="footer-developer">
              Designed & Developed by Srinivas
            </p>
            <p className="footer-rights">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </>
  );
}

export default Footer;