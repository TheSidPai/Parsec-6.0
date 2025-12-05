import React from "react";
import { motion } from "framer-motion";
import "./AboutSection.css";

function AboutSection() {
  return (
    <section className="about-section">
      <div className="about-container">
        <motion.h2 
          className="about-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Where Magic Meets Innovation
        </motion.h2>
        
        <motion.div 
          className="about-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p className="about-intro">
            Welcome to <span className="highlight">Parsec 6.0</span> — IIT Dharwad's gateway to imagination and innovation.
          </p>
          
          <p className="about-description">
            Where curiosity stirs the air and ideas shimmer just beneath the surface, step into a space where technology feels a touch more alive.
          </p>
          
          <p className="about-description">
            Dive into a world of circuits, algorithms, machines, and minds — and let your creativity rise in ways that feel almost… <span className="enchanted">enchanted</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
