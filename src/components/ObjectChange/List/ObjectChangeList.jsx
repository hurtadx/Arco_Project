import React, { useState, useEffect } from 'react';
import './ObjectChangeList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getObjectChanges, exportToExcel, importFromExcel } from '../../../data/objectChangesStore';
import DataImportExport from '../../common//DataImportExport/DataImportExport';
import { formatDateSafe } from '../../../utils/dateUtils'; // Importar la función

function ObjectChangeList() {
  const [objectChanges, setObjectChanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  useEffect(() => {
    
    const checkLockStatus = async () => {
      if (window.electron) {
        try {
          const lockStatus = await window.electron.invoke('check-lock');
          setIsReadOnly(lockStatus.isLocked);
        } catch (error) {
          console.error('Error al verificar estado de bloqueo:', error);
        }
      }
    };
    
    checkLockStatus();
    
    
    const loadChanges = async () => {
      const data = await getObjectChanges();
      setObjectChanges(data);
    };
    
    loadChanges();
    
    
    const interval = setInterval(() => {
      loadChanges();
      checkLockStatus();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredChanges = searchTerm 
    ? objectChanges.filter(change => 
        change.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        change.personName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        change.objectType?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : objectChanges;
  
  
  return (
    <div className="object-change-list">
      <div className="list-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar cambios..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <FontAwesomeIcon icon={['fas', 'search']} className="search-icon" />
        </div>
        
        <DataImportExport 
          type="cambios de objetos"
          onExport={exportToExcel}
          onImport={importFromExcel}
          isReadOnly={isReadOnly}
        />
      </div>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>
              <FontAwesomeIcon icon={['fas', 'building']} /> Lugar
            </th>
            <th>
              <FontAwesomeIcon icon={['fas', 'user']} /> Persona
            </th>
            <th>
              <FontAwesomeIcon icon={['fas', 'box']} /> Objeto
            </th>
            <th>
              <FontAwesomeIcon icon={['fas', 'calendar-alt']} /> Fecha
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredChanges.map(change => (
            <tr key={change.id}>
              <td>{change.location}</td>
              <td>{change.personName || '-'}</td>
              <td>{change.objectType}</td>
              <td>{formatDateSafe(change.date)}</td> {/* Usar la nueva función */}
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredChanges.length > 10 && (
        <div className="pagination">
          <button><FontAwesomeIcon icon={['fas', 'chevron-left']} /></button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button><FontAwesomeIcon icon={['fas', 'chevron-right']} /></button>
        </div>
      )}
    </div>
  );
}

export default ObjectChangeList;