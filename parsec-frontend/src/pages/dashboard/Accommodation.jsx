import React from 'react';
import ComingSoon from '../../components/ComingSoon';

function Accommodation() {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-gradient, linear-gradient(135deg, #1a1a2e 0%, #16213e 100%))'
    }}>
      <ComingSoon />
    </div>
  );
}

export default Accommodation;
