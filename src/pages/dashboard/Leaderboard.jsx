import React, { useState } from 'react';
import './Leaderboard.css';

function Leaderboard() {
  const [houses] = useState([
    {
      name: 'Gryffindor',
      points: 0,
      color: '#740001',
      secondary: '#D3A625',
      glow: '#E8C547',
      image: '/houses/gryffindor.png',
      emoji: '🦁',
      traits: 'Courage & Bravery'
    },
    {
      name: 'Slytherin',
      points: 0,
      color: '#1A472A',
      secondary: '#5ECC7B',
      glow: '#2D8B47',
      image: '/houses/slytherin.png',
      emoji: '🐍',
      traits: 'Ambition & Cunning'
    },
    {
      name: 'Ravenclaw',
      points: 0,
      color: '#0E1A40',
      secondary: '#6B9BD1',
      glow: '#4A7BA7',
      image: '/houses/ravenclaw.png',
      emoji: '🦅',
      traits: 'Wisdom & Intelligence'
    },
    {
      name: 'Hufflepuff',
      points: 0,
      color: '#ECB939',
      secondary: '#FFE44D',
      glow: '#D4B91F',
      image: '/houses/hufflepuff.png',
      emoji: '🦡',
      traits: 'Loyalty & Hard Work'
    }
  ]);

  // Sort houses by points (for when points are added)
  const sortedHouses = [...houses].sort((a, b) => b.points - a.points);

  // Add rank based on sorted position
  const rankedHouses = sortedHouses.map((house, index) => ({
    ...house,
    rank: index + 1
  }));

  const getRankMedal = (rank) => {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        {/* Header */}
        <div className="leaderboard-header">
          <div className="leaderboard-title-wrapper">
            {/* <div className="wand-divider left"></div> */}
            <h1 className="leaderboard-title">House Championship</h1>
            {/* <div className="wand-divider right"></div> */}
          </div>
          <p className="leaderboard-subtitle">
            The battle for glory begins • Points will be updated as events unfold
          </p>
        </div>

        {/* House Cards */}
        <div className="leaderboard-grid">
          {rankedHouses.map((house, index) => (
            <div
              key={house.name}
              className={`house-leaderboard-card rank-${house.rank}`}
              style={{
                '--house-color': house.color,
                '--house-secondary': house.secondary,
                '--house-glow': house.glow,
                animationDelay: `${index * 0.15}s`
              }}
            >
              {/* Rank Badge */}
              <div className="house-rank-badge">
                {getRankMedal(house.rank)}
              </div>

              {/* House Crest */}
              <div className="house-crest-container">
                <div className="house-crest-glow"></div>
                <img
                  src={house.image}
                  alt={house.name}
                  className="house-crest-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="house-crest-fallback" style={{ display: 'none' }}>
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
                <div className="points-label">House Points</div>
                <div className="points-value">{house.points}</div>
              </div>

              {/* Progress Bar */}
              <div className="points-progress-bar">
                <div
                  className="points-progress-fill"
                  style={{
                    width: house.points > 0 ? `${(house.points / Math.max(...houses.map(h => h.points))) * 100}%` : '0%'
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
            Points are awarded for event participation, achievements, and house activities
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