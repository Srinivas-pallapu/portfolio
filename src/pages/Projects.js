import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { FaGithub, FaExternalLinkAlt, FaYoutube, FaCode } from "react-icons/fa";
import "../styles/maincss/projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // Ensure arrays are properly formatted
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

  if (loading) {
    return (
      <div className="projects-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="projects-container">
        {/* Header */}
        <div className="projects-header">
          <h1>My Projects</h1>
          <p>A showcase of my recent work, featuring web applications, and creative solutions.</p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="no-projects">
            <h2>No projects added yet</h2>
            <p>Projects will appear here once they are added from the admin panel.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={project.id} className="project-card">
                {/* Project Image/Video Preview */}
                <div className="project-image">
                  {/* You can add a default image or use project.imageUrl if available */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(45deg, rgba(100, 255, 218, 0.1), rgba(100, 255, 218, 0.05))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--teal)',
                    fontSize: '3rem'
                  }}>
                    <FaCode />
                  </div>
                  
                  {/* Hover Overlay with Links */}
                  <div className="project-overlay">
                    <div className="overlay-links">
                      {project.websiteLink && (
                        <a 
                          href={project.websiteLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="overlay-link"
                        >
                          <FaExternalLinkAlt /> Visit Site
                        </a>
                      )}
                      {project.githubLink && (
                        <a 
                          href={project.githubLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="overlay-link"
                        >
                          <FaGithub /> Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="project-content">
                  <h3 className="project-title">{project.title || "Project Title"}</h3>
                  
                  <p className="project-description">
                    {project.description || "No description available."}
                  </p>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="project-technologies">
                      {project.technologies.slice(0, 5).map((tech, idx) => (
                        <span key={idx} className="tech-tag">{tech}</span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="tech-tag">+{project.technologies.length - 5} more</span>
                      )}
                    </div>
                  )}

                  {/* Project Links */}
                  <div className="project-links">
                    {project.websiteLink && (
                      <a 
                        href={project.websiteLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="project-link link-primary"
                      >
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    )}
                    
                    {project.githubLink ? (
                      <a 
                        href={project.githubLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="project-link link-secondary"
                      >
                        <FaGithub /> GitHub
                      </a>
                    ) : project.videoLink && (
                      <a 
                        href={project.videoLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="project-link link-secondary"
                      >
                        <FaYoutube /> Demo Video
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;