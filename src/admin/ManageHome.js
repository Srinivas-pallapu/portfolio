import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { FaUser, FaLink, FaImage, FaFilePdf, FaSave, FaTimes } from "react-icons/fa";
import "../styles/admincss/managehome.css";

// Particle animation function
function initParticles(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const numParticles = 150;

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: Math.random() * 1 + 0.2,
      opacity: Math.random() * 0.5 + 0.2,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y > canvas.height) p.y = 0;
      if (p.x > canvas.width) p.x = 0;
      if (p.x < 0) p.x = canvas.width;
    });

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function ManageHome() {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeURL, setResumeURL] = useState(null);
  const [message, setMessage] = useState("");

  const cloudName = "dy9dlvgtw";
  const uploadPreset = "uploaded";

  useEffect(() => {
    if (canvasRef.current) initParticles(canvasRef.current);
  }, []);

  useEffect(() => {
    const fetchHome = async () => {
      setLoading(true);
      try {
        const homeDocRef = doc(db, "home", "main");
        const docSnap = await getDoc(homeDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setBio(data.bio || "");
          setGithub(data.socials?.github || "");
          setLinkedin(data.socials?.linkedin || "");
          setTwitter(data.socials?.twitter || "");
          setLeetcode(data.socials?.leetcode || "");
          setPhotoURL(data.photoURL || null);
          setResumeURL(data.resumeURL || null);
        }
      } catch (err) {
        console.error(err);
        setMessage("Failed to load data!");
        setTimeout(() => setMessage(""), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    setPhotoURL(URL.createObjectURL(file));
  };

  const handleResumeChange = (e) => setResumeFile(e.target.files[0]);

  const uploadToCloudinary = async (file, folder = "home") => {
    if (!file) return null;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`);
      xhr.onload = () =>
        xhr.status === 200 ? resolve(JSON.parse(xhr.response)) : reject(xhr.responseText);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", folder);
      xhr.send(formData);
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let uploadedPhotoURL = photoURL;
      let uploadedResumeURL = resumeURL;

      if (photoFile) {
        const photoData = await uploadToCloudinary(photoFile, "home/photo");
        uploadedPhotoURL = photoData.secure_url;
      }
      if (resumeFile) {
        const resumeData = await uploadToCloudinary(resumeFile, "home/resume");
        uploadedResumeURL = resumeData.secure_url;
      }

      const homeDocRef = doc(db, "home", "main");
      await setDoc(homeDocRef, {
        name,
        bio,
        socials: { 
          github, 
          linkedin, 
          twitter, 
          leetcode
        },
        photoURL: uploadedPhotoURL,
        resumeURL: uploadedResumeURL,
        updatedAt: new Date().toISOString(),
      });

      setMessage("Home content updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update: " + err.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate back or reset form
    window.history.back();
  };

  return (
    <div className={`manage-page ${loading ? 'loading' : ''}`}>
      <canvas ref={canvasRef} className="particle-canvas"></canvas>
      
      <div className="manage-wrapper">
        <div className="manage-card">
          {/* Card Header */}
          <div className="card-header">
            <h2>Edit Home Page</h2>
            <p className="card-subtitle">Manage your profile information and social links</p>
          </div>

          {/* Scrollable Content */}
          <div className="card-content">
            <div className="form-container">
              {/* Basic Info Card */}
              <div className="form-card">
                <div className="section-header">
                  <FaUser className="section-icon" />
                  <h3>Basic Information</h3>
                </div>
                
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio / Introduction</label>
                  <textarea
                    id="bio"
                    className="form-textarea"
                    placeholder="Write a short bio about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>

              {/* Social Links Card */}
              <div className="form-card">
                <div className="section-header">
                  <FaLink className="section-icon" />
                  <h3>Social Links</h3>
                </div>

                <div className="social-grid">
                  <div className="form-group">
                    <label htmlFor="github">GitHub</label>
                    <input
                      id="github"
                      type="url"
                      className="form-input social-input github-input"
                      placeholder="https://github.com/yourusername"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="linkedin">LinkedIn</label>
                    <input
                      id="linkedin"
                      type="url"
                      className="form-input social-input linkedin-input"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="twitter">Twitter</label>
                    <input
                      id="twitter"
                      type="url"
                      className="form-input social-input twitter-input"
                      placeholder="https://twitter.com/yourusername"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="leetcode">LeetCode</label>
                    <input
                      id="leetcode"
                      type="url"
                      className="form-input social-input leetcode-input"
                      placeholder="https://leetcode.com/yourusername"
                      value={leetcode}
                      onChange={(e) => setLeetcode(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Profile Photo Card */}
              <div className="form-card">
                <div className="section-header">
                  <FaImage className="section-icon" />
                  <h3>Profile Photo</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="photo">Upload Photo</label>
                  <input
                    id="photo"
                    type="file"
                    className="file-input"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>

                {photoURL && (
                  <div className="preview-section">
                    <div className="preview-title">
                      <FaImage /> Preview
                    </div>
                    <img src={photoURL} alt="Profile Preview" className="image-preview" />
                  </div>
                )}
              </div>

              {/* Resume Card */}
              <div className="form-card">
                <div className="section-header">
                  <FaFilePdf className="section-icon" />
                  <h3>Resume</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="resume">Upload Resume (PDF)</label>
                  <input
                    id="resume"
                    type="file"
                    className="file-input"
                    accept=".pdf"
                    onChange={handleResumeChange}
                  />
                </div>

                {resumeURL && (
                  <div className="preview-section">
                    <div className="preview-title">
                      <FaFilePdf /> Existing Resume
                    </div>
                    <a 
                      href={resumeURL} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="resume-link"
                    >
                      View/Download Resume
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="save-button" 
                  onClick={handleSave}
                  disabled={loading}
                >
                  <FaSave /> Save Changes
                </button>
                <button 
                  className="cancel-button" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Message */}
      {message && (
        <div className={`popup-message ${message.includes('Failed') ? 'error' : 'success'}`}>
          {message.includes('Failed') ? '❌' : '✅'} {message}
        </div>
      )}
    </div>
  );
}

export default ManageHome;