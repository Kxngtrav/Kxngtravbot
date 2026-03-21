import React from 'react';

const SimpleTest: React.FC = () => {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0f', 
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Test Page</h1>
      <button 
        onClick={handleClick}
        style={{
          padding: '12px 24px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        Click Me
      </button>
    </div>
  );
};

export default SimpleTest;