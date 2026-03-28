import React, { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { initParticles, cleanupParticles } from "../animations/loginParticles";
import "../styles/admincss/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const animationCleanupRef = useRef(null);

  useEffect(() => {
  
    const cleanup = initParticles(); //particles calling  ----- function 
    animationCleanupRef.current = cleanup;

    
    const handleResize = () => {
     
      if (animationCleanupRef.current) {
        animationCleanupRef.current();
      }
      const newCleanup = initParticles();
      animationCleanupRef.current = newCleanup;
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      if (animationCleanupRef.current) {
        animationCleanupRef.current();
      }
      window.removeEventListener('resize', handleResize);
      cleanupParticles();
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setShake(false);
    setShowPopup(false);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      navigate("/admin/dashboard");
    } catch (err) {
      let message = "Login failed!";
      
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          message = "Wrong email or password!";
          break;
        case "auth/user-not-found":
          message = "User not found!";
          break;
        case "auth/invalid-email":
          message = "Invalid email format!";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Try again later.";
          break;
        default:
          message = "Login failed. Please try again.";
      }

      setPopupMessage(message);
      setShowPopup(true);
      setShake(true);

      // Shake animation
      setTimeout(() => setShake(false), 600);
      
      // Hide popup
      const popupTimer = setTimeout(() => setShowPopup(false), 3000);
      
      // Clear timeout on unmount
      return () => clearTimeout(popupTimer);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin(e);
    }
  };

  // Focus effect for inputs
  const handleInputFocus = (e) => {
    e.target.parentElement.style.transform = 'scale(1.02)';
  };

  const handleInputBlur = (e) => {
    e.target.parentElement.style.transform = 'scale(1)';
  };

  return (
    <div className="login-page" onKeyPress={handleKeyPress}>
      <canvas 
        id="bgCanvas" 
        aria-hidden="true"
        style={{ position: 'absolute', top: 0, left: 0 }}
      ></canvas>

      <div className={`admin-login ${shake ? "shake" : ""}`}>
        <h2 className="login-title">
          <span className="title-glow">Admin Login</span>
        </h2>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={isLoading}
              required
              autoComplete="email"
              aria-label="Email Address"
              className="login-input"
            />
            <span className="input-icon">📧</span>
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={isLoading}
              required
              autoComplete="current-password"
              aria-label="Password"
              className="login-input"
            />
            <span className="input-icon">🔒</span>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`login-button ${isLoading ? 'loading' : ''}`}
            aria-label={isLoading ? "Logging in..." : "Login"}
          >
            {isLoading ? (
              <>
                <span className="button-spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <div className="login-hint">
          <span className="hint-icon">💡</span>
          <p>Use your admin credentials to access the dashboard</p>
        </div>
      </div>

      {showPopup && (
        <div 
          className="popup" 
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <span className="popup-icon">⚠️</span>
          <span className="popup-text">{popupMessage}</span>
        </div>
      )}
    </div>
  );
}

export default Login;