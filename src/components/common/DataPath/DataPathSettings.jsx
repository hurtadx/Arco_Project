import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DataPathSettings.css';

const DataPathSettings = ({ isOpen, onClose }) => {
  const [currentPath, setCurrentPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadCurrentPath = async () => {
      try {
        if (window.electron) {
          const path = await window.electron.invoke('get-data-path');
          setCurrentPath(path || 'P:\\ArcoData');
        }
      } catch (err) {
        console.error('Error al obtener la ruta de datos actual:', err);
        setError('No se pudo obtener la ruta de datos actual');
      }
    };

    if (isOpen) {
      loadCurrentPath();
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSelectFolder = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (window.electron) {
        const result = await window.electron.invoke('select-folder-dialog');
        
        if (result.canceled) {
          setIsLoading(false);
          return;
        }
        
        const newPath = result.filePath;
        
        // Verificar que la carpeta sea accesible
        const checkResult = await window.electron.invoke('check-folder-access', newPath);
        
        if (!checkResult.success) {
          setError(`No se puede acceder a la carpeta seleccionada: ${checkResult.message}`);
          setIsLoading(false);
          return;
        }
        
        // Configurar la nueva ruta
        const saveResult = await window.electron.invoke('set-data-path', newPath);
        
        if (saveResult.success) {
          setCurrentPath(newPath);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError(`Error al configurar la ruta: ${saveResult.message}`);
        }
      }
    } catch (err) {
      console.error('Error al seleccionar carpeta:', err);
      setError('Ocurrió un error al seleccionar la carpeta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (window.electron) {
        const result = await window.electron.invoke('reset-data-path');
        
        if (result.success) {
          setCurrentPath(result.path);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError(`Error al restablecer la ruta: ${result.message}`);
        }
      }
    } catch (err) {
      console.error('Error al restablecer la ruta:', err);
      setError('Ocurrió un error al restablecer la ruta');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="data-path-settings">
        <div className="settings-header">
          <h3>
            <FontAwesomeIcon icon="folder" className="settings-icon" />
            Configuración de carpeta de datos
          </h3>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon="times" />
          </button>
        </div>

        <div className="settings-content">
          <p className="settings-description">
            Seleccione la carpeta donde se almacenarán los archivos de datos (Excel) de la aplicación.
            Esta carpeta debe ser accesible por todos los usuarios de la aplicación.
          </p>
          
          <div className="current-path">
            <span className="path-label">Ubicación actual:</span>
            <span className="path-value">{currentPath}</span>
          </div>
          
          {error && (
            <div className="error-message">
              <FontAwesomeIcon icon="exclamation-circle" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              <FontAwesomeIcon icon="check-circle" />
              Ubicación actualizada correctamente
            </div>
          )}
          
          <div className="settings-actions">
            <button 
              className="btn select-folder-btn" 
              onClick={handleSelectFolder}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon="folder-open" />
              Seleccionar nueva carpeta
            </button>
            
            <button 
              className="btn reset-btn" 
              onClick={handleReset}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon="undo" />
              Restablecer predeterminada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPathSettings;