import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getObjectChanges } from '../../data/objectChangesStore';
import './ObjectChangeList.css';

function ObjectChangeList() {
  const [changes, setChanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    
    setChanges(getObjectChanges());
    
    
    const interval = setInterval(() => {
      setChanges(getObjectChanges());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredChanges = searchTerm 
    ? changes.filter(change => 
        change.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (change.personName && change.personName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        change.objectType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : changes;
  
  if (changes.length === 0) {
    return (
      <div className="object-change-list">
        <p className="no-changes">
          <FontAwesomeIcon icon={['far', 'clipboard']} size="2x" style={{marginBottom: '1rem'}} /> <br />
          No hay cambios registrados aún.
        </p>
      </div>
    );
  }
  
  return (
    <div className="object-change-list">
      <div className="list-header">
        <h3>Cambios Registrados ({filteredChanges.length})</h3>
        <div className="list-actions">
          <div className="search-container">
            <FontAwesomeIcon icon={['fas', 'search']} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar cambios..." 
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
              <td>{new Date(change.date).toLocaleDateString()}</td>
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