import React, { useContext } from 'react';
import { ThemeContext } from '../utils/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme, resetToSystemTheme } = useContext(ThemeContext);
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 100
    }}>
      {/* System preference button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetToSystemTheme}
        title="Use system theme"
        style={{
          background: 'transparent',
          border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          borderRadius: '8px',
          padding: '7px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme === 'dark' ? 'white' : '#1A202C'
        }}
      >
        {/* Computer icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </motion.button>
      
      {/* Toggle switch */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        style={{
          background: theme === 'dark' 
            ? 'linear-gradient(to right, #5588FF, #7000FF)' 
            : 'linear-gradient(to right, #38B2AC, #4263EB)',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '14px',
          boxShadow: theme === 'dark'
            ? '0 2px 10px rgba(85, 136, 255, 0.3)'
            : '0 2px 10px rgba(66, 99, 235, 0.2)'
        }}
      >
        {theme === 'dark' ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            Light Mode
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            Dark Mode
          </>
        )}
      </motion.button>
    </div>
  );
};

export default ThemeToggle;