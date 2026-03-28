import React, { useState, useEffect } from "react";
import { collection, addDoc, setDoc, doc, onSnapshot, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import "../styles/admincss/manageskills.css";
import { initParticles } from "../animations/loginParticles";

// Skill name to icon mapping
const skillIcons = {
  'javascript': 'devicon-javascript-plain',
  'react': 'devicon-react-original',
  'python': 'devicon-python-plain',
  'nodejs': 'devicon-nodejs-plain',
  'html': 'devicon-html5-plain',
  'css': 'devicon-css3-plain',
  'mongodb': 'devicon-mongodb-plain',
  'firebase': 'devicon-firebase-plain',
  'git': 'devicon-git-plain',
  'github': 'devicon-github-plain',
  'mysql': 'devicon-mysql-plain',
  'docker': 'devicon-docker-plain',
  'aws': 'devicon-amazonwebservices-plain',
  'wordpress': 'devicon-wordpress-plain',
  'wix': 'devicon-devicon-plain',
  'video editing': 'devicon-premierepro-plain',
  'game editing': 'devicon-unity-plain',
  'social media': 'devicon-facebook-plain',
  'default': 'devicon-devicon-plain'
};

function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState(50);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [loading, setLoading] = useState(true);

  // Get icon class for skill name
  const getSkillIcon = (skillName) => {
    if (!skillName) return skillIcons.default;
    
    const lowerName = skillName.toLowerCase().trim();
    
    if (skillIcons[lowerName]) {
      return skillIcons[lowerName];
    }
    
    for (const [key, icon] of Object.entries(skillIcons)) {
      if (lowerName.includes(key)) {
        return icon;
      }
    }
    
    return skillIcons.default;
  };

  // Initialize particle background
  useEffect(() => {
    try {
      initParticles("bgCanvas");
    } catch (e) {
      console.warn("Particles init failed:", e);
    }
  }, []);

  // Load skills from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "skills"), (snapshot) => {
      setSkills(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching skills:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleSave = async () => {
    if (!name || !percentage) {
      showMessage("Please fill all fields!", "error");
      return;
    }
    
    if (percentage < 0 || percentage > 100) {
      showMessage("Percentage must be between 0-100!", "error");
      return;
    }
    
    try {
      const skillData = { 
        name: name.trim(),
        percentage: parseInt(percentage),
        icon: getSkillIcon(name),
        updatedAt: new Date().toISOString()
      };
      
      if (editId) {
        await setDoc(doc(db, "skills", editId), skillData);
        setEditId(null);
        showMessage("Skill updated successfully!", "success");
      } else {
        skillData.createdAt = new Date().toISOString();
        await addDoc(collection(db, "skills"), skillData);
        showMessage("Skill added successfully!", "success");
      }
      setName(""); 
      setPercentage(50);
    } catch (err) {
      showMessage("Failed: " + err.message, "error");
    }
  };

  const handleEdit = (skill) => {
    setName(skill.name);
    setPercentage(skill.percentage || 50);
    setEditId(skill.id);
    
    // Scroll to form
    document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteDoc(doc(db, "skills", id));
        showMessage("Skill deleted successfully!", "success");
      } catch (err) {
        showMessage("Failed to delete skill: " + err.message, "error");
      }
    }
  };

  const handleCancel = () => {
    setName("");
    setPercentage(50);
    setEditId(null);
  };

  if (loading) {
    return (
      <div className="manage-skills-wrapper">
        <canvas id="bgCanvas" className="bg-canvas"></canvas>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-skills-wrapper">
      <canvas id="bgCanvas" className="bg-canvas"></canvas>

      <div className="manage-skills">
        <h2>Manage Skills</h2>

        {/* Form Section */}
        <div className="form-section">
          <div className="form-card">
            <h3>{editId ? "Edit Skill" : "Add New Skill"}</h3>
            
            <div className="form-group">
              <input 
                type="text"
                placeholder="Skill Name (e.g., HTML, React, Video Editing)" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="skill-name-input"
              />
              
              <div className="percentage-control">
                <label htmlFor="percentage-slider">
                  Skill Level: <span className="percentage-value">{percentage}%</span>
                </label>
                <input 
                  type="range"
                  id="percentage-slider"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="percentage-slider"
                />
                <div className="percentage-labels">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Skill Preview */}
              {name && (
                <div className="skill-preview">
                  <div className="preview-header">
                    <i className={`${getSkillIcon(name)} colored preview-icon`}></i>
                    <div className="preview-info">
                      <h4>{name}</h4>
                      <div className="preview-percentage">{percentage}%</div>
                    </div>
                  </div>
                  <div className="preview-progress">
                    <div 
                      className="progress-bar"
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="progress-fill"></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button 
                  onClick={handleSave} 
                  className="save-btn"
                  disabled={!name.trim() || percentage < 0 || percentage > 100}
                >
                  {editId ? "Update Skill" : "Add Skill"}
                </button>
                
                {editId && (
                  <button 
                    onClick={handleCancel}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills List Section */}
        <div className="skills-section">
          <div className="section-header">
            <h3>Your Skills ({skills.length})</h3>
            {skills.length > 0 && (
              <div className="stats">
                <span className="stat-item">
                  <span className="stat-label">Average:</span>
                  <span className="stat-value">
                    {Math.round(skills.reduce((acc, skill) => acc + (skill.percentage || 50), 0) / skills.length)}%
                  </span>
                </span>
                <span className="stat-item">
                  <span className="stat-label">Highest:</span>
                  <span className="stat-value">
                    {Math.max(...skills.map(s => s.percentage || 50))}%
                  </span>
                </span>
              </div>
            )}
          </div>

          {skills.length === 0 ? (
            <div className="no-skills">
              <p>No skills added yet. Start by adding your first skill above!</p>
            </div>
          ) : (
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div 
                  key={skill.id} 
                  className="skill-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="skill-header">
                    <i className={`${skill.icon || getSkillIcon(skill.name)} colored skill-icon`}></i>
                    <div className="skill-info">
                      <h4>{skill.name}</h4>
                      <div className="skill-percentage">{skill.percentage || 50}%</div>
                    </div>
                    <div className="skill-actions">
                      <button 
                        onClick={() => handleEdit(skill)}
                        className="edit-btn"
                        aria-label="Edit skill"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(skill.id)}
                        className="delete-btn"
                        aria-label="Delete skill"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="skill-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${skill.percentage || 50}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {message.text && (
          <div className={`popup-message ${message.type}`}>
            <div className="popup-content">
              {message.type === "success" ? "✅" : "❌"} {message.text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageSkills;