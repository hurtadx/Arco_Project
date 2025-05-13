import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './StatusBar.css';
import LockStatus from '../LockStatus/LockStatus';
import DataPathSettings from '../DataPath/DataPathSettings';

const StatusBar = () => {
  const [dataPath, setDataPath] = useState('');
  const [lastSync, setLastSync] = useState('-');
  const [isError, setIsError] = useState(false);
  const [showDataPathSettings, setShowDataPathSettings] = useState(false);

  useEffect(() => {
    const loadDataPath = async () => {
      try {
        if (window.electron) {
          const path = await window.electron.invoke('get-data-path');
          setDataPath(path || 'P:\\ArcoData');
          setIsError(false);
        }
      } catch (error) {
        console.error('Error al obtener la ruta de datos:', error);
        setDataPath('Error');
        setIsError(true);
      }
    };

    loadDataPath();
  }, []);

  useEffect(() => {
    const now = new Date();
    setLastSync(now.toLocaleTimeString());
  }, []);

  const handleConfigClick = () => {
    setShowDataPathSettings(true);
  };

  const handleSettingsClose = () => {
    setShowDataPathSettings(false);
    const loadPath = async () => {
      try {
        if (window.electron) {
          const path = await window.electron.invoke('get-data-path');
          setDataPath(path || 'P:\\ArcoData');
          setIsError(false);
        }
      } catch (error) {
        console.error('Error al obtener la ruta de datos:', error);
        setDataPath('Error');
        setIsError(true);
      }
    };
    loadPath();
  };

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
          <button 
            className="config-button" 
            title="Configurar ubicación"
            onClick={handleConfigClick}
          >
            <FontAwesomeIcon icon="cog" />
          </button>
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

      <DataPathSettings 
        isOpen={showDataPathSettings} 
        onClose={handleSettingsClose} 
      />
    </div>
  );
};

export default StatusBar;

