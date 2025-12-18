import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Particles from "../components/Particles";
import "./Tesseract.css";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/Button";

function Tesseract() {
  const { theme } = useTheme();
  const [showForm, setShowForm] = useState(false);

  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdZVRAhZPyHO2M5-XXnErp2Ve8s-pZ9vfqN6lFTRAevmKqSrg/viewform?usp=dialog";

  return (
    <div className="tesseract-page">
      <Navbar />
      <Particles
        particleColors={[
          theme.fontMain || "#ffffff",
          theme.fontMain || "#ffffff",
        ]}
        particleCount={400}
        particleSpread={15}
        speed={0.1}
        particleBaseSize={70}
        moveParticlesOnHover={false}
        alphaParticles={false}
        disableRotation={false}
      />
      <main className="tesseract-container">
        <div className="tesseract-header-section">
          <h1 className="tesseract-header">
            <span className="tesseract-icon">🧊</span>
            <span className="tesseract-title-main">Tesseract</span>
            <span className="tesseract-title-sub">Innovation Beyond Dimensions</span>
          </h1>
          <p className="tesseract-description">
            Step into the fourth dimension of innovation and creativity. 
            Tesseract is more than an event—it's a gateway to boundless possibilities.
          </p>
        </div>

        <div className="tesseract-content">
          <section className="tesseract-about">
            <h2 className="section-title">About Tesseract</h2>
            <p className="section-text">
              Tesseract represents the intersection of technology, creativity, and innovation. 
              This unique event challenges participants to think beyond conventional boundaries, 
              exploring ideas that transcend traditional dimensions of problem-solving.
            </p>
            <p className="section-text">
              Whether you're a visionary coder, a creative designer, or an innovative thinker, 
              Tesseract offers a platform to showcase your talents and push the limits of what's possible.
            </p>
          </section>

          <section className="tesseract-details">
            <h2 className="section-title">Event Details</h2>
            <div className="details-grid">
              <div className="detail-card">
                <span className="detail-icon">📅</span>
                <h3 className="detail-title">Date</h3>
                <p className="detail-text">To be announced</p>
              </div>
              <div className="detail-card">
                <span className="detail-icon">⏰</span>
                <h3 className="detail-title">Duration</h3>
                <p className="detail-text">Full day event</p>
              </div>
              <div className="detail-card">
                <span className="detail-icon">🎯</span>
                <h3 className="detail-title">Format</h3>
                <p className="detail-text">Hybrid (Online & Offline)</p>
              </div>
              <div className="detail-card">
                <span className="detail-icon">🏆</span>
                <h3 className="detail-title">Prizes</h3>
                <p className="detail-text">Exciting rewards & recognition</p>
              </div>
            </div>
          </section>

          <section className="tesseract-registration">
            <h2 className="section-title">Register Now</h2>
            <p className="registration-text">
              Don't miss this opportunity to be part of something extraordinary. 
              Register for Tesseract and unlock your potential!
            </p>
            
            <div className="registration-buttons">
              <Button 
                variant="primary" 
                onClick={() => window.open(formUrl, '_blank')}
              >
                Open Registration Form
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Hide Form' : 'Show Form Here'}
              </Button>
            </div>

            {showForm && (
              <div className="form-container">
                <iframe
                  src={formUrl.replace('?usp=dialog', '?embedded=true')}
                  width="100%"
                  height="800"
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  title="Tesseract Registration Form"
                >
                  Loading…
                </iframe>
              </div>
            )}
          </section>

          <section className="tesseract-highlights">
            <h2 className="section-title">Why Participate?</h2>
            <div className="highlights-grid">
              <div className="highlight-card">
                <span className="highlight-icon">💡</span>
                <h3 className="highlight-title">Innovate</h3>
                <p className="highlight-text">
                  Push boundaries and create solutions that matter
                </p>
              </div>
              <div className="highlight-card">
                <span className="highlight-icon">🤝</span>
                <h3 className="highlight-title">Collaborate</h3>
                <p className="highlight-text">
                  Work with brilliant minds from across the globe
                </p>
              </div>
              <div className="highlight-card">
                <span className="highlight-icon">🌟</span>
                <h3 className="highlight-title">Showcase</h3>
                <p className="highlight-text">
                  Present your ideas to industry experts and leaders
                </p>
              </div>
              <div className="highlight-card">
                <span className="highlight-icon">🚀</span>
                <h3 className="highlight-title">Win</h3>
                <p className="highlight-text">
                  Compete for amazing prizes and recognition
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Tesseract;
