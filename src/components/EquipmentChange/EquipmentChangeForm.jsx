import React, { useState } from 'react';
import './EquipmentChangeForm.css';

function EquipmentChangeForm() {
  const [formData, setFormData] = useState({
    equipment: '',
    previousOwner: '',
    newOwner: '',
    reason: '',
    fromDate: '',
    toDate: new Date().toISOString().split('T')[0]
  });
  
  
  const equipments = [
    { id: '1', name: 'Laptop Dell XPS 13' },
    { id: '2', name: 'Monitor LG 27"' },
    { id: '3', name: 'Teclado Logitech MX' }
  ];
  
  const reasons = [
    'Actualización', 
    'Daño', 
    'Reasignación',
    'Retiro',
    'Otro'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cambio de equipo registrado:', formData);
    
    
    setFormData({
      equipment: '',
      previousOwner: '',
      newOwner: '',
      reason: '',
      fromDate: '',
      toDate: new Date().toISOString().split('T')[0]
    });
  };
  
  return (
    <div className="equipment-change-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="equipment">Equipo:</label>
          <select
            id="equipment"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un equipo</option>
            {equipments.map(eq => (
              <option key={eq.id} value={eq.id}>{eq.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="previousOwner">Propietario Anterior:</label>
          <input
            type="text"
            id="previousOwner"
            name="previousOwner"
            value={formData.previousOwner}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="newOwner">Nuevo Propietario:</label>
          <input
            type="text"
            id="newOwner"
            name="newOwner"
            value={formData.newOwner}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reason">Motivo del Cambio:</label>
          <select
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un motivo</option>
            {reasons.map(reason => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="fromDate">Desde:</label>
          <input
            type="date"
            id="fromDate"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="toDate">Hasta:</label>
          <input
            type="date"
            id="toDate"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">Registrar Cambio de Equipo</button>
      </form>
    </div>
  );
}

export default EquipmentChangeForm;