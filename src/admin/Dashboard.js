import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admincss/dashboard.css";
import { initParticles, cleanupParticles } from "../animations/loginParticles";

import { 
  FaChartBar, 
  FaFolderOpen, 
  FaSignOutAlt, 
  FaInfoCircle,
  FaHome,
  FaCode
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Initialize particles
    const cleanup = initParticles();
    
    // Reinitialize on resize
    const handleResize = () => {
      cleanup();
      setTimeout(() => initParticles(), 100);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cleanup();
      cleanupParticles();
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNavigation = (path) => {
    // Add button press feedback for mobile
    if (isMobile) {
      const button = document.querySelector(`[data-path="${path}"]`);
      if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = '';
        }, 150);
      }
    }
    navigate(path);
  };

  const dashboardButtons = [
    {
      path: "/admin/manage-projects",
      label: "Projects",
      icon: <FaFolderOpen className="btn-icon" />,
      color: "#10b981"
    },
    {
      path: "/admin/manage-certifications",
      label: "Certifications",
      icon: <FaChartBar className="btn-icon" />,
      color: "#f59e0b"
    },
    {
      path: "/admin/manage-skills",
      label: "Skills",
      icon: <FaCode className="btn-icon" />,
      color: "#8b5cf6"
    },
    {
      path: "/admin/manage-about",
      label: "About",
      icon: <FaInfoCircle className="btn-icon" />,
      color: "#ef4444"
    },
    {
      path: "/admin/manage-home",
      label: "Home Content",
      icon: <FaHome className="btn-icon" />,
      color: "#06b6d4"
    },
    {
      path: "/logout",
      label: "Logout",
      icon: <FaSignOutAlt className="btn-icon" />,
      color: "#f97316"
    }
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Background Canvas */}
      <canvas 
        id="bgCanvas" 
        aria-hidden="true"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      ></canvas>

      <div className="admin-dashboard">
        <h1 className="dashboard-title">
          <span className="title-gradient">✨ Admin Dashboard ✨</span>
        </h1>
        
        <p className="dashboard-subtitle">
          Manage your content quickly and efficiently
        </p>

        <div className="admin-actions">
          {dashboardButtons.map((button, index) => (
            <button
              key={button.path}
              onClick={() => handleNavigation(button.path)}
              data-path={button.path}
              style={{ '--hover-color': button.color }}
              aria-label={`Navigate to ${button.label} page`}
            >
              {button.icon}
              <span className="btn-label">{button.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Hint */}
        {isMobile && (
          <div className="mobile-hint">
            <p>👆 Tap any option to manage</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;