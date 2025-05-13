import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getPrinters } from '../../../../data/printerStore';
import './PrinterList.css';
import TonerChangeForm from './TonerChangeForm';
import TonerHistory from './TonerHistory';

function PrinterList({ onEditPrinter }) {
  const [printers, setPrinters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrinterId, setSelectedPrinterId] = useState(null);
  const [showTonerChangeForm, setShowTonerChangeForm] = useState(false);
  const [showTonerHistory, setShowTonerHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  useEffect(() => {
    const loadPrinters = async () => {
      try {
        setLoading(true);
        const data = await getPrinters();
        setPrinters(data);
      } catch (error) {
        console.error('Error al cargar impresoras:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPrinters();
    
    const interval = setInterval(() => {
      loadPrinters();
    }, 30000); 
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const filteredPrinters = printers.filter(printer => 
    printer.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    printer.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    printer.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    printer.tonerType?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddTonerClick = (printerId) => {
    setSelectedPrinterId(printerId);
    setShowTonerChangeForm(true);
  };
  
  const handleHistoryClick = (printerId) => {
    setSelectedPrinterId(printerId);
    setShowTonerHistory(true);
  };
  
  const handleCloseModal = () => {
    setShowTonerChangeForm(false);
    setShowTonerHistory(false);
    setSelectedPrinterId(null);
  };
  
  
  const totalPages = Math.ceil(filteredPrinters.length / itemsPerPage);
  const paginatedPrinters = filteredPrinters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  if (loading) {
    return (
      <div className="printer-list loading">
        <FontAwesomeIcon icon="spinner" spin size="2x" />
        <p>Cargando impresoras...</p>
      </div>
    );
  }
  
  if (printers.length === 0) {
    return (
      <div className="printer-list empty">
        <FontAwesomeIcon icon="print" size="2x" />
        <p>No hay impresoras registradas.</p>
        <p>Añade una impresora para comenzar a registrar cambios de toner.</p>
      </div>
    );
  }
  
  return (
    <div className="printer-list">
      <div className="list-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar impresoras..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <FontAwesomeIcon icon="search" className="search-icon" />
        </div>
      </div>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Ubicación</th>
            <th>Propietario</th>
            <th>Tipo de Toner</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPrinters.map(printer => (
            <tr key={printer.id}>
              <td>{printer.model}</td>
              <td>{printer.location}</td>
              <td>{printer.owner}</td>
              <td>{printer.tonerType}</td>
              <td className="actions">
                <button 
                  onClick={() => handleAddTonerClick(printer.id)}
                  className="action-btn add-btn"
                  title="Registrar cambio de toner"
                >
                  <FontAwesomeIcon icon="tint" />
                </button>
                <button 
                  onClick={() => handleHistoryClick(printer.id)}
                  className="action-btn history-btn"
                  title="Ver historial"
                >
                  <FontAwesomeIcon icon="history" />
                </button>
                <button 
                  onClick={() => onEditPrinter(printer)}
                  className="action-btn edit-btn"
                  title="Editar impresora"
                >
                  <FontAwesomeIcon icon="edit" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Paginación */}
      {filteredPrinters.length > itemsPerPage && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? "disabled" : ""}
          >
            <FontAwesomeIcon icon="chevron-left" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button 
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "disabled" : ""}
          >
            <FontAwesomeIcon icon="chevron-right" />
          </button>
        </div>
      )}
      
      {/* Modales */}
      {showTonerChangeForm && selectedPrinterId && (
        <div className="modal-overlay">
          <div className="modal-container">
            <TonerChangeForm 
              printerId={selectedPrinterId} 
              onClose={handleCloseModal}
              onSaved={() => {
                handleCloseModal();
              }}
            />
          </div>
        </div>
      )}
      
      {showTonerHistory && selectedPrinterId && (
        <div className="modal-overlay">
          <div className="modal-container">
            <TonerHistory 
              printerId={selectedPrinterId} 
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PrinterList;