import React, { useState } from 'react';
import './EquipmentForm.css';

function EquipmentForm() {
  const [formData, setFormData] = useState({
    model: '',
    serialNumber: '',
    initialOwner: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Equipo registrado:', formData);
    
    
    setFormData({
      model: '',
      serialNumber: '',
      initialOwner: '',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="equipment-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="model">Modelo:</label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="serialNumber">Número de Serie:</label>
          <input
            type="text"
            id="serialNumber"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="initialOwner">Propietario Inicial:</label>
          <input
            type="text"
            id="initialOwner"
            name="initialOwner"
            value={formData.initialOwner}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="purchaseDate">Fecha de Compra:</label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">Registrar Equipo</button>
      </form>
    </div>
  );
}

export default EquipmentForm;