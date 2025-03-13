import React, { useState } from 'react';
import './ObjectChangeForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addObjectChange, getObjectChanges } from '../../data/objectChangesStore';
import { exportToExcel } from '../../utils/exportUtils';

function ObjectChangeForm() {
  const [formData, setFormData] = useState({
    location: '',
    personName: '',
    objectType: '',
    otherObject: '',
    date: new Date().toISOString().split('T')[0]
  });
  
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
      <form onSubmit={handleSubmit}>
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
              value={formData.otherObject}
              onChange={handleChange}
              required
              placeholder="Describa el objeto entregado"
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="date">
            <FontAwesomeIcon icon={['fas', 'calendar-alt']} className="form-field-icon" />
            Fecha:
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">
          <FontAwesomeIcon icon={['fas', 'save']} /> 
          Registrar Cambio
        </button>
      </form>
      <div className="section-actions">
        <button 
          className="btn btn-accent"
          onClick={() => {
            const objectChanges = getObjectChanges();
            exportToExcel(objectChanges);
          }}
        >
          <FontAwesomeIcon icon={['fas', 'file-export']} />
          Exportar a Excel
        </button>
      </div>
    </div>
  );
}

export default ObjectChangeForm;