import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './LockStatus.css';

const LockStatus = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [lockedBy, setLockedBy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    
    checkLockStatus();
    
    
    if (window.electron) {
      window.electron.receive('lock-status-changed', (locked) => {
        setIsLocked(locked);
        checkLockStatus();
      });
    }
    
    return () => {
      
    };
  }, []);
  
  const checkLockStatus = async () => {
    setIsLoading(true);
    try {
      if (window.electron) {
        const status = await window.electron.invoke('check-lock');
        setIsLocked(status.isLocked);
        setLockedBy(status.lockedBy);
        setError(status.isError ? status.message : null);
      }
    } catch (error) {
      console.error('Error al verificar bloqueo:', error);
      setError('Error al verificar estado de bloqueo');
    } finally {
      setIsLoading(false);
    }
  };
  
  const acquireLock = async () => {
    setIsLoading(true);
    try {
      if (window.electron) {
        const result = await window.electron.invoke('acquire-lock');
        if (result.success) {
          setIsLocked(false);
        } else {
          alert(result.message || 'No se pudo adquirir el bloqueo');
        }
      }
    } catch (error) {
      console.error('Error al adquirir bloqueo:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const releaseLock = async () => {
    setIsLoading(true);
    try {
      if (window.electron) {
        const result = await window.electron.invoke('release-lock');
        if (result.success) {
          setIsLocked(false);
        } else {
          alert(result.message || 'No se pudo liberar el bloqueo');
        }
      }
    } catch (error) {
      console.error('Error al liberar bloqueo:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`lock-status ${isLocked ? 'locked' : 'unlocked'} ${error ? 'error' : ''}`}>
      {isLoading ? (
        <FontAwesomeIcon icon="spinner" spin />
      ) : error ? (
        <div className="error-indicator">
          <FontAwesomeIcon icon="exclamation-triangle" />
          <span>{error}</span>
          <button onClick={checkLockStatus} className="retry-button">
            Reintentar
          </button>
        </div>
      ) : isLocked ? (
        <div className="locked-indicator">
          <FontAwesomeIcon icon="lock" />
          <span>Modo Solo Lectura</span>
          <span className="locked-by">{lockedBy ? `En uso por: ${lockedBy}` : ''}</span>
          <button onClick={acquireLock} className="acquire-button">
            Solicitar Edición
          </button>
        </div>
      ) : (
        <div className="unlocked-indicator">
          <FontAwesomeIcon icon="lock-open" />
          <span>Modo Edición</span>
          <button onClick={releaseLock} className="release-button">
            Liberar Edición
          </button>
        </div>
      )}
    </div>
  );
};

export default LockStatus;