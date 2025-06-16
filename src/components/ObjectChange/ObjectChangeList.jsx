import React, { useState, useEffect } from 'react';
import './ObjectChangeList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getObjectChanges, exportToExcel, importFromExcel, toggleEstadoObjectChange } from '../../data/objectChangesStore';
import DataImportExport from '../common/DataImportExport';
import { faExchangeAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ReactDOM from 'react-dom';

function diasDesde(fecha) {
  if (!fecha) return 0;
  const ahora = new Date();
  const inicio = new Date(fecha);
  return Math.max(1, Math.round((ahora - inicio) / (1000 * 60 * 60 * 24)));
}

function formatFecha(fecha) {
  if (!fecha) return '-';
  const d = new Date(fecha);
  return d.toLocaleDateString();
}

function ObjectChangeList() {
  const [objectChanges, setObjectChanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' });
  
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
  
  const handleToggleEstado = async (id) => {
    await toggleEstadoObjectChange(id);
    const data = await getObjectChanges();
    setObjectChanges(data);
  };

  const handleMouseOver = (e, change) => {
    let text = '';
    if (change.estado === 'Prestado') {
      const dias = diasDesde(change.fechaPrestamo);
      text = `Prestado desde ${formatFecha(change.fechaPrestamo)} (${dias} día${dias > 1 ? 's' : ''})`;
    } else if (change.estado === 'Devuelto') {
      text = `Prestado del ${formatFecha(change.fechaPrestamo)} al ${formatFecha(change.fechaDevolucion)} (${change.diasPrestado || 1} día${(change.diasPrestado || 1) > 1 ? 's' : ''})`;
    }
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, text });
  };

  const handleMouseOut = () => {
    setTooltip({ ...tooltip, visible: false });
  };

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
            <th>
              <FontAwesomeIcon icon={faExchangeAlt} /> Estado
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredChanges.map(change => (
            <tr key={change.id}>
              <td>{change.location}</td>
              <td>{change.personName || '-'}</td>
              <td>{change.objectType}</td>
              <td>{new Date(change.date).toLocaleDateString()}</td>
              <td>
                {change.estado === 'Prestado' ? (
                  <button
                    className={`estado-btn prestado`}
                    onClick={() => handleToggleEstado(change.id)}
                    onMouseOver={e => handleMouseOver(e, change)}
                    onMouseMove={e => handleMouseOver(e, change)}
                    onMouseOut={handleMouseOut}
                    disabled={isReadOnly}
                    style={{ cursor: isReadOnly ? 'not-allowed' : 'pointer' }}
                  >
                    <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 6 }} />
                    <FontAwesomeIcon icon={["fas", "hand-holding"]} style={{ marginRight: 4, color: '#1976d2' }} />
                    Marcar como Devuelto
                  </button>
                ) : change.estado === 'Devuelto' ? (
                  <span
                    className="estado-btn devuelto"
                    onMouseOver={e => handleMouseOver(e, change)}
                    onMouseMove={e => handleMouseOver(e, change)}
                    onMouseOut={handleMouseOut}
                    style={{ cursor: 'default', userSelect: 'none' }}
                  >
                    <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 6 }} />
                    Devuelto
                  </span>
                ) : (
                  <span className="estado-btn sin-estado">
                    <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 6, color: '#b0b0b0' }} />
                    <span style={{ color: '#b0b0b0', fontStyle: 'italic' }}>Sin estado</span>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tooltip.visible && ReactDOM.createPortal(
        <div
          className="estado-tooltip"
          style={{ position: 'fixed', left: tooltip.x + 16, top: tooltip.y + 8, zIndex: 99999 }}
        >
          {tooltip.text}
        </div>,
        document.body
      )}
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