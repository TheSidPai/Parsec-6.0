import React from 'react';
import MagicalLoader from '../components/MagicalLoader';

function LoaderPreview() {
  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw',
      background: '#0a0e27',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <MagicalLoader />
    </div>
  );
}

export default LoaderPreview;
