import React, { useState, useEffect } from 'react';
import './EquipmentList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getEquipment, exportToExcel, importFromExcel } from '../../../data/equipmentStore';
import DataImportExport from '../common/DataImportExport';
import LockStatus from '../common/LockStatus';
import EquipmentHistory from './EquipmentHistory';

function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 
  
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
    setCurrentPage(1); 
  };
  
  const filteredEquipment = searchTerm 
    ? equipment.filter(eq => 
        eq.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.initialOwner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.currentOwner?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : equipment;
  

  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  
  
  const paginatedEquipment = filteredEquipment.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
 
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
 
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };
  
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
            <th>Propietario actual</th>
            <th>Fecha de compra</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEquipment.map(eq => (
            <tr key={eq.id}>
              <td>{eq.model}</td>
              <td>{eq.currentOwner || eq.initialOwner}</td>
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
      
      {filteredEquipment.length > itemsPerPage && (
        <div className="pagination">
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
            className={currentPage === 1 ? "disabled" : ""}
          >
            <FontAwesomeIcon icon={['fas', 'chevron-left']} />
          </button>
          
          {getPageNumbers().map(page => (
            <button 
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "disabled" : ""}
          >
            <FontAwesomeIcon icon={['fas', 'chevron-right']} />
          </button>
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

