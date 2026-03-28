import React from "react";
import "../styles/maincss/projects.css";

function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>Category: {project.category}</p>
      <a href={project.github} target="_blank" rel="noreferrer">GitHub</a> | 
      <a href={project.demo} target="_blank" rel="noreferrer">Live Demo</a>
    </div>
  );
}

export default ProjectCard;
