import React, { useState } from 'react';
import './EquipmentForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addEquipment } from '../../../data/equipmentStore';
import DatePickerField from '../common/DatePickerField';
import AnimatedContainer from '../common/AnimatedContainer';

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
    <AnimatedContainer animation="slide-up" className="equipment-form form-fade-in">
      <h3 className="form-title">
        <FontAwesomeIcon icon={['fas', 'plus']} className="form-icon" />
        Nuevo equipo
      </h3>
      
      {successMessage && (
        <div className="success-message">
          <FontAwesomeIcon icon={['fas', 'check-circle']} />
          {successMessage}
          <span className="message-progress"></span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="floating-form">
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
            
            className="enhanced-input"
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
            className="enhanced-input"
            required
          />
        </div>
        
        <DatePickerField
          label="Fecha de Compra"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          required={true}
          maxDate={new Date()}
        />
        
        <button type="submit" className="submit-btn">
          <FontAwesomeIcon icon={['fas', 'save']} />
          Registrar Equipo
        </button>
      </form>
    </AnimatedContainer>
  );
}

export default EquipmentForm;