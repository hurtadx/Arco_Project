import React from 'react';

const Debug = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '40px',
      right: '10px',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '5px',
      zIndex: 999,
      fontSize: '12px'
    }}>
      ARCO App v1.1
    </div>
  );
};

export default Debug;