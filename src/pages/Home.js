import React, { useState, useEffect } from "react";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaDownload,
  FaArrowRight,
  FaStar,
  FaExternalLinkAlt,
  FaEye,
  FaCode,
  FaFolderOpen,
  FaCodeBranch,
} from "react-icons/fa";
import "../styles/maincss/home.css";

const skillIcons = {
  'javascript': 'devicon-javascript-plain colored',
  'react': 'devicon-react-original colored',
  'python': 'devicon-python-plain colored',
  'nodejs': 'devicon-nodejs-plain colored',
  'html': 'devicon-html5-plain colored',
  'css': 'devicon-css3-plain colored',
  'mongodb': 'devicon-mongodb-plain colored',
  'firebase': 'devicon-firebase-plain colored',
  'git': 'devicon-git-plain colored',
  'github': 'devicon-github-plain colored',
  'typescript': 'devicon-typescript-plain colored',
  'nextjs': 'devicon-nextjs-plain colored',
  'tailwind': 'devicon-tailwindcss-plain colored',
  'redux': 'devicon-redux-original colored',
  'vuejs': 'devicon-vuejs-plain colored',
  'angular': 'devicon-angularjs-plain colored',
  'sass': 'devicon-sass-original colored',
  'docker': 'devicon-docker-plain colored',
  'aws': 'devicon-amazonwebservices-plain colored',
  'default': 'devicon-devicon-plain'
};

function Home() {
  const [homeData, setHomeData] = useState({
    name: "",
    bio: "",
    socials: {
      github: "",
      linkedin: "",
      twitter: "",
      leetcode: ""
    },
    photoURL: "",
    resumeURL: "",
  });

  const [aboutData, setAboutData] = useState({
    name: "",
    title: "",
    description: "",
    currentrole: "",
    education: "",
    university: "",
    graduationYear: "",
    degree: "",
  });

  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState({
    home: true,
    about: true,
    skills: true,
    projects: true
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getSkillIcon = (skillName) => {
    if (!skillName) return skillIcons.default;
    const lower = skillName.toLowerCase().trim();
    return skillIcons[lower] || skillIcons.default;
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const homeDocRef = doc(db, "home", "main");
        const docSnap = await getDoc(homeDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHomeData({
            name: data.name || "Srinivas",
            bio: data.bio || "Full Stack Developer",
            socials: data.socials || {
              github: "",
              linkedin: "",
              twitter: "",
              leetcode: ""
            },
            photoURL: data.photoURL || "/images/profile.jpg",
            resumeURL: data.resumeURL || "/resume/MyResume.pdf",
          });
        }
      } catch (err) {
        console.error("Error fetching Home data:", err);
      } finally {
        setLoading(prev => ({ ...prev, home: false }));
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const aboutDocRef = doc(db, "about", "info");
        const docSnap = await getDoc(aboutDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAboutData({
            name: data.name || "",
            title: data.title || "",
            description: data.description || "",
            currentrole: data.currentrole || "",
            education: data.education || "",
            university: data.university || "",
            graduationYear: data.graduationYear || "",
            degree: data.degree || "",
          });
        }
      } catch (err) {
        console.error("Error fetching About data:", err);
      } finally {
        setLoading(prev => ({ ...prev, about: false }));
      }
    };

    fetchAboutData();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "skills"), (snapshot) => {
      const skillsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        icon: getSkillIcon(doc.data().name),
        percentage: doc.data().percentage || 50
      }));

      const sortedSkills = skillsData.sort((a, b) => {
        const aPercentage = a.percentage || 0;
        const bPercentage = b.percentage || 0;

        if (bPercentage !== aPercentage) {
          return bPercentage - aPercentage;
        }

        return a.name.localeCompare(b.name);
      });

      // Show 6 skills in a single horizontal line
      setSkills(sortedSkills.slice(0, 6));
      setLoading(prev => ({ ...prev, skills: false }));
    }, (error) => {
      console.error("Error loading skills:", error);
      setLoading(prev => ({ ...prev, skills: false }));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        technologies: Array.isArray(doc.data().technologies)
          ? doc.data().technologies
          : doc.data().technologies?.split(',').map(t => t.trim()) || []
      }));

      const sortedProjects = projectsData.sort((a, b) => {
        if (a.dateAdded && b.dateAdded) {
          return b.dateAdded.localeCompare(a.dateAdded);
        }
        return (a.title || "").localeCompare(b.title || "");
      });

      // Show 3 projects on desktop, NONE on mobile (just button)
      setProjects(isMobile ? [] : sortedProjects.slice(0, 3));
      setLoading(prev => ({ ...prev, projects: false }));
    }, (error) => {
      console.error("Error loading projects:", error);
      setLoading(prev => ({ ...prev, projects: false }));
    });

    return () => unsubscribe();
  }, [isMobile]);

  const renderSkillStars = (skill) => {
    const percentage = skill.percentage || 50;
    let stars;

    if (percentage >= 90) {
      stars = 4;
    } else if (percentage >= 75) {
      stars = 3;
    } else if (percentage >= 50) {
      stars = 2;
    } else {
      stars = 1;
    }

    return (
      <div className="home-skill-level">
        <div className="home-star-container">
          {[...Array(4)].map((_, i) => (
            <FaStar
              key={i}
              className={i < stars ? "home-star-filled" : "home-star-empty"}
              size={isMobile ? 12 : 14}
            />
          ))}
        </div>
        <span className="home-level-text">
          {percentage >= 90 ? "Expert" :
            percentage >= 75 ? "Advanced" :
              percentage >= 50 ? "Intermediate" : "Beginner"}
        </span>
      </div>
    );
  };

  const getDisplayName = () => {
    return homeData.name || aboutData.name || "Srinivas";
  };

  const getProfessionalTitle = () => {
    if (aboutData.currentrole && aboutData.currentrole.trim() !== "") {
      return aboutData.currentrole;
    }
    if (aboutData.title && aboutData.title.trim() !== "") {
      return aboutData.title;
    }
    if (homeData.bio && homeData.bio.trim() !== "") {
      return homeData.bio;
    }
    return "Full Stack Developer";
  };

  const getDisplayDescription = () => {
    if (aboutData.description && aboutData.description.length > 0) {
      // Truncate description on mobile
      if (isMobile && aboutData.description.length > 120) {
        return aboutData.description.substring(0, 120) + "...";
      }
      return aboutData.description;
    }
    return "I build exceptional digital experiences that are fast, accessible, visually appealing, and responsive.";
  };

  // Show loading with bouncing balls animation while home or about data is loading
  if (loading.home || loading.about) {
    return (
      <div className="home-container loading">
        <div className="loading-spinner">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="loading-text">Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className={`hero-content ${isMobile ? 'mobile-layout' : 'desktop-layout'}`}>
          {/* Mobile: Image on top */}
          {isMobile && (
            <div className="hero-image mobile-first">
              <div className="image-container">
                <img
                  src={homeData.photoURL}
                  alt={getDisplayName()}
                  className="profile-image"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          <div className="hero-text">
            <h1 className="hero-greeting">Hello, I'm</h1>
            <h2 className="hero-name">{getDisplayName()}</h2>
            <h3 className="hero-title">{getProfessionalTitle()}</h3>

            <div className="hero-actions">
              <a
                href={homeData.resumeURL}
                download="MyResume.pdf"
                className="btn btn-primary mobile-btn"
              >
                <FaDownload /> {isMobile ? "CV" : "Download CV"}
              </a>
              <Link to="/contact" className="btn btn-outline mobile-btn">
                {isMobile ? "Contact" : "Get In Touch"}
              </Link>
            </div>

            <div className="hero-social">
              {homeData.socials.github && (
                <a href={homeData.socials.github} target="_blank" rel="noreferrer" title="GitHub">
                  <FaGithub />
                </a>
              )}
              {homeData.socials.linkedin && (
                <a href={homeData.socials.linkedin} target="_blank" rel="noreferrer" title="LinkedIn">
                  <FaLinkedin />
                </a>
              )}
              {homeData.socials.twitter && (
                <a href={homeData.socials.twitter} target="_blank" rel="noreferrer" title="Twitter">
                  <FaTwitter />
                </a>
              )}
              {homeData.socials.leetcode && (
                <a href={homeData.socials.leetcode} target="_blank" rel="noreferrer" title="LeetCode">
                  <FaCodeBranch />
                </a>
              )}
            </div>
          </div>

          {/* Desktop: Image on the right */}
          {!isMobile && (
            <div className="hero-image">
              <div className="image-container">
                <img
                  src={homeData.photoURL}
                  alt={getDisplayName()}
                  className="profile-image"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="home-about-section">
        <div className="home-section-header">
          <h2>About Me</h2>
          <p className="home-section-subtitle"></p>
        </div>

        <div className="about-paragraph-container">
          <h3 className="about-paragraph-title">
            Hi, I'm {getDisplayName()}
          </h3>

          <div className="about-paragraph-content">
            <p>{getDisplayDescription()}</p>

            {(aboutData.degree || aboutData.education || aboutData.university) && !isMobile && (
              <p className="education-text">
                Academically, I hold {
                  aboutData.degree ? `a ${aboutData.degree}` :
                    aboutData.education ? aboutData.education :
                      "relevant qualifications"
                }
                {aboutData.university ? ` from ${aboutData.university}` : ""}
                {aboutData.graduationYear ? `, which I completed in ${aboutData.graduationYear}` : ""}.
                My educational background has provided me with a strong foundation in software development
                principles and problem-solving methodologies.
              </p>
            )}
          </div>
        </div>

        <div className="home-see-more-wrapper">
          <Link to="/about" className="home-see-more-link home-mobile-link">
            <FaFolderOpen /> {isMobile ? "Full Profile" : "View Full Profile"} <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section className="home-skills-section">
        <div className="home-section-header">
          <h2>Top Skills</h2>
          <p className="home-section-subtitle"></p>
        </div>

        <div className="home-skills-grid">
          {loading.skills ? (
            <div className="home-no-skills-message">
              <div className="loading-spinner-small">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Loading skills...</p>
            </div>
          ) : skills.length > 0 ? (
            skills.map((skill) => (
              <div className="home-skill-item" key={skill.id}>
                <div className="home-skill-icon-wrapper">
                  <i className={`${skill.icon} home-skill-icon`}></i>
                </div>
                <span className="home-skill-name">{skill.name}</span>
                {renderSkillStars(skill)}
              </div>
            ))
          ) : (
            <div className="home-no-skills-message">
              <p>No skills found</p>
            </div>
          )}
        </div>

        <div className="home-skills-button-container">
          <Link to="/skills" className="home-technical-skills-button home-mobile-link">
            <FaCode /> {isMobile ? "All Skills" : "Explore All Skills"} <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* PROJECTS SECTION - Modified for mobile */}
      <section className="home-projects-section">
        <div className="home-section-header">
          <h2>Featured Projects</h2>
          <p className="home-section-subtitle"></p>
        </div>

        {/* Only show project cards on desktop */}
        {!isMobile && (
          <div className={`home-projects-grid ${isMobile ? 'home-mobile-grid' : 'home-desktop-grid'}`}>
            {loading.projects ? (
              <div className="home-no-projects-message">
                <div className="loading-spinner-small">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>Loading projects...</p>
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <div className="home-project-card" key={project.id}>
                  <div className="home-project-image">
                    <div className="home-project-image-placeholder">
                      <FaFolderOpen />
                    </div>

                    <div className="home-project-overlay">
                      <div className="home-overlay-links">
                        {project.websiteLink ? (
                          <a
                            href={project.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="home-project-link"
                          >
                            <FaExternalLinkAlt /> Live Demo
                          </a>
                        ) : (
                          <Link to={`/project/${project.id}`} className="home-project-link">
                            <FaEye /> View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="home-project-content">
                    <h3>{project.title || "Project Title"}</h3>
                    <p>
                      {project.description?.substring(0, 120) || "A project showcasing skills in modern web development..."}
                      {project.description && project.description.length > 120 ? '...' : ''}
                    </p>

                    <div className="home-project-tech">
                      {project.technologies && project.technologies.length > 0 ? (
                        project.technologies.slice(0, 4).map((tech, idx) => (
                          <span key={idx} className="home-tech-tag">{tech}</span>
                        ))
                      ) : (
                        <span className="home-tech-tag">Web Dev</span>
                      )}
                      {project.technologies && project.technologies.length > 4 && (
                        <span className="home-tech-tag">+{project.technologies.length - 4} more</span>
                      )}
                    </div>

                    <div className="home-project-buttons">
                      {project.githubLink ? (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-small"
                        >
                          <FaGithub /> Code
                        </a>
                      ) : (
                        <Link to={`/project/${project.id}`} className="btn btn-outline btn-small">
                          <FaEye /> View
                        </Link>
                      )}

                      {project.websiteLink ? (
                        <a
                          href={project.websiteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-small"
                        >
                          <FaExternalLinkAlt /> Demo
                        </a>
                      ) : (
                        <Link to={`/project/${project.id}`} className="btn btn-primary btn-small">
                          Details <FaArrowRight />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="home-no-projects-message">
                <p>No projects available. Check back soon!</p>
              </div>
            )}
          </div>
        )}

        {/* Mobile: Just the button to view all projects */}
        <div className="home-see-more-wrapper">
          <Link to="/projects" className="home-see-more-link home-mobile-link">
            <FaFolderOpen /> {isMobile ? "View All Projects" : "View All Projects"} <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>{isMobile ? "Let's Build Together" : "Let's Build Something Amazing Together"}</h2>
          <p>{isMobile ? "Have a project? I'd love to help bring your ideas to life." : "Have a project in mind? I'd love to hear about it and help bring your ideas to life."}</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-large mobile-btn">
              <FaArrowRight /> {isMobile ? "Start Project" : "Start a Project"}
            </Link>
            <Link to="/about" className="btn btn-outline btn-large mobile-btn">
              {isMobile ? "About Me" : "Learn More About Me"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;