import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import "./styles/backgrounds.css";

/* Components */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimatedBackground from "./components/AnimatedBackground";

/* Preloader */
import RasenganLoader from "./components/RasenganLoader/SignatureLoader";

/* Public Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Certifications from "./pages/Certifications";
import Contact from "./pages/Contact";

/* Admin Pages */
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import ManageProjects from "./admin/ManageProjects";
import ManageSkills from "./admin/ManageSkills";
import ManageCertifications from "./admin/ManageCertifications";
import ManageHome from "./admin/ManageHome";
import ManageAbout from "./admin/ManageAbout";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Set up auth listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Simulate content loading with better progress increments
    const loadContent = () => {
      const loadSteps = [
        { task: "Initializing chakra...", duration: 400 },
        { task: "Loading ninja skills...", duration: 600 },
        { task: "Unlocking portfolio...", duration: 500 },
        { task: "Finalizing summoning...", duration: 300 }
      ];

      let currentStep = 0;
      let currentProgress = 0;

      const loadStep = () => {
        if (currentStep >= loadSteps.length) {
          // All steps completed
          setProgress(100);

          // Final delay before showing app
          setTimeout(() => {
            setIsLoading(false);
          }, 800);

          return;
        }

        const step = loadSteps[currentStep];
        const progressIncrement = 100 / loadSteps.length;

        // Animate progress increase
        const interval = setInterval(() => {
          currentProgress += 1;
          setProgress(Math.min(currentProgress, (currentStep + 1) * progressIncrement));

          if (currentProgress >= (currentStep + 1) * progressIncrement) {
            clearInterval(interval);
            currentStep++;

            // Move to next step
            setTimeout(loadStep, step.duration);
          }
        }, 30);
      };

      loadStep();
    };

    // Start loading immediately
    loadContent();

    return () => {
      unsubscribe();
    };
  }, []);

  // Show preloader while loading
  if (isLoading) {
    return (
      <div className="preloader-container">
        <RasenganLoader
          progress={progress}
          onComplete={() => { }}
        />

        {/* Add CSS directly */}
        <style jsx="true">{`
          .preloader-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000814;
            overflow: hidden;
            z-index: 9999;
          }
        `}</style>
      </div>
    );
  }

  // Return main app after loading with smooth transition
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <AnimatedBackground>
          <Routes>
            {/* =========================
                Public Routes
            ========================== */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/contact" element={<Contact />} />

            {/* =========================
                Admin Routes (Protected)
            ========================== */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/manage-projects"
              element={user ? <ManageProjects /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/manage-skills"
              element={user ? <ManageSkills /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/manage-certifications"
              element={user ? <ManageCertifications /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/manage-home"
              element={user ? <ManageHome /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/manage-about"
              element={user ? <ManageAbout /> : <Navigate to="/admin/login" />}
            />

            {/* =========================
                Redirect Unknown Routes
            ========================== */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatedBackground>
        <Footer />
      </div>
    </Router>
  );
}

export default App;