import React from "react";
import styles from "../styles/maincss/about.module.css"; // Import the same CSS Module

function AboutCard({ text, education = [], achievements = [] }) {
  return (
    <div className={styles.aboutCard}>
      {/* About Text */}
      <div className={styles.aboutText}>
        <p className={styles.aboutParagraph}>{text}</p>
      </div>

      {/* Education */}
      {education.length > 0 && (
        <div className={styles.aboutEducation}>
          <h3 className={styles.aboutEducationTitle}>Education</h3>
          <ul className={styles.aboutEducationList}>
            {education.map((edu, index) => (
              <li key={index} className={styles.aboutEducationItem}>
                <strong className={styles.educationDegree}>{edu.degree}</strong>
                {edu.institution && <span className={styles.educationInstitution}>, {edu.institution}</span>}
                {edu.year && <span className={styles.educationYear}> ({edu.year})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className={styles.aboutAchievements}>
          <h3 className={styles.aboutAchievementsTitle}>Achievements</h3>
          <ul className={styles.aboutAchievementsList}>
            {achievements.map((ach, index) => (
              <li key={index} className={styles.aboutAchievementItem}>{ach}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AboutCard;