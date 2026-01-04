import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './AccommodationSection.css';

const AccommodationSection = () => {
  const navigate = useNavigate();

  const passes = [
    {
      name: 'Day Pass 1',
      dates: '24th, 26th Jan',
      price: 300,
      benefits: [
        { feature: 'Accommodation and Food', included: false },
        { feature: 'Access to all events', included: true },
        { feature: 'Cultural Night', included: false },
        { feature: 'Welcome Kit', included: false }
      ]
    },
    {
      name: 'Day Pass 2',
      dates: '25th, 27th Jan',
      price: 500,
      benefits: [
        { feature: 'Accommodation and Food', included: false },
        { feature: 'Access to all events', included: true },
        { feature: 'Cultural Night', included: true },
        { feature: 'Welcome Kit', included: false }
      ]
    },
    {
      name: 'One Day Pass',
      dates: 'Any 1 Day',
      price: 700,
      popular: true,
      benefits: [
        { feature: 'Accommodation and Food', included: true },
        { feature: 'Access to all events', included: true },
        { feature: 'Cultural Night', included: true },
        { feature: 'Welcome Kit', included: true }
      ]
    },
    {
      name: 'Two Day Pass',
      dates: 'Any 2 Days',
      price: 1400,
      benefits: [
        { feature: 'Accommodation and Food', included: true },
        { feature: 'Access to all events', included: true },
        { feature: 'Cultural Night', included: true },
        { feature: 'Welcome Kit', included: true }
      ]
    },
    {
      name: 'Three Day Pass',
      dates: 'Any 3 Days',
      price: 2100,
      benefits: [
        { feature: 'Accommodation and Food', included: true },
        { feature: 'Access to all events', included: true },
        { feature: 'Cultural Night', included: true },
        { feature: 'Welcome Kit', included: true }
      ]
    },
    {
      name: 'Four Day Pass',
      dates: 'All 4 Days',
      price: 2800,
      recommended: true,
      benefits: [
        { feature: 'Accommodation and Food', included: true },
        { feature: 'Access to all events', included: true },
        { feature: 'Cultural Night', included: true },
        { feature: 'Welcome Kit', included: true }
      ]
    }
  ];

  const handleBookNow = () => {
    navigate('/dashboard/accommodation');
  };

  return (
    <section className="accommodation-section">
      <div className="accommodation-container">
        {/* Section Header */}
        <motion.div 
          className="accommodation-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="accommodation-title">Accommodation & Event Passes</h2>
          <p className="accommodation-subtitle">
            Choose the perfect pass for your Parsec 6.0 experience
          </p>
          <div className="accommodation-note">
            <span className="note-icon">📅</span>
            <p>Accommodation portal opens on <strong>7th January 2026, 9:00 AM</strong> on a first-come, first-serve basis.</p>
          </div>
          <div className="accommodation-note">
            <span className="note-icon">ℹ️</span>
            <p>Accommodation for <strong>23rd January 2026</strong> is an additional charge of <strong>₹700</strong></p>
          </div>
        </motion.div>

        {/* Passes Grid */}
        <div className="passes-grid">
          {passes.map((pass, index) => (
            <motion.div
              key={index}
              className={`pass-card ${pass.popular ? 'popular' : ''} ${pass.recommended ? 'recommended' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              {pass.popular && <div className="badge popular-badge">Most Popular</div>}
              {pass.recommended && <div className="badge recommended-badge">Best Value</div>}
              
              <div className="pass-header">
                <h3 className="pass-name">{pass.name}</h3>
                <p className="pass-dates">{pass.dates}</p>
              </div>

              <div className="pass-price">
                <span className="currency">₹</span>
                <span className="amount">{pass.price.toLocaleString('en-IN')}</span>
              </div>

              <div className="pass-benefits">
                {pass.benefits.map((benefit, i) => (
                  <div key={i} className="benefit-item">
                    <span className={`benefit-icon ${benefit.included ? 'included' : 'excluded'}`}>
                      {benefit.included ? '✓' : '✕'}
                    </span>
                    <span className={`benefit-text ${benefit.included ? '' : 'excluded-text'}`}>
                      {benefit.feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Book Now CTA */}
        <motion.div 
          className="accommodation-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="cta-text">Ready to secure your spot?</p>
          <button className="book-btn" onClick={handleBookNow}>
            <span className="btn-icon">🏠</span>
            Book Accommodation - Login Required
            <span className="btn-arrow">→</span>
          </button>
          <p className="cta-note">You'll be redirected to your dashboard to complete the booking</p>
        </motion.div>
      </div>
    </section>
  );
};

export default AccommodationSection;
