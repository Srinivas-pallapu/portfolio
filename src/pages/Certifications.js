import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import "../styles/maincss/certifications.css";

function Certifications() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  // Helper function to fix Cloudinary PDF URLs
  const fixFileURL = (url) => {
    if (!url) return url;

    // Fix PDF issue in Cloudinary - add fl_attachment for proper download/view
    if (url.toLowerCase().endsWith(".pdf")) {
      // Check if it's a Cloudinary URL
      if (url.includes("res.cloudinary.com")) {
        return url.replace("/upload/", "/upload/fl_attachment/");
      }
    }

    return url;
  };

  // Helper function to get PDF preview URL (Optional bonus feature)
  const getPDFPreviewUrl = (url) => {
    if (!url || !url.toLowerCase().endsWith(".pdf")) return null;
    // Cloudinary auto-generates preview images by replacing .pdf with .jpg
    // Note: This requires the PDF to have been uploaded with image generation enabled
    return url.replace(".pdf", ".jpg");
  };

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = onSnapshot(
        collection(db, "certifications"),
        (snapshot) => {
          const certData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // Sort certifications by date (newest first)
          certData.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : new Date(0);
            const dateB = b.date ? new Date(b.date) : new Date(0);
            return dateB - dateA;
          });
          setCerts(certData);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching certifications:", error);
          setError("Failed to load certifications. Please try again later.");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up listener:", err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get certificate type based on file extension or issuer (UPDATED with case-insensitive check)
  const getCertType = (cert) => {
    const fileUrl = cert.fileURL?.toLowerCase();
    if (fileUrl?.endsWith('.pdf')) return 'PDF Certificate';
    if (fileUrl?.match(/\.(jpg|jpeg|png|gif)$/i)) return 'Image Certificate';
    if (cert.issuer?.toLowerCase().includes('google')) return 'Google Certified';
    if (cert.issuer?.toLowerCase().includes('microsoft')) return 'Microsoft Certified';
    if (cert.issuer?.toLowerCase().includes('aws')) return 'AWS Certified';
    if (cert.issuer?.toLowerCase().includes('coursera')) return 'Coursera Certificate';
    if (cert.issuer?.toLowerCase().includes('udemy')) return 'Udemy Certificate';
    return 'Professional Certification';
  };

  // Filter certificates (UPDATED with case-insensitive checks)
  const filteredCerts = certs.filter(cert => {
    const fileUrl = cert.fileURL?.toLowerCase();
    if (activeFilter === "all") return true;
    if (activeFilter === "pdf") return fileUrl?.endsWith('.pdf');
    if (activeFilter === "image") return fileUrl?.match(/\.(jpg|jpeg|png|gif)$/i);
    if (activeFilter === "recent") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return cert.date && new Date(cert.date) >= oneYearAgo;
    }
    return true;
  });

  // Count certificates by type (UPDATED with case-insensitive checks)
  const countByType = {
    all: certs.length,
    pdf: certs.filter(c => c.fileURL?.toLowerCase().endsWith('.pdf')).length,
    image: certs.filter(c => c.fileURL?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i)).length,
    recent: certs.filter(c => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return c.date && new Date(c.date) >= oneYearAgo;
    }).length,
  };

  // Loading component
  if (loading) {
    return (
      <div className="certifications-page certifications-loading">
        <div className="spinner"></div>
        <p>Loading certifications...</p>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="certifications-page">
        <h2>Certifications</h2>
        <div className="certifications-list">
          <div className="error-card">
            <h3>⚠️ Error Loading Certifications</h3>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="certifications-page">
      <div className="certifications-header">
        <h2>Certifications</h2>
        <p className="certifications-subtitle">
          Professional certifications and achievements demonstrating expertise and continuous learning
        </p>
        
        {/* Stats Section */}
        {certs.length > 0 && (
          <div className="certifications-stats">
            <span className="stat-item">
              <strong>{certs.length}</strong> Total
            </span>
            <span className="stat-item">
              <strong>{countByType.recent}</strong> Recent
            </span>
            <span className="stat-item">
              <strong>{countByType.pdf}</strong> PDF
            </span>
          </div>
        )}

        {/* Filter Controls - Desktop */}
        {!isMobile && certs.length > 0 && (
          <div className="certifications-filters">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All ({countByType.all})
              </button>
              <button 
                className={`filter-btn ${activeFilter === "recent" ? "active" : ""}`}
                onClick={() => setActiveFilter("recent")}
              >
                Recent ({countByType.recent})
              </button>
              <button 
                className={`filter-btn ${activeFilter === "pdf" ? "active" : ""}`}
                onClick={() => setActiveFilter("pdf")}
              >
                PDF ({countByType.pdf})
              </button>
              <button 
                className={`filter-btn ${activeFilter === "image" ? "active" : ""}`}
                onClick={() => setActiveFilter("image")}
              >
                Images ({countByType.image})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Controls - Mobile */}
      {isMobile && certs.length > 0 && (
        <div className="mobile-filters">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button 
              className={`filter-btn ${activeFilter === "recent" ? "active" : ""}`}
              onClick={() => setActiveFilter("recent")}
            >
              Recent
            </button>
            <button 
              className={`filter-btn ${activeFilter === "pdf" ? "active" : ""}`}
              onClick={() => setActiveFilter("pdf")}
            >
              PDF
            </button>
          </div>
        </div>
      )}

      <div className="certifications-list">
        {filteredCerts.length > 0 ? (
          filteredCerts.map((cert, index) => {
            const fileUrl = cert.fileURL?.toLowerCase();
            const isPDF = fileUrl?.endsWith('.pdf');
            
            return (
              <div 
                key={cert.id} 
                className="cert-card"
                data-cert-type={getCertType(cert)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Certificate Badge */}
                <div className="cert-badge">
                  <span className="cert-number">{index + 1}</span>
                  <span className="cert-type">{getCertType(cert)}</span>
                </div>

                <h3>{cert.title}</h3>
                
                <div className="cert-details">
                  <p className="cert-issuer">
                    <strong>Issuer:</strong> {cert.issuer}
                  </p>
                  
                  <p className="cert-date">
                    <strong>Date:</strong> {formatDate(cert.date)}
                  </p>

                  {cert.description && (
                    <p className="cert-description">
                      <strong>Description:</strong> {cert.description}
                    </p>
                  )}

                  {cert.credentialId && (
                    <p className="cert-id">
                      <strong>Credential ID:</strong> {cert.credentialId}
                    </p>
                  )}
                </div>

                {cert.fileURL ? (
                  isPDF ? (
                    <>
                      {/* BONUS: PDF Preview Image (Optional) */}
                      {getPDFPreviewUrl(cert.fileURL) && (
                        <div className="pdf-preview-container">
                          <img 
                            src={getPDFPreviewUrl(cert.fileURL)}
                            alt={`${cert.title} preview`}
                            className="pdf-preview"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className={`cert-actions ${isMobile ? "mobile-actions" : ""}`}>
                        <a 
                          href={fixFileURL(cert.fileURL)} // FIXED: Using fixFileURL
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="cert-link"
                        >
                          <span className="link-icon">📄</span>
                          <span className="link-text">
                            {isMobile ? 'View PDF' : (cert.fileName || 'View PDF Certificate')}
                          </span>
                          <span className="link-arrow">→</span>
                        </a>
                        {!isMobile && (
                          <button 
                            className="cert-download"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = fixFileURL(cert.fileURL); // FIXED: Using fixFileURL
                              link.download = cert.fileName || `${cert.title}.pdf`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            aria-label={`Download ${cert.title}`}
                          >
                            ⬇️ Download
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="cert-image-container">
                      <img 
                        src={cert.fileURL} 
                        alt={cert.title} 
                        className="cert-image"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x300?text=Certificate+Image+Not+Available";
                        }}
                      />
                      <div className="image-overlay">
                        <button 
                          className="view-fullscreen"
                          onClick={() => window.open(cert.fileURL, '_blank')}
                          aria-label="View full screen"
                        >
                          🔍 View Full Size
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="no-file">No file available for preview</p>
                )}

                {/* Mobile-only quick actions */}
                {isMobile && cert.fileURL && (
                  <div className="mobile-quick-actions">
                    <button 
                      className="mobile-action-btn share-btn"
                      onClick={() => {
                        const shareUrl = isPDF ? fixFileURL(cert.fileURL) : cert.fileURL; // FIXED: Using fixFileURL for PDFs
                        if (navigator.share) {
                          navigator.share({
                            title: cert.title,
                            text: `Check out my ${cert.title} certification`,
                            url: shareUrl,
                          });
                        } else {
                          // Fallback for desktop browsers
                          navigator.clipboard.writeText(shareUrl)
                            .then(() => alert("Link copied to clipboard!"))
                            .catch(() => alert("Failed to copy link"));
                        }
                      }}
                    >
                      📤 Share
                    </button>
                    {!isPDF && (
                      <button 
                        className="mobile-action-btn save-btn"
                        onClick={() => {
                          // Simple download trigger for images
                          const link = document.createElement('a');
                          link.href = cert.fileURL;
                          link.download = cert.fileName || `${cert.title}.${cert.fileURL.split('.').pop()}`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        💾 Save
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-certs-message">
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>
                {certs.length > 0 
                  ? `No certifications match the "${activeFilter}" filter`
                  : "No Certifications Yet"
                }
              </h3>
              <p>
                {certs.length > 0 
                  ? "Try selecting a different filter or clear the current filter."
                  : "Certifications will appear here once they're added to the database."
                }
              </p>
              {certs.length > 0 && activeFilter !== "all" && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => setActiveFilter("all")}
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls and Info - Desktop */}
      {!isMobile && filteredCerts.length > 0 && (
        <div className="certifications-controls">
          <div className="controls-info">
            Showing {filteredCerts.length} of {certs.length} certifications
            {activeFilter !== "all" && ` • Filtered by: ${activeFilter}`}
          </div>
        </div>
      )}

      {/* Mobile floating action button */}
      {isMobile && certs.length > 0 && (
        <button 
          className="mobile-fab"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default Certifications;