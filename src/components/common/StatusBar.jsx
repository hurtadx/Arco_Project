import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './StatusBar.css';
import LockStatus from './LockStatus';

const StatusBar = () => {
  const [dataPath, setDataPath] = useState('');
  const [lastSync, setLastSync] = useState('');
  const [isError, setIsError] = useState(false);
  
  useEffect(() => {
    const getDataPath = async () => {
      if (window.electron) {
        try {
          const path = await window.electron.invoke('get-data-path');
          setDataPath(path);
        } catch (error) {
          console.error('Error al obtener ruta de datos:', error);
          setIsError(true);
        }
      }
    };
    
    getDataPath();
    
    
    setLastSync(new Date().toLocaleTimeString());
    
    const interval = setInterval(() => {
      setLastSync(new Date().toLocaleTimeString());
    }, 60000); 
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="status-label">
          <FontAwesomeIcon 
            icon={isError ? 'exclamation-triangle' : 'database'} 
            className={`status-icon ${isError ? 'status-error' : ''}`} 
          />
          Base de datos:
        </span>
        <span className={`status-value ${isError ? 'status-error' : ''}`}>
          {isError ? 'Error de conexión' : dataPath}
        </span>
      </div>
      
      <div className="status-item">
        <span className="status-label">
          <FontAwesomeIcon icon="sync" className="status-icon" />
          Última sincronización:
        </span>
        <span className="status-value">{lastSync}</span>
      </div>
      
      <div className="status-lock">
        <LockStatus />
      </div>
    </div>
  );
};

export default StatusBar;