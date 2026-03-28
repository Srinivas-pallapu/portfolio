import React, { useState, useEffect, useCallback } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import "../styles/admincss/manageabout.css";

function ManageAbout() {
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
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Parse achievements for preview
  const parseAchievements = useCallback((achievements) => {
    if (!achievements) return [];
    return achievements
      .split(/[•,，、\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .slice(0, 3);
  }, []);

  // Fetch About info from Firestore
  const fetchAbout = useCallback(async () => {
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
      alert("Failed to load about data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAboutData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save updated info to Firestore
  const handleSave = async () => {
    if (!aboutData.name || !aboutData.description) {
      alert("Please fill in at least Name and Description fields");
      return;
    }
    
    setSaving(true);
    try {
      const aboutRef = doc(db, "about", "info");
      await setDoc(aboutRef, aboutData);
      alert("✅ About section updated successfully!");
    } catch (error) {
      console.error("Error saving about info:", error);
      alert("❌ Failed to update About section");
    } finally {
      setSaving(false);
    }
  };

  // Get achievements for preview
  const achievements = parseAchievements(aboutData.achievements);

  if (loading) return (
    <div className="manage-about-container loading-container">
      <div className="loading-spinner"></div>
      <p>Loading About Data...</p>
    </div>
  );

  return (
    <div className="manage-about-container">
      <h2>{isMobile ? "📝 Manage About" : "📝 Manage About Page"}</h2>
      <p className="admin-subtitle">
        Edit your personal and professional information. These fields are used in both About and Home pages.
      </p>
      
      <div className="admin-grid">
        {/* Personal Information Section */}
        <div className="admin-section personal-info-section">
          <div className="section-header">
            <h3>{isMobile ? "👤 Personal Info" : "👤 Personal Information"}</h3>
            <p className="section-subtitle">Used in Home page hero section and About page</p>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={aboutData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                aria-label="Full Name"
              />
              <small className="field-hint">Shown in hero and about sections</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="title">Professional Title</label>
              <input
                id="title"
                type="text"
                name="title"
                value={aboutData.title}
                onChange={handleChange}
                placeholder="Full Stack Developer"
                aria-label="Professional Title"
              />
              <small className="field-hint">Fallback for hero section title</small>
            </div>

            <div className="form-group">
              <label htmlFor="currentrole">Current Role</label>
              <input
                id="currentrole"
                type="text"
                name="currentrole"
                value={aboutData.currentrole}
                onChange={handleChange}
                placeholder="Senior Developer"
                aria-label="Current Role"
              />
              <small className="field-hint">Primary role in hero section</small>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="description">Description/Bio *</label>
              <textarea
                id="description"
                name="description"
                rows={isMobile ? 3 : 4}
                value={aboutData.description}
                onChange={handleChange}
                placeholder="Write a brief description about yourself..."
                required
                aria-label="Description or Bio"
              />
              <small className="field-hint">Main bio shown on both pages</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={aboutData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                aria-label="Email Address"
              />
              <small className="field-hint">For contact information</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="text"
                name="phone"
                value={aboutData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                aria-label="Phone Number"
              />
              <small className="field-hint">For contact information</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                name="location"
                value={aboutData.location}
                onChange={handleChange}
                placeholder="New York, USA"
                aria-label="Location"
              />
              <small className="field-hint">Displayed in about section</small>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="admin-section experience-section">
          <div className="section-header">
            <h3>💼 Experience</h3>
            <p className="section-subtitle">Used in home page about section stats</p>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="experienceYears">Years of Experience</label>
              <input
                id="experienceYears"
                type="text"
                name="experienceYears"
                value={aboutData.experienceYears}
                onChange={handleChange}
                placeholder="e.g., 3+ Years"
                aria-label="Years of Experience"
              />
              <small className="field-hint">Shown as a stat in home page</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="totalprojects">Total Projects</label>
              <input
                id="totalprojects"
                type="text"
                name="totalprojects"
                value={aboutData.totalprojects}
                onChange={handleChange}
                placeholder="e.g., 20+ Projects"
                aria-label="Total Projects"
              />
              <small className="field-hint">Shown as a stat in home page</small>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="experiencedescription">Experience Description</label>
              <textarea
                id="experiencedescription"
                name="experiencedescription"
                rows={isMobile ? 2 : 3}
                value={aboutData.experiencedescription}
                onChange={handleChange}
                placeholder="Describe your experience..."
                aria-label="Experience Description"
              />
              <small className="field-hint">Shown in home page about section</small>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="admin-section education-section">
          <div className="section-header">
            <h3>🎓 Education</h3>
            <p className="section-subtitle">Displayed in home page about section</p>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="degree">Degree</label>
              <input
                id="degree"
                type="text"
                name="degree"
                value={aboutData.degree}
                onChange={handleChange}
                placeholder="Bachelor of Technology"
                aria-label="Degree"
              />
              <small className="field-hint">Shown in education card</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="university">University/College</label>
              <input
                id="university"
                type="text"
                name="university"
                value={aboutData.university}
                onChange={handleChange}
                placeholder="MIT University"
                aria-label="University or College"
              />
              <small className="field-hint">Shown in education card</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="graduationYear">Graduation Year</label>
              <input
                id="graduationYear"
                type="text"
                name="graduationYear"
                value={aboutData.graduationYear}
                onChange={handleChange}
                placeholder="2020"
                aria-label="Graduation Year"
              />
              <small className="field-hint">Shown in education card</small>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="education">Education Details</label>
              <textarea
                id="education"
                name="education"
                rows={isMobile ? 2 : 3}
                value={aboutData.education}
                onChange={handleChange}
                placeholder="Additional education details..."
                aria-label="Education Details"
              />
              <small className="field-hint">Additional education information</small>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="admin-section achievements-section">
          <div className="section-header">
            <h3>🏆 Achievements</h3>
            <p className="section-subtitle">Displayed as bullet points in home page</p>
          </div>
          
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="achievements">Achievements & Awards</label>
              <textarea
                id="achievements"
                name="achievements"
                rows={isMobile ? 3 : 5}
                value={aboutData.achievements}
                onChange={handleChange}
                placeholder="List your achievements, awards, certifications..."
                aria-label="Achievements and Awards"
              />
              <small className="hint-text">
                Format: Each on new line or separated by commas. Max 3 shown on home page.
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="save-container">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="save-button"
          aria-label={saving ? "Saving changes..." : "Save all changes"}
        >
          {saving ? (
            <>
              <span className="spinner"></span>
              {isMobile ? "Saving..." : "Saving Changes..."}
            </>
          ) : (
            isMobile ? "💾 Save All" : "💾 Save All Changes"
          )}
        </button>
        <p className="save-hint">
          Changes will be reflected on both Home and About pages immediately.
        </p>
      </div>

      {/* Home Page Preview - Responsive */}
      <div className="preview-section">
        <div className="preview-header">
          <h3>{isMobile ? "👁️ Preview" : "👁️ Home Preview"}</h3>
          <p className="section-subtitle">How data appears on home page</p>
        </div>
        <div className="preview-container">
          <div className="home-preview">
            <div className="preview-about-section">
              
              {/* Who I Am */}
              <div className="preview-block">
                <h4>👤 Who I Am</h4>
                <p className="preview-description">
                  {aboutData.description?.substring(0, isMobile ? 80 : 120) || "No description provided"}...
                </p>
              </div>

              {/* Experience */}
              {aboutData.experiencedescription && (
                <div className="preview-block">
                  <h4>💼 Experience</h4>
                  <p className="preview-description">
                    {aboutData.experiencedescription.substring(0, isMobile ? 60 : 100)}...
                  </p>
                </div>
              )}

              {/* Stats - Responsive */}
              <div className="preview-block">
                <div className="preview-stats">
                  <div className="preview-stat">
                    <div className="preview-stat-number">{aboutData.experienceYears || "0+"}</div>
                    <div className="preview-stat-label">Years</div>
                  </div>
                  <div className="preview-stat">
                    <div className="preview-stat-number">{aboutData.totalprojects || "0"}</div>
                    <div className="preview-stat-label">Projects</div>
                  </div>
                </div>
              </div>

              {/* Achievements - Responsive */}
              {achievements.length > 0 && (
                <div className="preview-block">
                  <h4>🏆 Achievements</h4>
                  <ul className="preview-achievements">
                    {achievements.slice(0, isMobile ? 1 : 2).map((achievement, index) => (
                      <li key={index}>
                        {achievement.length > (isMobile ? 60 : 80) 
                          ? achievement.substring(0, isMobile ? 60 : 80) + "..." 
                          : achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Education - Compact */}
              {(aboutData.degree || aboutData.university) && (
                <div className="preview-block">
                  <h4>🎓 Education</h4>
                  <div className="preview-description">
                    {aboutData.degree && <span>{aboutData.degree}</span>}
                    {aboutData.university && <span> - {aboutData.university}</span>}
                    {aboutData.graduationYear && <span> ({aboutData.graduationYear})</span>}
                  </div>
                </div>
              )}

              {/* Hero Section Data */}
              <div className="preview-block hero-preview">
                <h4>🚀 Hero Section</h4>
                <p><strong>Name:</strong> {aboutData.name}</p>
                <p><strong>Role:</strong> {aboutData.currentrole || aboutData.title}</p>
                <p><strong>Bio:</strong> {aboutData.description?.substring(0, isMobile ? 60 : 80)}...</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageAbout;