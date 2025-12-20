import React from 'react';
import './Button.css';

function Button({ 
  children, 
  variant = 'primary',  // 'primary', 'secondary', 'house'
  onClick, 
  type = 'button',
  disabled = false,
  fullWidth = false 
}) {
  return (
    <button
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;