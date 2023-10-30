// LinkComponent.js

import React from 'react';

export const LinkComponent = ({ href, label, color }) => {
  return (
    <a className="custom-link" 
    href={href} 
    style={{ '--link-color': color }}>
      {label}
    </a>
  );
}

