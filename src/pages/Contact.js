import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "../styles/maincss/contact.css";

function Contact() {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // EmailJS credentials - Updated with your actual credentials
  const EMAILJS_SERVICE_ID = "service_vf4wqy4";
  const EMAILJS_TEMPLATE_ID = "template_647hbta"; // Contact Us template
  const EMAILJS_PUBLIC_KEY = "kt-3kbrbUx6KDYI5m";
  const AUTO_REPLY_TEMPLATE_ID = "template_7hk1yof"; // Auto-Reply template

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Contact information - Update with your details
  const contactInfo = {
    email: "srinivaspallapu9381@gmail.com",
    phone: "9381723703",
    whatsapp: "9381723703",
    location: "Guntur, India",
   // availability: "Monday - Friday, 9:00 AM - 6:00 PM"
  };

  // Social media links - Update with your profiles
  const socialLinks = {
    github: "https://github.com/Srinivas-pallapu",
    linkedin: "https://www.linkedin.com/in/srinivaspallapu9/",
    instagram: "https://www.instagram.com/mr.__.srinivas_/"
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    // Get form data for auto-reply
    const formData = new FormData(form.current);
    const userEmail = formData.get("user_email");
    const userName = formData.get("user_name");
    const userSubject = formData.get("subject");
    const userMessage = formData.get("message");

    emailjs
      .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form.current, EMAILJS_PUBLIC_KEY)
      .then(
        (result) => {
          console.log("Email sent successfully:", result.text);

          // Send automatic reply email to the user
          sendAutoReply(userEmail, userName, userSubject, userMessage);

          setMessage({
            text: "✓ Message sent successfully! I'll get back to you within 24 hours. A confirmation email has been sent to your inbox.",
            type: "success"
          });
          form.current.reset();
          setIsLoading(false);
          
          // Auto-hide success message after 5 seconds on mobile
          if (isMobile) {
            setTimeout(() => {
              setMessage({ text: "", type: "" });
            }, 5000);
          }
        },
        (error) => {
          console.error("Error sending email:", error.text);
          setMessage({
            text: "❌ Failed to send message. Please try again or contact me directly via WhatsApp or email.",
            type: "error"
          });
          setIsLoading(false);
        }
      );
  };

  // Function to send automatic reply email
  const sendAutoReply = (userEmail, userName, userSubject, userMessage) => {
    // Auto-reply template parameters
    const autoReplyParams = {
      to_email: userEmail,
      to_name: userName || "there",
      from_name: "Srinivas", // Update with your name
      subject: `Thank you for contacting us - ${userSubject || "Inquiry"}`,
      reply_message: `Thank you for reaching out! I've received your message and will get back to you as soon as possible (usually within 24 hours).\n\nYour message: "${userMessage?.substring(0, 100)}${userMessage?.length > 100 ? '...' : ''}"\n\nLooking forward to connecting with you!`,
      current_date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    emailjs
      .send(EMAILJS_SERVICE_ID, AUTO_REPLY_TEMPLATE_ID, autoReplyParams, EMAILJS_PUBLIC_KEY)
      .then(
        () => {
          console.log("Auto-reply email sent successfully to:", userEmail);
        },
        (error) => {
          console.error("Failed to send auto-reply:", error.text);
        }
      );
  };

  // WhatsApp click handler
  const handleWhatsAppClick = () => {
    const phoneNumber = contactInfo.whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent("Hello! I'm interested in connecting with you.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  // Email click handler
  const handleEmailClick = () => {
    window.location.href = `mailto:${contactInfo.email}?subject=Inquiry%20from%20Portfolio&body=Hello,%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20get%20in%20touch.%0A%0ARegards,`;
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h2>{isMobile ? "Get In Touch" : "Get In Touch"}</h2>
          <p className="contact-subtitle">
            {isMobile 
              ? "Have a project? Let's discuss!"
              : "Have a project in mind or want to discuss opportunities? Feel free to reach out!"
            }
            <br />
            <span className="response-time">⚡ I typically respond within 24 hours</span>
          </p>
        </div>

        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <form ref={form} onSubmit={sendEmail} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="user_name"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="user_email"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder={isMobile ? "Project Inquiry" : "Project Inquiry"}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={isMobile ? "4" : "5"}
                  placeholder={isMobile ? "Tell me about your project..." : "Tell me about your project..."}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    {isMobile ? "Sending..." : "Sending..."}
                  </>
                ) : (
                  isMobile ? "Send" : "Send Message"
                )}
              </button>

              {message.text && (
                <div className={`form-message ${message.type}`}>
                  {message.text}
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            <div className="contact-info-card">
              <h3>{isMobile ? "Contact Info" : "Contact Information"}</h3>
              
              {/* Quick Action Buttons */}
              <div className="quick-actions">
                <button onClick={handleEmailClick} className="quick-action-btn email-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                  {isMobile ? "Email" : "Send Email"}
                </button>
                <button onClick={handleWhatsAppClick} className="quick-action-btn whatsapp-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.004 0c-6.627 0-12 5.373-12 12 0 2.123.552 4.12 1.526 5.86L0 24l6.337-1.652c1.706.937 3.637 1.433 5.667 1.433 6.627 0 12-5.373 12-12s-5.373-12-12-12zm3.403 17.433c-.297.86-1.766 1.645-2.418 1.712-.646.066-1.408.042-2.276-.222-2.55-.772-4.183-2.68-4.184-4.683 0-1.575.847-2.955 2.22-3.73.31-.174.66-.265 1.008-.265.36 0 .706.109 1.005.306.297.196.527.47.66.79.133.32.177.676.124 1.022-.055.346-.177.677-.355.975-.11.183-.235.363-.37.535-.126.158-.225.338-.294.53-.11.304.058.65.375.826.76.424 1.526.76 2.335.99.375.106.773.062 1.117-.124.343-.187.616-.483.77-.831.154-.348.203-.732.141-1.1-.06-.366-.229-.707-.487-.978-.258-.27-.584-.46-.94-.55-.158-.04-.32-.05-.48-.03-.16.02-.317.07-.465.15-.125.067-.242.149-.35.245-.107.096-.21.2-.305.31-.097.11-.192.223-.274.343-.09.13-.16.272-.208.422-.07.216.012.446.197.584.634.476 1.35.834 2.113 1.056.22.064.45.042.66-.06.21-.103.382-.267.496-.472.114-.205.168-.444.153-.68-.015-.236-.1-.46-.24-.645-.14-.184-.327-.324-.54-.405-.213-.08-.443-.1-.663-.055-.22.045-.428.15-.604.305-.176.156-.315.353-.41.575-.095.222-.14.462-.13.702.01.24.07.475.175.694.105.22.26.416.45.57.19.155.416.26.656.31.24.05.49.03.72-.06.23-.09.433-.24.587-.44.154-.2.256-.44.293-.7.037-.26.007-.524-.087-.768-.094-.244-.246-.46-.44-.63-.193-.17-.42-.29-.666-.355-.246-.065-.504-.067-.75-.005-.246.062-.48.186-.67.363-.19.177-.33.404-.41.66-.08.256-.098.53-.05.798.048.268.152.522.302.75.15.228.345.42.572.57.227.15.484.252.756.302.272.05.553.037.82-.037.267-.074.516-.214.724-.408.208-.194.37-.44.476-.715.106-.275.154-.575.14-.874-.014-.299-.082-.592-.2-.868-.118-.276-.286-.528-.496-.74-.21-.212-.46-.38-.738-.496-.278-.116-.578-.176-.88-.176-.384 0-.76.096-1.09.28-.33.184-.606.445-.804.76-.198.315-.313.675-.33 1.045-.017.37.068.737.246 1.067.178.33.435.61.746.816.31.206.674.33 1.052.357.378.027.756-.045 1.102-.21.346-.165.65-.41.89-.718.24-.308.41-.67.5-1.055.09-.385.098-.785.022-1.173-.076-.388-.233-.756-.464-1.078-.23-.322-.53-.59-.88-.79-.35-.2-.74-.307-1.14-.31-.03 0-.06 0-.09 0z" />
                  </svg>
                  {isMobile ? "WhatsApp" : "WhatsApp"}
                </button>
              </div>

              <div className="contact-divider">
                <span>or contact directly</span>
              </div>

              {/* Email */}
              <div className="contact-detail">
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                </div>
                <div className="contact-text">
                  <h4>Email</h4>
                  <a href={`mailto:${contactInfo.email}`}>{isMobile ? contactInfo.email.substring(0, 20) + "..." : contactInfo.email}</a>
                  {!isMobile && <p className="contact-note">I'll reply within 24 hours</p>}
                </div>
              </div>

              {/* Phone */}
              <div className="contact-detail">
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="contact-text">
                  <h4>Phone</h4>
                  <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="contact-detail">
                <div className="contact-icon whatsapp-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.004 0c-6.627 0-12 5.373-12 12 0 2.123.552 4.12 1.526 5.86L0 24l6.337-1.652c1.706.937 3.637 1.433 5.667 1.433 6.627 0 12-5.373 12-12s-5.373-12-12-12zm3.403 17.433c-.297.86-1.766 1.645-2.418 1.712-.646.066-1.408.042-2.276-.222-2.55-.772-4.183-2.68-4.184-4.683 0-1.575.847-2.955 2.22-3.73.31-.174.66-.265 1.008-.265.36 0 .706.109 1.005.306.297.196.527.47.66.79.133.32.177.676.124 1.022-.055.346-.177.677-.355.975-.11.183-.235.363-.37.535-.126.158-.225.338-.294.53-.11.304.058.65.375.826.76.424 1.526.76 2.335.99.375.106.773.062 1.117-.124.343-.187.616-.483.77-.831.154-.348.203-.732.141-1.1-.06-.366-.229-.707-.487-.978-.258-.27-.584-.46-.94-.55-.158-.04-.32-.05-.48-.03-.16.02-.317.07-.465.15-.125.067-.242.149-.35.245-.107.096-.21.2-.305.31-.097.11-.192.223-.274.343-.09.13-.16.272-.208.422-.07.216.012.446.197.584.634.476 1.35.834 2.113 1.056.22.064.45.042.66-.06.21-.103.382-.267.496-.472.114-.205.168-.444.153-.68-.015-.236-.1-.46-.24-.645-.14-.184-.327-.324-.54-.405-.213-.08-.443-.1-.663-.055-.22.045-.428.15-.604.305-.176.156-.315.353-.41.575-.095.222-.14.462-.13.702.01.24.07.475.175.694.105.22.26.416.45.57.19.155.416.26.656.31.24.05.49.03.72-.06.23-.09.433-.24.587-.44.154-.2.256-.44.293-.7.037-.26.007-.524-.087-.768-.094-.244-.246-.46-.44-.63-.193-.17-.42-.29-.666-.355-.246-.065-.504-.067-.75-.005-.246.062-.48.186-.67.363-.19.177-.33.404-.41.66-.08.256-.098.53-.05.798.048.268.152.522.302.75.15.228.345.42.572.57.227.15.484.252.756.302.272.05.553.037.82-.037.267-.074.516-.214.724-.408.208-.194.37-.44.476-.715.106-.275.154-.575.14-.874-.014-.299-.082-.592-.2-.868-.118-.276-.286-.528-.496-.74-.21-.212-.46-.38-.738-.496-.278-.116-.578-.176-.88-.176-.384 0-.76.096-1.09.28-.33.184-.606.445-.804.76-.198.315-.313.675-.33 1.045-.017.37.068.737.246 1.067.178.33.435.61.746.816.31.206.674.33 1.052.357.378.027.756-.045 1.102-.21.346-.165.65-.41.89-.718.24-.308.41-.67.5-1.055.09-.385.098-.785.022-1.173-.076-.388-.233-.756-.464-1.078-.23-.322-.53-.59-.88-.79-.35-.2-.74-.307-1.14-.31-.03 0-.06 0-.09 0z" />
                  </svg>
                </div>
                <div className="contact-text">
                  <h4>WhatsApp</h4>
                  <button onClick={handleWhatsAppClick} className="whatsapp-link">
                    {contactInfo.whatsapp}
                  </button>
                  {!isMobile && <p className="contact-note">Click to start a conversation</p>}
                </div>
              </div>

              {/* Location */}
              <div className="contact-detail">
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="contact-text">
                  <h4>Location</h4>
                  <p>{contactInfo.location}</p>
                  {!isMobile && <p className="contact-note">{contactInfo.availability}</p>}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="social-links">
                <h4>Connect with me</h4>
                <div className="social-icons">
                  <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;