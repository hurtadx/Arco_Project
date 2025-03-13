import React, { useState } from 'react';
import './EquipmentForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addEquipment } from '../../data/equipmentStore';

function EquipmentForm() {
  const [formData, setFormData] = useState({
    model: '',
    initialOwner: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });
  
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    const newEquipment = addEquipment(formData);
    
    
    setSuccessMessage(`Equipo "${formData.model}" registrado correctamente`);
    
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    
    
    setFormData({
      model: '',
      initialOwner: '',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="equipment-form form-fade-in">
      <h3 className="form-title">
        <FontAwesomeIcon icon={['fas', 'plus']} className="form-icon" />
        Nuevo equipo
      </h3>
      
      {successMessage && (
        <div className="success-message">
          <FontAwesomeIcon icon={['fas', 'check']} />
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="model">
            <FontAwesomeIcon icon={['fas', 'laptop']} className="form-field-icon" />
            Modelo:
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Ej: Laptop Dell XPS 13"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="initialOwner">
            <FontAwesomeIcon icon={['fas', 'user']} className="form-field-icon" />
            Propietario Inicial:
          </label>
          <input
            type="text"
            id="initialOwner"
            name="initialOwner"
            value={formData.initialOwner}
            onChange={handleChange}
            placeholder="Nombre del propietario inicial"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="purchaseDate">
            <FontAwesomeIcon icon={['fas', 'calendar-alt']} className="form-field-icon" />
            Fecha de Compra:
          </label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">
          <FontAwesomeIcon icon={['fas', 'save']} />
          Registrar Equipo
        </button>
      </form>
    </div>
  );
}

export default EquipmentForm;