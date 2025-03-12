import React, { useState, useEffect } from 'react';
import './EquipmentList.css';

function EquipmentList() {
  
  const [equipments, setEquipments] = useState([]);
  
  return (
    <div className="equipment-list">
      <h3>Equipos Registrados</h3>
      {equipments.length === 0 ? (
        <p className="no-equipments">No hay equipos registrados aún.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Número Serie</th>
              <th>Propietario</th>
              <th>Fecha Compra</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map(equipment => (
              <tr key={equipment.id}>
                <td>{equipment.model}</td>
                <td>{equipment.serialNumber}</td>
                <td>{equipment.initialOwner}</td>
                <td>{new Date(equipment.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EquipmentList;

