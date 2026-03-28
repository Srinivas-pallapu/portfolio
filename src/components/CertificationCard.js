import React from "react";
import "../styles/maincss/certifications.css";

function CertificationCard({ cert }) {
  const isPDF = cert.fileURL?.endsWith(".pdf");

  return (
    <div className="cert-card">
      <h3>{cert.title}</h3>
      <p><strong>Issuer:</strong> {cert.issuer}</p>
      <p><strong>Date:</strong> {cert.date || "N/A"}</p>
      
      {cert.fileURL && (
        isPDF ? (
          <a href={cert.fileURL} target="_blank" rel="noopener noreferrer">
            {cert.fileName || "Download PDF"}
          </a>
        ) : (
          <img src={cert.fileURL} alt={cert.title} className="cert-image" />
        )
      )}
    </div>
  );
}

export default CertificationCard;
