import React, { useState, useEffect } from 'react';
import './PrinterForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addPrinter, updatePrinter } from '../../../../data/printerStore';
import AnimatedContainer from '../common/AnimatedContainer';

function PrinterForm({ onPrinterAdded, onClose, printerToEdit }) {
  const [formData, setFormData] = useState({
    model: '',
    location: '',
    owner: '',
    tonerType: '',
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  
  useEffect(() => {
    if (printerToEdit) {
      setFormData({
        model: printerToEdit.model || '',
        location: printerToEdit.location || '',
        owner: printerToEdit.owner || '',
        tonerType: printerToEdit.tonerType || '',
      });
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [printerToEdit]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updatePrinter(printerToEdit.id, formData);
        setSuccessMessage(`Impresora "${formData.model}" actualizada correctamente`);
      } else {
        await addPrinter(formData);
        setSuccessMessage(`Impresora "${formData.model}" registrada correctamente`);
      }
      
      setTimeout(() => {
        setSuccessMessage('');
        onPrinterAdded();
      }, 2000);
      
    } catch (error) {
      console.error('Error al guardar impresora:', error);
      alert('Error al guardar: ' + error.message);
    }
  };
  
  return (
    <AnimatedContainer animation="fade-in" className="printer-form">
      <div className="form-header">
        <h3 className="form-title">
          <FontAwesomeIcon icon="print" className="form-icon" />
          {isEditing ? 'Editar impresora' : 'Nueva impresora'}
        </h3>
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon="times" />
        </button>
      </div>
      
      {successMessage && (
        <div className="success-message">
          <FontAwesomeIcon icon={['fas', 'check-circle']} />
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="floating-form">
        <div className="form-group">
          <label htmlFor="model">
            <FontAwesomeIcon icon="print" className="form-field-icon" />
            Modelo:
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Modelo de impresora"
            className="enhanced-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">
            <FontAwesomeIcon icon="map-marker-alt" className="form-field-icon" />
            Ubicación:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Ubicación o departamento"
            className="enhanced-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="owner">
            <FontAwesomeIcon icon="user" className="form-field-icon" />
            Propietario:
          </label>
          <input
            type="text"
            id="owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            placeholder="Nombre del responsable"
            className="enhanced-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tonerType">
            <FontAwesomeIcon icon="tint" className="form-field-icon" />
            Tipo de Toner:
          </label>
          <input
            type="text"
            id="tonerType"
            name="tonerType"
            value={formData.tonerType}
            onChange={handleChange}
            placeholder="Modelo de toner compatible"
            className="enhanced-input"
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            <FontAwesomeIcon icon="times" /> Cancelar
          </button>
          <button type="submit" className="submit-btn">
            <FontAwesomeIcon icon="save" /> {isEditing ? 'Guardar cambios' : 'Registrar impresora'}
          </button>
        </div>
      </form>
    </AnimatedContainer>
  );
}

export default PrinterForm;