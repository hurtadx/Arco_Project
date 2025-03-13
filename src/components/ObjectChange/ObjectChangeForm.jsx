import React, { useState } from 'react';
import './ObjectChangeForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addObjectChange } from '../../data/objectChangesStore';
import DatePickerField from '../common/DatePickerField';

function ObjectChangeForm() {
  const [formData, setFormData] = useState({
    location: '',
    personName: '',
    objectType: '',
    otherObject: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [showOtherField, setShowOtherField] = useState(false);
  
  const locations = ['Administración', 'Extrusión', 'Producción', 'Logística', 'Otro'];
  const objectTypes = ['Teléfono', 'Mousepad', 'Pantalla', 'Garra de Pantalla', 'Teclado', 'Mouse', 'Otro'];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'objectType' && value === 'Otro') {
      setShowOtherField(true);
    } else if (name === 'objectType') {
      setShowOtherField(false);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    const changeData = {
      ...formData,
      objectType: formData.objectType === 'Otro' ? formData.otherObject : formData.objectType,
      timestamp: new Date().toISOString()
    };
    
    
    addObjectChange(changeData);
    
    
    setSuccessMessage(`¡Cambio registrado correctamente!`);
    
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    
    
    setFormData({
      location: '',
      personName: '',
      objectType: '',
      otherObject: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowOtherField(false);
  };
  
  return (
    <div className="object-change-form form-fade-in">
      <h3 className="form-title">
        <FontAwesomeIcon icon={['fas', 'plus']} className="form-icon" /> 
        Nuevo registro
      </h3>
      
      {successMessage && (
        <div className="success-message">
          <FontAwesomeIcon icon={['fas', 'check-circle']} />
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="floating-form">
        <div className="form-group">
          <label htmlFor="location">
            <FontAwesomeIcon icon={['fas', 'building']} className="form-field-icon" />
            Lugar:
          </label>
          <select 
            id="location" 
            name="location" 
            value={formData.location} 
            onChange={handleChange}
            className="enhanced-select"
            required
          >
            <option value="">Seleccione un lugar</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="personName">
            <FontAwesomeIcon icon={['fas', 'user']} className="form-field-icon" />
            Nombre de la Persona <span className="optional-label">(Opcional)</span>:
          </label>
          <input
            type="text"
            id="personName"
            name="personName"
            className="enhanced-input"
            value={formData.personName}
            onChange={handleChange}
            placeholder="Nombre de la persona que recibe"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="objectType">
            <FontAwesomeIcon icon={['fas', 'box']} className="form-field-icon" />
            Objeto:
          </label>
          <select 
            id="objectType" 
            name="objectType" 
            value={formData.objectType} 
            onChange={handleChange}
            className="enhanced-select"
            required
          >
            <option value="">Seleccione un objeto</option>
            {objectTypes.map(obj => (
              <option key={obj} value={obj}>{obj}</option>
            ))}
          </select>
        </div>
        
        {showOtherField && (
          <div className="form-group fade-in">
            <label htmlFor="otherObject">
              <FontAwesomeIcon icon={['fas', 'pencil-alt']} className="form-field-icon" />
              Especifique el Objeto:
            </label>
            <input
              type="text"
              id="otherObject"
              name="otherObject"
              className="enhanced-input"
              value={formData.otherObject}
              onChange={handleChange}
              required
              placeholder="Describa el objeto entregado"
            />
          </div>
        )}
        
        <DatePickerField
          label="Fecha"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required={true}
          maxDate={new Date()} 
          yearDropdownItemNumber={15} 
        />
        
        <button type="submit" className="submit-btn">
          <FontAwesomeIcon icon={['fas', 'save']} /> 
          Registrar Cambio
        </button>
      </form>
    </div>
  );
}

export default ObjectChangeForm;