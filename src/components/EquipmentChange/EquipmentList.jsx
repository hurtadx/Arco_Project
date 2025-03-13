import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getEquipment } from '../../data/equipmentStore';
import './EquipmentList.css';

function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    
    setEquipment(getEquipment());
    
    
    const interval = setInterval(() => {
      setEquipment(getEquipment());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredEquipment = searchTerm 
    ? equipment.filter(eq => 
        eq.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.initialOwner.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h3>Equipos Registrados ({filteredEquipment.length})</h3>
        <div className="list-actions">
          <div className="search-container">
            <FontAwesomeIcon icon={['fas', 'search']} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar equipos..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>
              <FontAwesomeIcon icon={['fas', 'laptop']} /> Modelo
            </th>
            <th>
              <FontAwesomeIcon icon={['fas', 'user']} /> Propietario Actual
            </th>
            <th>
              <FontAwesomeIcon icon={['fas', 'calendar-alt']} /> Fecha Registro
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredEquipment.map(eq => (
            <tr key={eq.id}>
              <td>{eq.model}</td>
              <td>{eq.initialOwner}</td>
              <td>{new Date(eq.purchaseDate).toLocaleDateString()}</td>
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
    </div>
  );
}

export default EquipmentList;

