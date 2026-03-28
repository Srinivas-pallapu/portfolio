import React from "react";
import "../styles/maincss/skills.css";

function SkillBar({ name, level }) {
  return (
    <div className="skill-bar-container">
      <span>{name}</span>
      <div className="skill-bar">
        <div className="skill-fill" style={{ width: `${level}%` }}></div>
      </div>
    </div>
  );
}

export default SkillBar;
