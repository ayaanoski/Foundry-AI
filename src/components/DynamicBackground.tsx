import React from 'react';

const DynamicBackground: React.FC = () => {
  return (
    <div className="animated-mesh">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-transparent animate-pulse"></div>
    </div>
  );
};

export default DynamicBackground;