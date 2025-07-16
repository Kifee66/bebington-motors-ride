import React from 'react';
import heroBackgroundImage from '@/assets/bebington-hero-bg.jpg';

export const GlobalBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${heroBackgroundImage})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/95 dark:bg-black/80" />
    </div>
  );
};