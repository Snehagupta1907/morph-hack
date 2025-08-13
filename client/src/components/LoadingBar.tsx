import React from 'react';

interface LoadingBarProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ 
  size = 'medium',
  color = '#B6D478'
}) => {
  const sizeClasses = {
    small: 'w-32 h-1',
    medium: 'w-48 h-1.5',
    large: 'w-64 h-2'
  };

  return (
      <div className="flex justify-center py-8">
    <div className="flex flex-col items-center justify-center gap-2">
      <div className={`${sizeClasses[size]} bg-black rounded-full overflow-hidden`}>
        <div
          className="h-full rounded-full animate-moving-bar"
          style={{ 
            backgroundColor: color,
            width: '50%'
          }}
        />
      </div>
      <span className="text-gray-400 text-md">Loading...</span>
    </div>
    </div>
  );
};

export default LoadingBar; 