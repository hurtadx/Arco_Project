import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Messages.css';

const Message = ({ 
  type = 'info', 
  message, 
  onClose, 
  autoClose = true, 
  duration = 3000,
  icon
}) => {
  const [visible, setVisible] = useState(true);
  
  
  let messageIcon;
  switch (type) {
    case 'success':
      messageIcon = icon || 'check-circle';
      break;
    case 'warning':
      messageIcon = icon || 'exclamation-triangle';
      break;
    case 'error':
      messageIcon = icon || 'times-circle';
      break;
    default:
      messageIcon = icon || 'info-circle';
      break;
  }

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`${type}-message`}>
      <FontAwesomeIcon icon={['fas', messageIcon]} />
      {message}
      {autoClose && <span className="message-progress"></span>}
      {!autoClose && (
        <button 
          className="message-close" 
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
        >
          <FontAwesomeIcon icon={['fas', 'times']} />
        </button>
      )}
    </div>
  );
};

export default Message;