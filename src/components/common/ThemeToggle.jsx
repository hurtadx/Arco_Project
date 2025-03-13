import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark-theme');
      
      document.body.classList.add('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme'); 
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme'); 
      localStorage.setItem('theme', 'dark');
    }
    
    setDarkMode(!darkMode);
  };

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <FontAwesomeIcon icon={['fas', darkMode ? 'sun' : 'moon']} />
    </button>
  );
};

export default ThemeToggle;