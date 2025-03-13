import React, { useState, useEffect } from 'react';
import './EquipmentChangeForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getEquipment } from '../../data/equipmentStore';
import { addEquipmentChange } from '../../data/equipmentChangesStore';
import DatePickerField from '../common/DatePickerField';
import AnimatedContainer from '../common/AnimatedContainer';

function EquipmentChangeForm() {
  const [equipment, setEquipment] = useState([]);
  
  const [formData, setFormData] = useState({
    equipmentId: '',
    previousOwner: '',
    newOwner: '',
    reason: '',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: ''
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  
  
  useEffect(() => {
    const loadedEquipment = getEquipment();
    setEquipment(loadedEquipment);
    
    
    const interval = setInterval(() => {
      setEquipment(getEquipment());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const reasons = [
    'Actualización', 
    'Daño', 
    'Reasignación',
    'Retiro',
    'Otro'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'equipmentId' && value) {
      const found = equipment.find(eq => eq.id === value);
      setSelectedEquipment(found);
      
      
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
        previousOwner: found ? found.initialOwner : ''
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    const changeData = addEquipmentChange(formData);
    
    
    const equipName = selectedEquipment ? selectedEquipment.model : 'Equipo';
    setSuccessMessage(`Cambio de "${equipName}" registrado correctamente`);
    
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    
    
    setFormData({
      equipmentId: '',
      previousOwner: '',
      newOwner: '',
      reason: '',
      fromDate: new Date().toISOString().split('T')[0],
      toDate: ''
    });
    setSelectedEquipment(null);
  };
  
  return (
    <AnimatedContainer animation="slide-up" className="equipment-change-form form-fade-in">
      <h3 className="form-title">
        <FontAwesomeIcon icon={['fas', 'exchange']} className="form-icon" />
        Nuevo cambio de equipo
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
          <label htmlFor="equipmentId">
            <FontAwesomeIcon icon={['fas', 'laptop']} className="form-field-icon" />
            Equipo:
          </label>
          <select
            id="equipmentId"
            name="equipmentId"
            value={formData.equipmentId}
            onChange={handleChange}
            required
            className="enhanced-select"
          >
            <option value="">Seleccione un equipo</option>
            {equipment.map(eq => (
              <option key={eq.id} value={eq.id}>{eq.model}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="previousOwner">
            <FontAwesomeIcon icon={['fas', 'user']} className="form-field-icon" />
            Propietario Anterior:
          </label>
          <input
            type="text"
            id="previousOwner"
            name="previousOwner"
            value={formData.previousOwner}
            onChange={handleChange}
            placeholder="Nombre del propietario anterior"
            required
            className="enhanced-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="newOwner">
            <FontAwesomeIcon icon={['fas', 'user']} className="form-field-icon" />
            Nuevo Propietario:
          </label>
          <input
            type="text"
            id="newOwner"
            name="newOwner"
            value={formData.newOwner}
            onChange={handleChange}
            placeholder="Nombre del nuevo propietario"
            required
            className="enhanced-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reason">
            <FontAwesomeIcon icon={['fas', 'clipboard']} className="form-field-icon" />
            Motivo del Cambio:
          </label>
          <select
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="enhanced-select"
          >
            <option value="">Seleccione un motivo</option>
            {reasons.map(reason => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group half-width">
            <DatePickerField
              label="Desde"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              required={true}
              maxDate={new Date()}
            />
          </div>
          
          <div className="form-group half-width">
            <DatePickerField
              label="Hasta"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              optional={true}
              minDate={formData.fromDate ? new Date(formData.fromDate) : null}
              allowFutureDates={true} 
            />
          </div>
        </div>
        
        <button type="submit" className="submit-btn">
          <FontAwesomeIcon icon={['fas', 'save']} />
          Registrar Cambio
        </button>
      </form>
    </AnimatedContainer>
  );
}

export default EquipmentChangeForm;