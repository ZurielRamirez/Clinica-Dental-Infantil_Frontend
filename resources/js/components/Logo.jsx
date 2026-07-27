// resources/js/components/Logo.jsx
import React from 'react';

const Logo = ({ subtitle }) => {
  return (
    <>
      <div className="logo-circle">
        <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
          <path d="M 30 20 C 15 20 15 50 20 70 C 25 85 35 85 40 75 C 45 68 55 68 60 75 C 65 85 75 85 80 70 C 85 50 85 20 70 20 C 50 15 50 15 30 20 Z" fill="#FFFFFF" stroke="#0B5B42" strokeWidth="4"/>
          <circle cx="40" cy="40" r="4" fill="#0B5B42"/>
          <circle cx="60" cy="40" r="4" fill="#0B5B42"/>
          <circle cx="32" cy="48" r="5" fill="#F8B1A6"/>
          <circle cx="68" cy="48" r="5" fill="#F8B1A6"/>
          <path d="M 42 55 Q 50 62 58 55" fill="none" stroke="#0B5B42" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
      <h1 className="logo-text">KiddieDent</h1>
      <p className="logo-subtext">{subtitle}</p>
    </>
  );
};

export default Logo;