import React from 'react';

export default ({ children, maxHeight = '', height = '', className = '', style = {} }) => {
  return (
    <div className={`ScrollField ${className}`} style={{ maxHeight, height, ...style }}>
      {children}
    </div>
  );
};