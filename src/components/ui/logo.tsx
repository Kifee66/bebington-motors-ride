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

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src={logoImage} 
        alt="Bebington Motors" 
        className={`${sizeClasses[size]} w-auto`}
      />
      <h2 className={`${textSizeClasses[size]} font-bold text-primary mt-2`}>
        Bebington Motors
      </h2>
    </div>
  );
};