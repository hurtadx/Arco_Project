import React from 'react';
import './AnimatedContainer.css';


const AnimatedContainer = ({ children, animation = 'fade-in', delay = 0, className = '' }) => {
  return (
    <div 
      className={`animated-container ${animation} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;