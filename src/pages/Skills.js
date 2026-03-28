import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/maincss/skills.css";

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
  'typescript': 'devicon-typescript-plain',
  'sass': 'devicon-sass-original',
  'bootstrap': 'devicon-bootstrap-plain',
  'tailwind': 'devicon-tailwindcss-plain',
  'express': 'devicon-express-original',
  'wordpress': 'devicon-wordpress-plain',
  'video editing': 'fas fa-video',
  'game editing': 'fas fa-gamepad',
  'social media': 'fas fa-share-alt',
  'default': 'fas fa-code'
};

// Helper function to get star rating from percentage
const getStarRating = (percentage) => {
  const stars = Math.round((percentage / 100) * 5 * 2) / 2;
  const fullStars = Math.floor(stars);
  const halfStar = stars % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let level = 'Novice';
  let levelClass = 'level-novice';
  
  if (percentage >= 90) {
    level = 'Expert';
    levelClass = 'level-expert';
  } else if (percentage >= 70) {
    level = 'Advanced';
    levelClass = 'level-advanced';
  } else if (percentage >= 50) {
    level = 'Intermediate';
    levelClass = 'level-intermediate';
  } else if (percentage >= 30) {
    level = 'Beginner';
    levelClass = 'level-beginner';
  }
  
  return {
    fullStars,
    halfStar,
    emptyStars,
    level,
    levelClass
  };
};

function Skills() {
  const [skills, setSkills] = useState([]);
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

  // Load all skills from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "skills"), (snapshot) => {
      const skillsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        icon: getSkillIcon(doc.data().name),
        percentage: doc.data().percentage || 50
      }));
      
      setSkills(skillsData);
      setLoading(false);
    }, (error) => {
      console.error("Error loading skills:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="skills-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="skills-page">
      <div className="skills-container">
        <div className="skills-header">
          <Link to="/" className="back-btn">
            <FaArrowLeft />
            <span>Back to Home</span>
          </Link>
          <h1>Skill Set</h1>
          <p>My technical skills and proficiency levels</p>
        </div>

        {skills.length === 0 ? (
          <div className="no-skills">
            <h2>No skills added yet</h2>
            <p>Skills will appear here once they are added from the admin panel.</p>
            <Link to="/" className="see-more-btn">
              Return to Home
            </Link>
          </div>
        ) : (
          <div className="skills-grid-six-columns">
            {skills.map((skill, index) => {
              const rating = getStarRating(skill.percentage);
              
              return (
                <div 
                  key={skill.id} 
                  className="skill-card-six"
                  style={{ '--index': index }}
                >
                  <div className="skill-icon-six">
                    <i className={skill.icon}></i>
                  </div>
                  
                  <h3 className="skill-name-six">{skill.name}</h3>
                  
                  {/* Star Rating */}
                  <div className="star-rating-container">
                    {/* Full stars */}
                    {Array.from({ length: rating.fullStars }).map((_, i) => (
                      <span 
                        key={`full-${i}`} 
                        className="star star-filled"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        ★
                      </span>
                    ))}
                    
                    {/* Half star */}
                    {rating.halfStar && (
                      <span className="star star-half">★</span>
                    )}
                    
                    {/* Empty stars */}
                    {Array.from({ length: rating.emptyStars }).map((_, i) => (
                      <span key={`empty-${i}`} className="star">★</span>
                    ))}
                  </div>
                  
                  {/* Skill Level Badge */}
                  <div className={`skill-level-badge ${rating.levelClass}`}>
                    {rating.level}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Skills CTA */}
        <div className="add-skills-cta">
          <h2>Want to see more skills?</h2>
          <p>I'm constantly learning and adding new technologies to my skill set.</p>
          <Link to="/contact" className="cta-button">
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Skills;