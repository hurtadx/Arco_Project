import React, { useState, useEffect } from 'react';
import { getObjectChanges } from '../../data/objectChangesStore';
import './ObjectChangeList.css';

function ObjectChangeList() {
  const [changes, setChanges] = useState([]);
  
  useEffect(() => {
    
    setChanges(getObjectChanges());
    
    
    const interval = setInterval(() => {
      setChanges(getObjectChanges());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (changes.length === 0) {
    return <p className="no-changes">No hay cambios registrados aún.</p>;
  }
  
  return (
    <div className="object-change-list">
      <h3>Cambios Registrados</h3>
      <table>
        <thead>
          <tr>
            <th>Lugar</th>
            <th>Persona</th>
            <th>Objeto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {changes.map(change => (
            <tr key={change.id}>
              <td>{change.location}</td>
              <td>{change.personName || '-'}</td>
              <td>{change.objectType}</td>
              <td>{new Date(change.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ObjectChangeList;