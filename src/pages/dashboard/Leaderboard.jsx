import React, { useState } from "react";
import "./Leaderboard.css";
import Particles from "../../components/Particles.jsx";

function Leaderboard() {
  const [houses] = useState([
    {
      name: "Gryffindor",
      points: 0,
      color: "#740001",
      secondary: "#D3A625",
      glow: "#E8C547",
      image: "/houses/gryffindor.webp",
      emoji: "🦁",
      traits: "Courage & Bravery",
    },
    {
      name: "Slytherin",
      points: 0,
      color: "#1A472A",
      secondary: "#5ECC7B",
      glow: "#2D8B47",
      image: "/houses/slytherin.webp",
      emoji: "🐍",
      traits: "Ambition & Cunning",
    },
    {
      name: "Ravenclaw",
      points: 0,
      color: "#0E1A40",
      secondary: "#6B9BD1",
      glow: "#4A7BA7",
      image: "/houses/ravenclaw.webp",
      emoji: "🦅",
      traits: "Wisdom & Intelligence",
    },
    {
      name: "Hufflepuff",
      points: 0,
      color: "#ECB939",
      secondary: "#FFE44D",
      glow: "#D4B91F",
      image: "/houses/hufflepuff.webp",
      emoji: "🦡",
      traits: "Loyalty & Hard Work",
    },
  ]);

  // Sort houses by points (for when points are added)
  const sortedHouses = [...houses].sort((a, b) => b.points - a.points);

  // Add rank based on sorted position
  const rankedHouses = sortedHouses.map((house, index) => ({
    ...house,
    rank: index + 1,
  }));

  // Gold Shield SVG
  const GoldShield = () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="gold-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe066" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
      </defs>
      <path
        d="M16 3 L29 8 V16 C29 24 16 29 16 29 C16 29 3 24 3 16 V8 Z"
        fill="url(#gold-gradient)"
        stroke="#bfa133"
        strokeWidth="2"
      />
    </svg>
  );

  // Silver Shield SVG
  const SilverShield = () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="silver-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8f9fa" />
          <stop offset="100%" stopColor="#adb5bd" />
        </linearGradient>
      </defs>
      <path
        d="M16 3 L29 8 V16 C29 24 16 29 16 29 C16 29 3 24 3 16 V8 Z"
        fill="url(#silver-gradient)"
        stroke="#868e96"
        strokeWidth="2"
      />
    </svg>
  );

  // Bronze Shield SVG
  const BronzeShield = () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="bronze-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd6a5" />
          <stop offset="100%" stopColor="#b08968" />
        </linearGradient>
      </defs>
      <path
        d="M16 3 L29 8 V16 C29 24 16 29 16 29 C16 29 3 24 3 16 V8 Z"
        fill="url(#bronze-gradient)"
        stroke="#a67c52"
        strokeWidth="2"
      />
    </svg>
  );

  const getRankIcon = (rank) => {
  switch(rank) {
    case 1: return <GoldShield />;
    case 2: return <SilverShield />;
    case 3: return <BronzeShield />;
    default: return (
      <span className="rank-number">{rank}</span>
    );
  }
};

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        {/* Particles Background */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <Particles
            particleColors={["#ffffff", "#ffffff"]}
            particleCount={600}
            particleSpread={15}
            speed={0.1}
            particleBaseSize={80}
            moveParticlesOnHover={false}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>
        {/* Header */}
        <div className="leaderboard-header">
          <div className="leaderboard-title-wrapper">
            {/* <div className="wand-divider left"></div> */}
            <h1 className="leaderboard-title">House Championship</h1>
            {/* <div className="wand-divider right"></div> */}
          </div>
          <p className="leaderboard-subtitle">
            The battle for glory begins • Points will be updated as events
            unfold
          </p>
        </div>

        {/* House Cards */}
        <div className="leaderboard-grid">
          {rankedHouses.map((house, index) => (
            <div
              key={house.name}
              className={`house-leaderboard-card rank-${house.rank}`}
              style={{
                "--house-color": house.color,
                "--house-secondary": house.secondary,
                "--house-glow": house.glow,
                animationDelay: `${index * 0.15}s`,
              }}
            >
              {/* Rank Badge */}
              <div className="house-rank-badge">{getRankIcon(house.rank)}</div>

              {/* House Crest */}
              <div className="house-crest-container">
                <div className="house-crest-glow"></div>
                <img
                  src={house.image}
                  alt={house.name}
                  className="house-crest-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  className="house-crest-fallback"
                  style={{ display: "none" }}
                >
                  {house.emoji}
                </div>
              </div>

              {/* House Info */}
              <div className="house-info">
                <h2 className="house-name">{house.name}</h2>
                <p className="house-traits">{house.traits}</p>
              </div>

              {/* Points Display */}
              <div className="house-points">
                {/* <div className="points-label">House Points</div> */}
                <div className="points-value">{house.points}</div>
              </div>

              {/* Progress Bar */}
              <div className="points-progress-bar">
                <div
                  className="points-progress-fill"
                  style={{
                    width:
                      house.points > 0
                        ? `${
                            (house.points /
                              Math.max(...houses.map((h) => h.points))) *
                            100
                          }%`
                        : "0%",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="leaderboard-footer">
          <p className="leaderboard-note">
            <span className="note-icon">⚡</span>
            Points are awarded for event participation, achievements, and house
            activities
          </p>
          <p className="leaderboard-coming-soon">
            Live scoring will be activated during Parsec 6.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
