import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { 
  FaBriefcase, 
  FaAward, 
  FaArrowRight,
  FaLaptopCode,
  FaUniversity
} from "react-icons/fa";
import styles from "../styles/maincss/about.module.css";

function About() {
  const [aboutData, setAboutData] = useState({
    name: "",
    title: "",
    description: "",
    email: "",
    phone: "",
    location: "",
    experienceYears: "",
    totalprojects: "",
    experiencedescription: "",
    currentrole: "",
    education: "",
    university: "",
    graduationYear: "",
    degree: "",
    achievements: "",
  });

  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAbout = async () => {
    try {
      const aboutRef = doc(db, "about", "info");
      const snapshot = await getDoc(aboutRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAboutData({
          name: data.name || "",
          title: data.title || "",
          description: data.description || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          experienceYears: data.experienceYears || "",
          totalprojects: data.totalprojects || "",
          experiencedescription: data.experiencedescription || "",
          currentrole: data.currentrole || "",
          education: data.education || "",
          university: data.university || "",
          graduationYear: data.graduationYear || "",
          degree: data.degree || "",
          achievements: data.achievements || "",
        });
      }
    } catch (error) {
      console.error("Error fetching about info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  if (loading) return (
    <div className={styles.aboutLoadingContainer}>
      <div className={styles.loadingSpinner}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>Loading about information...</p>
    </div>
  );

  const getDisplayName = () => {
    return aboutData.name || "Your Name";
  };

  const getProfessionalTitle = () => {
    if (aboutData.currentrole && aboutData.currentrole.trim() !== "") {
      return aboutData.currentrole;
    }
    if (aboutData.title && aboutData.title.trim() !== "") {
      return aboutData.title;
    }
    return "Professional Developer";
  };

  const getTruncatedDescription = (text, length) => {
    if (!text) return "";
    if (isMobile && text.length > length) {
      return text.substring(0, length) + "...";
    }
    return text;
  };

  return (
    <div className={`${styles.aboutPageContainer} ${isMobile ? styles.mobileVersion : styles.desktopVersion}`}>
     
      {/* Hero Section with Name, Title, and Description */}
      <section className={styles.aboutHeroSection}>
        <div className={styles.aboutHeroContent}>
          <h1 className={styles.aboutNameHeading}>{getDisplayName()}</h1>
          <h2 className={styles.aboutTitleHeading}>{getProfessionalTitle()}</h2>
          <p className={styles.aboutIntroText}>
            {getTruncatedDescription(aboutData.description || "Passionate developer with expertise in modern web technologies.", isMobile ? 150 : 300)}
          </p>
        </div>
      </section>

      {/* About Me */}
      <section className={styles.aboutMeSection}>
        <div className={styles.aboutSectionContainer}>
          <div className={styles.aboutSectionHeader}>
            <div className={styles.aboutSectionHeaderIcon}>
              <FaLaptopCode />
            </div>
            <h2>{isMobile ? "About" : "About Me"}</h2>
          </div>
          
          <div className={styles.aboutMeContent}>
            <p className={styles.aboutParagraph}>
              {getTruncatedDescription(aboutData.description || "I am a passionate developer with expertise in modern web technologies. I enjoy creating beautiful, functional, and user-friendly applications that solve real-world problems.", isMobile ? 200 : 500)}
            </p>
            
            {aboutData.experiencedescription && aboutData.experiencedescription !== aboutData.description && (
              <p className={styles.aboutParagraph}>
                {getTruncatedDescription(aboutData.experiencedescription, isMobile ? 200 : 500)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Professional Experience - Improved Layout */}
      <section className={styles.aboutExperienceSection}>
        <div className={styles.aboutSectionContainer}>
          <div className={styles.aboutSectionHeader}>
            <div className={styles.aboutSectionHeaderIcon}>
              <FaBriefcase />
            </div>
            <h2>{isMobile ? "Experience" : "Professional Experience"}</h2>
          </div>
          
          {/* Improved Experience Cards Layout */}
          <div className={styles.aboutExperienceStats}>
            <div className={styles.aboutStatItem}>
              <div className={styles.aboutStatNumber}>{aboutData.totalprojects || "0+"}</div>
              <div className={styles.aboutStatLabel}>{isMobile ? "Projects" : "Projects Completed"}</div>
              <div className={styles.aboutStatIcon}>📊</div>
            </div>
            <div className={styles.aboutStatItem}>
              <div className={styles.aboutStatNumber}>
                {isMobile ? aboutData.currentrole?.substring(0, 15) || "Developer" : aboutData.currentrole || "Developer"}
              </div>
              <div className={styles.aboutStatLabel}>{isMobile ? "Role" : "Current Role"}</div>
              <div className={styles.aboutStatIcon}>💼</div>
            </div>
            {!isMobile && aboutData.experienceYears && (
              <div className={styles.aboutStatItem}>
                <div className={styles.aboutStatNumber}>{aboutData.experienceYears}+</div>
                <div className={styles.aboutStatLabel}>Years Experience</div>
                <div className={styles.aboutStatIcon}>⭐</div>
              </div>
            )}
          </div>
          
          <div className={styles.aboutExperienceDescription}>
            <p>{getTruncatedDescription(aboutData.experiencedescription || "Experience details will appear here.", isMobile ? 150 : 300)}</p>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className={styles.aboutEducationSection}>
        <div className={styles.aboutSectionContainer}>
          <div className={styles.aboutSectionHeader}>
            <div className={styles.aboutSectionHeaderIcon}>
              <FaUniversity />
            </div>
            <h2>{isMobile ? "Education" : "Education Background"}</h2>
          </div>
          
          <div className={styles.aboutEducationContent}>
            <div className={styles.aboutEducationItem}>
              <div className={styles.aboutEducationDegree}>
                {aboutData.degree || "Degree"}
              </div>
              <div className={styles.aboutEducationUniversity}>
                {aboutData.university || "University"}
              </div>
              {aboutData.graduationYear && (
                <div className={styles.aboutEducationYear}>
                  {aboutData.graduationYear}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements & Awards */}
      <section className={styles.aboutAchievementsSection}>
        <div className={styles.aboutSectionContainer}>
          <div className={styles.aboutSectionHeader}>
            <div className={styles.aboutSectionHeaderIcon}>
              <FaAward />
            </div>
            <h2>{isMobile ? "Achievements" : "Achievements & Awards"}</h2>
          </div>
          
          <div className={styles.aboutAchievementsList}>
            {aboutData.achievements ? (
              aboutData.achievements.split('\n').map((achievement, index) => (
                achievement.trim() && (
                  <div key={index} className={styles.aboutAchievementItem}>
                    <div className={styles.aboutAchievementBullet}>
                      <FaArrowRight />
                    </div>
                    <p className={styles.aboutAchievementText}>
                      {getTruncatedDescription(achievement, isMobile ? 100 : 200)}
                    </p>
                  </div>
                )
              ))
            ) : (
              <p className={styles.aboutParagraph}>Achievements and awards will appear here.</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA - Primary Contact Section */}
      <section className={styles.aboutCtaSection}>
        <div className={styles.aboutSectionContainer}>
          <div className={styles.aboutCtaContent}>
            <h2 className={styles.aboutCtaTitle}>
              {isMobile ? "Let's Connect" : "Let's Work Together"}
            </h2>
            <p className={styles.aboutCtaText}>
              {isMobile 
                ? "Interested in collaborating? Get in touch."
                : "Interested in collaborating or discussing opportunities? I'd love to hear from you."}
            </p>
            <a href={`mailto:${aboutData.email}`} className={styles.aboutCtaButton}>
              {isMobile ? "Contact Me" : "Get In Touch"} 
              <FaArrowRight className={styles.aboutButtonIcon} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;