import React, { useState, useEffect } from 'react';
import './EquipmentList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getEquipment, exportToExcel, importFromExcel } from '../../data/equipmentStore';
import DataImportExport from '../common/DataImportExport';
import LockStatus from '../common/LockStatus';
import EquipmentHistory from './EquipmentHistory';

function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
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
    
    
    const loadEquipment = async () => {
      const data = await getEquipment();
      setEquipment(data);
    };
    
    loadEquipment();
    
    
    const interval = setInterval(() => {
      loadEquipment();
      checkLockStatus();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredEquipment = searchTerm 
    ? equipment.filter(eq => 
        eq.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.initialOwner?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : equipment;
  
  if (equipment.length === 0) {
    return (
      <div className="equipment-list">
        <p className="no-equipment">
          <FontAwesomeIcon icon={['fas', 'laptop']} size="2x" style={{marginBottom: '1rem'}} /> <br />
          No hay equipos registrados aún.
        </p>
      </div>
    );
  }
  
  return (
    <div className="equipment-list">
      <div className="list-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar equipos..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <FontAwesomeIcon icon={['fas', 'search']} className="search-icon" />
        </div>
        
        <DataImportExport 
          type="equipos"
          onExport={exportToExcel}
          onImport={importFromExcel}
          isReadOnly={isReadOnly}
        />
      </div>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Propietario inicial</th>
            <th>Fecha de compra</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEquipment.map(eq => (
            <tr key={eq.id}>
              <td>{eq.model}</td>
              <td>{eq.initialOwner}</td>
              <td>{eq.purchaseDate ? new Date(eq.purchaseDate).toLocaleDateString() : 'N/A'}</td>
              <td className="actions">
               
                <button 
                  className="action-btn history-btn" 
                  title="Ver historial"
                  onClick={() => {
                    setSelectedEquipmentId(eq.id);
                    setShowHistoryModal(true);
                  }}
                >
                  <FontAwesomeIcon icon="history" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredEquipment.length > 10 && (
        <div className="pagination">
          <button><FontAwesomeIcon icon={['fas', 'chevron-left']} /></button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button><FontAwesomeIcon icon={['fas', 'chevron-right']} /></button>
        </div>
      )}

      {showHistoryModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <EquipmentHistory 
              equipmentId={selectedEquipmentId} 
              onClose={() => setShowHistoryModal(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EquipmentList;

