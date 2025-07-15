import React from 'react';
import logoImage from '@/assets/bebington-logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = false }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src={logoImage} 
        alt="Bebington Motors" 
        className={`${sizeClasses[size]} w-auto`}
      />
      {showText && (
        <h2 className={`${textSizeClasses[size]} font-bold text-accent mt-2 uppercase tracking-wide transition-smooth hover:text-accent-glow`}>
          BEBINGTON MOTORS
        </h2>
      )}
    </div>
  );
};