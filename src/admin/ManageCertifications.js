import React, { useState, useEffect, useRef, useCallback } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { initParticles, cleanupParticles } from "../animations/loginParticles";
import "../styles/admincss/managecertification.css";

function ManageCertifications() {
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "", visible: false });
  const [editingId, setEditingId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const fileInputRef = useRef(null);

  const cloudName = "dy9dlvgtw";
  const uploadPreset = "uploaded";

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show message helper
  const showMessage = useCallback((text, type) => {
    setMessage({ text, type, visible: true });
    setTimeout(() => {
      setMessage(prev => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  // Fetch certifications function
  const refreshCertifications = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "certifications"));
      const certs = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      // Sort by creation date, newest first
      certs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setCertifications(certs);
    } catch (error) {
      console.error("Error fetching certifications:", error);
      showMessage("Failed to load certifications", "error");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  // Initialize particles and fetch certifications
  useEffect(() => {
    initParticles("bgCanvas");
    refreshCertifications();
    
    return () => {
      cleanupParticles();
    };
  }, [refreshCertifications]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size for mobile (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        showMessage("File too large. Maximum size is 5MB", "error");
        e.target.value = "";
        return;
      }

      // Check file type
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        showMessage("File type not supported. Please upload images, PDF, or DOC files", "error");
        e.target.value = "";
        return;
      }

      setFile(selectedFile);
      
      // Only create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewURL(url);
      } else {
        setPreviewURL(null);
      }
    }
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    setPreviewURL(null);
    setUploadProgress(0);
  };

  const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      
      xhr.open("POST", url);
      
      // Important for CORS
      xhr.withCredentials = false;
      
      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.response);
            resolve(response);
          } catch (e) {
            reject("Invalid response from server");
          }
        } else {
          let errorMessage = "Upload failed";
          try {
            const error = JSON.parse(xhr.response);
            errorMessage = error.error?.message || errorMessage;
          } catch (e) {
            errorMessage = `Upload failed with status ${xhr.status}`;
          }
          reject(errorMessage);
        }
      };
      
      xhr.onerror = () => {
        if (!navigator.onLine) {
          reject("You are offline. Please check your internet connection.");
        } else {
          reject("Network error occurred. Please try again.");
        }
      };
      
      xhr.ontimeout = () => {
        reject("Upload timed out. Please try again with a smaller file.");
      };
      
      // Set timeout (30 seconds for mobile)
      xhr.timeout = 30000;
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "certifications");
      
      xhr.send(formData);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check online status
    if (!isOnline) {
      showMessage("You are offline. Please check your internet connection.", "error");
      return;
    }
    
    if (!title.trim() || !issuer.trim()) {
      showMessage("Please fill all required fields!", "error");
      return;
    }
    
    setSaving(true);
    setUploadProgress(0);
    
    try {
      let fileURL = null;
      
      // Upload file if selected
      if (file) {
        try {
          const data = await uploadToCloudinary(file);
          fileURL = data.secure_url;
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          showMessage(uploadError.toString(), "error");
          setSaving(false);
          setUploadProgress(0);
          return;
        }
      }

      // Prepare certification data
      const certificationData = {
        title: title.trim(),
        issuer: issuer.trim(),
        updatedAt: new Date().toISOString(),
      };

      if (fileURL) {
        certificationData.fileURL = fileURL;
      }

      // Save to Firestore
      if (editingId) {
        await updateDoc(doc(db, "certifications", editingId), certificationData);
        showMessage("Certification updated successfully!", "success");
      } else {
        certificationData.createdAt = new Date().toISOString();
        await addDoc(collection(db, "certifications"), certificationData);
        showMessage("Certification added successfully!", "success");
      }

      // Reset form and refresh list
      resetForm();
      await refreshCertifications();
    } catch (error) {
      console.error("Error processing certification:", error);
      showMessage(
        "Failed to save certification. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setTitle("");
    setIssuer("");
    clearFileInput();
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      try {
        await deleteDoc(doc(db, "certifications", id));
        showMessage("Certification deleted successfully!", "success");
        await refreshCertifications();
      } catch (error) {
        console.error("Error deleting certification:", error);
        showMessage("Failed to delete certification", "error");
      }
    }
  };

  const handleEdit = (cert) => {
    setTitle(cert.title || "");
    setIssuer(cert.issuer || "");
    setPreviewURL(cert.fileURL || null);
    setEditingId(cert.id);
    // Scroll to form
    document.querySelector('.manage-certifications form')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Stagger animation for list items
  const getAnimationDelay = (index) => {
    return { animationDelay: `${index * 0.1}s` };
  };

  return (
    <div className="manage-certifications-wrapper">
      {/* Background Canvas */}
      <canvas id="bgCanvas" className="bg-canvas"></canvas>

      <div className="manage-certifications">
        {/* Popup Message */}
        {message.visible && (
          <div className={`popup-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <h2>
          {isMobile ? "📜 Manage Certs" : "📜 Manage Certifications"}
        </h2>

        {/* Network Status Warning */}
        {!isOnline && (
          <div className="network-warning" style={{
            background: 'rgba(255, 165, 2, 0.15)',
            color: '#ffa502',
            border: '1px solid rgba(255, 165, 2, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '20px',
            textAlign: 'center',
            backdropFilter: 'blur(8px)'
          }}>
            <span role="img" aria-label="warning">⚠️</span> 
            You are offline. Please check your internet connection.
          </div>
        )}

        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Certification Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Certification Title"
            disabled={saving || !isOnline}
          />
          <input
            type="text"
            placeholder="Issuing Organization *"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            aria-label="Issuing Organization"
            disabled={saving || !isOnline}
          />
          
          {/* File Input with better mobile support */}
          <input 
            type="file" 
            onChange={handleFileChange}
            ref={fileInputRef}
            aria-label="Upload certificate file"
            accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx"
            disabled={saving || !isOnline}
            capture={isMobile ? "environment" : undefined}
          />
          
          {file && (
            <small style={{ color: 'var(--text-muted)', marginTop: '-0.5rem' }}>
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </small>
          )}
          
          {/* Upload Progress Bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="upload-progress" style={{
              width: '100%',
              height: '24px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              margin: '10px 0',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="progress-bar" style={{
                width: `${uploadProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #64ffda, #52d9b8)',
                transition: 'width 0.3s ease',
                borderRadius: '12px'
              }}></div>
              <span style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#000',
                fontSize: '12px',
                fontWeight: 'bold',
                zIndex: 1
              }}>{uploadProgress}%</span>
            </div>
          )}
          
          {/* Preview for images */}
          {previewURL && (
            <div className="preview-container">
              <img 
                src={previewURL} 
                alt="Preview" 
                className="file-preview"
                onLoad={() => URL.revokeObjectURL(previewURL)}
              />
              <small className="preview-hint">
                {isMobile ? "Preview" : "Certificate preview"}
              </small>
            </div>
          )}

          {/* Form Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              type="submit" 
              disabled={saving || !title.trim() || !issuer.trim() || !isOnline}
              aria-label={editingId ? "Update certification" : "Add certification"}
              style={{ flex: editingId ? '1' : '1' }}
            >
              {saving ? (
                <>
                  <span className="spinner"></span>
                  {uploadProgress > 0 
                    ? `${uploadProgress}%` 
                    : isMobile ? "Saving..." : "Processing..."
                  }
                </>
              ) : editingId ? (
                isMobile ? "🔄 Update" : "🔄 Update Certification"
              ) : (
                isMobile ? "➕ Add" : "➕ Add Certification"
              )}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm}
                className="cancel-btn"
                disabled={saving}
                style={{ flex: '1' }}
              >
                {isMobile ? "✖️ Cancel" : "✖️ Cancel Edit"}
              </button>
            )}
          </div>
        </form>

        {/* Existing Certifications */}
        <h3>
          {isMobile ? "📋 Your Certs" : "📋 Existing Certifications"}
          {certifications.length > 0 && (
            <span style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text-muted)', 
              marginLeft: '0.5rem' 
            }}>
              ({certifications.length})
            </span>
          )}
        </h3>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading certifications...</p>
          </div>
        ) : certifications.length === 0 ? (
          <div className="no-certifications">
            <p>No certifications yet</p>
            <small style={{ color: 'var(--text-muted)' }}>
              Add your first certification using the form above
            </small>
          </div>
        ) : (
          <ul>
            {certifications.map((cert, index) => (
              <li key={cert.id} className="cert-item" style={getAnimationDelay(index)}>
                <div className="cert-info">
                  <strong>{cert.title}</strong>
                  <span>by {cert.issuer}</span>
                  <div className="cert-meta">
                    {cert.createdAt && (
                      <small>📅 {formatDate(cert.createdAt)}</small>
                    )}
                    {cert.fileURL && (
                      <a 
                        href={cert.fileURL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`View ${cert.title} certificate`}
                      >
                        {isMobile ? "👁️ View" : "👁️ View Certificate"}
                      </a>
                    )}
                  </div>
                </div>
                <div className="cert-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(cert)}
                    aria-label={`Edit ${cert.title}`}
                    disabled={!isOnline}
                  >
                    <span>{isMobile ? "✏️" : "✏️ Edit"}</span>
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(cert.id)}
                    aria-label={`Delete ${cert.title}`}
                    disabled={!isOnline}
                  >
                    <span>{isMobile ? "🗑️" : "🗑️ Delete"}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ManageCertifications;