import React from 'react';
import logoImage from '@/assets/bebington-logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src={logoImage} 
        alt="Bebington Motors" 
        className={`${sizeClasses[size]} w-auto`}
      />
    </div>
  );
};