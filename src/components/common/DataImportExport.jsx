import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DataImportExport.css';

const DataImportExport = ({ 
  type, 
  onExport, 
  onImport, 
  isReadOnly = false 
}) => {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState(null);

  const handleExport = async () => {
    try {
      await onExport();
      setMessage({
        type: 'success',
        text: `Datos de ${type} exportados correctamente`
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al exportar:', error);
      setMessage({
        type: 'error',
        text: `Error al exportar: ${error.message}`
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      await onImport(file);
      setMessage({
        type: 'success',
        text: `Datos de ${type} importados correctamente`
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al importar:', error);
      setMessage({
        type: 'error',
        text: `Error al importar: ${error.message}`
      });
    }
    
    e.target.value = ''; 
  };

  return (
    <div className="data-import-export">
      {message && (
        <div className={`${message.type}-message`}>
          <FontAwesomeIcon 
            icon={message.type === 'success' ? 'check-circle' : 'exclamation-circle'} 
          />
          {message.text}
        </div>
      )}
      
      <div className="import-export-actions">
        <button 
          className="btn btn-accent export-btn" 
          onClick={handleExport}
        >
          <FontAwesomeIcon icon="file-export" />
          Exportar a Excel
        </button>
        
        {!isReadOnly && (
          <button 
            className="btn btn-primary import-btn" 
            onClick={handleImportClick}
          >
            <FontAwesomeIcon icon="file-import" />
            Importar desde Excel
          </button>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden-input"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default DataImportExport;