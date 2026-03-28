import React, { useState, useEffect } from "react";
import { collection, addDoc, setDoc, doc, onSnapshot, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import "../styles/admincss/manageproject.css";
import { initParticles } from "../animations/loginParticles";
import { FaPlus, FaTrash, FaEdit, FaLink, FaCode, FaVideo, FaTimes } from "react-icons/fa";

function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [technologies, setTechnologies] = useState([""]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [loading, setLoading] = useState(true);

  // Initialize particle background
  useEffect(() => {
    try {
      initParticles("bgCanvas");
    } catch (e) {
      console.warn("Particles init failed:", e);
    }
  }, []);

  // Load projects from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        technologies: Array.isArray(doc.data().technologies) 
          ? doc.data().technologies 
          : doc.data().technologies?.split(',').map(t => t.trim()) || []
      }));
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  // Add technology field
  const addTechnologyField = () => {
    setTechnologies([...technologies, ""]);
  };

  // Update technology field
  const updateTechnology = (index, value) => {
    const updated = [...technologies];
    updated[index] = value;
    setTechnologies(updated);
  };

  // Remove technology field
  const removeTechnology = (index) => {
    if (technologies.length > 1) {
      const updated = technologies.filter((_, i) => i !== index);
      setTechnologies(updated);
    }
  };

  // Add or update project
  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      showMessage("Title and Description are required!", "error");
      return;
    }

    try {
      const projectData = { 
        title: title.trim(),
        description: description.trim(),
        githubLink: githubLink.trim(),
        websiteLink: websiteLink.trim(),
        videoLink: videoLink.trim(),
        technologies: technologies.filter(t => t.trim() !== "")
      };

      if (editId) {
        await setDoc(doc(db, "projects", editId), projectData);
        showMessage("Project updated successfully!", "success");
        setEditId(null);
      } else {
        await addDoc(collection(db, "projects"), projectData);
        showMessage("Project added successfully!", "success");
      }
      
      // Reset form
      setTitle("");
      setDescription("");
      setGithubLink("");
      setWebsiteLink("");
      setVideoLink("");
      setTechnologies([""]);
    } catch (err) {
      console.error("Error saving project:", err);
      showMessage("Failed to save project: " + err.message, "error");
    }
  };

  // Edit project
  const handleEdit = (project) => {
    setTitle(project.title || "");
    setDescription(project.description || "");
    setGithubLink(project.githubLink || "");
    setWebsiteLink(project.websiteLink || "");
    setVideoLink(project.videoLink || "");
    setTechnologies(project.technologies && project.technologies.length > 0 
      ? project.technologies 
      : [""]);
    setEditId(project.id);
    
    // Scroll to form
    document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Delete project
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        showMessage("Project deleted successfully!", "success");
      } catch (err) {
        showMessage("Failed to delete project: " + err.message, "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="manage-projects-wrapper">
        <canvas id="bgCanvas" className="bg-canvas"></canvas>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-projects-wrapper">
      <canvas id="bgCanvas" className="bg-canvas"></canvas>

      <div className="manage-projects">
        <h2>Manage Projects</h2>

        {/* Form Section */}
        <div className="form-section">
          <div className="form-card">
            <h3>{editId ? "Edit Project" : "Add New Project"}</h3>
            
            <div className="form-group">
              <input
                placeholder="Project Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              
              <textarea
                placeholder="Project Description *"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="dynamic-fields">
                <label>Technologies</label>
                <div className="technology-list">
                  {technologies.map((tech, index) => (
                    <div key={index} className="tech-field">
                      <input
                        placeholder={`Technology ${index + 1}`}
                        value={tech}
                        onChange={(e) => updateTechnology(index, e.target.value)}
                      />
                      {technologies.length > 1 && (
                        <button 
                          type="button"
                          className="remove-tech-btn"
                          onClick={() => removeTechnology(index)}
                          aria-label="Remove technology"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  className="add-tech-btn"
                  onClick={addTechnologyField}
                >
                  <FaPlus /> Add Technology
                </button>
              </div>

              <div className="link-fields">
                <div className="link-field">
                  <FaCode className="link-icon" />
                  <input
                    placeholder="GitHub Repository URL"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                  />
                </div>

                <div className="link-field">
                  <FaLink className="link-icon" />
                  <input
                    placeholder="Live Website URL"
                    value={websiteLink}
                    onChange={(e) => setWebsiteLink(e.target.value)}
                  />
                </div>

                <div className="link-field">
                  <FaVideo className="link-icon" />
                  <input
                    placeholder="Demo Video URL"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                onClick={handleSave} 
                className="save-btn"
                disabled={!title.trim() || !description.trim()}
              >
                {editId ? (
                  <>
                    <FaEdit /> Update Project
                  </>
                ) : (
                  <>
                    <FaPlus /> Add Project
                  </>
                )}
              </button>
              
              {editId && (
                <button 
                  onClick={() => {
                    setEditId(null);
                    setTitle("");
                    setDescription("");
                    setGithubLink("");
                    setWebsiteLink("");
                    setVideoLink("");
                    setTechnologies([""]);
                  }}
                  className="cancel-btn"
                >
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="projects-section">
          <h3>Your Projects ({projects.length})</h3>
          
          {projects.length === 0 ? (
            <div className="no-projects">
              <p>No projects yet. Add your first project using the form above!</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="project-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="project-header">
                    <h4>{project.title}</h4>
                    <div className="project-actions">
                      <button 
                        onClick={() => handleEdit(project)}
                        className="edit-btn"
                        aria-label="Edit project"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="delete-btn"
                        aria-label="Delete project"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <p className="project-description">{project.description}</p>
                  
                  {/* Project Links */}
                  <div className="project-links">
                    {project.githubLink && (
                      <a 
                        href={project.githubLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-link github-link"
                      >
                        <FaCode /> GitHub
                      </a>
                    )}
                    {project.websiteLink && (
                      <a 
                        href={project.websiteLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-link website-link"
                      >
                        <FaLink /> Live Demo
                      </a>
                    )}
                    {project.videoLink && (
                      <a 
                        href={project.videoLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-link video-link"
                      >
                        <FaVideo /> Demo Video
                      </a>
                    )}
                  </div>
                  
                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="project-tech">
                      <span className="tech-label">Technologies:</span>
                      <div className="tech-tags">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
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

export default ManageProjects;