import React, { useState, useEffect } from 'react';
import './EquipmentChangeForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getEquipment } from '../../data/equipmentStore';
import { addEquipmentChange } from '../../data/equipmentChangesStore';
import DatePickerField from '../common/DatePickerField';
import AnimatedContainer from '../common/AnimatedContainer';

const EquipmentChangeForm = () => {
  const [equipment, setEquipment] = useState([]);
  
  const [formData, setFormData] = useState({
    equipmentId: '',
    previousOwner: '',
    newOwner: '',
    reason: '',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: 'Presente' // Por defecto "Presente" para el propietario actual
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  
  
  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const data = await getEquipment();
        if (Array.isArray(data)) {
          setEquipment(data);
        } else {
          console.error("Los datos de equipo no son un array:", data);
          setEquipment([]); 
        }
      } catch (error) {
        console.error("Error al cargar equipos:", error);
        setEquipment([]);
      }
    };
    
    loadEquipment();
  }, []);
  
  const reasons = [
    'Actualización', 
    'Daño', 
    'Reasignación',
    'Retiro',
    'Otro'
  ];
  
  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    // Si se selecciona un equipo, cargar su propietario actual
    if (name === 'equipmentId' && value) {
      try {
        const selectedEq = equipment.find(eq => eq.id === value);
        if (selectedEq) {
          setSelectedEquipment(selectedEq);
          setFormData(prev => ({
            ...prev,
            previousOwner: selectedEq.currentOwner || selectedEq.initialOwner || '',
            equipmentId: value
          }));
        }
      } catch (error) {
        console.error('Error al cargar datos del equipo:', error);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear objeto de cambio completo
    const changeData = {
      ...formData,
      // Asegurar que toDate sea "Presente" si está vacío
      toDate: formData.toDate || 'Presente'
    };
    
    addEquipmentChange(changeData)
      .then(() => {
        const equipName = selectedEquipment ? selectedEquipment.model : 'Equipo';
        setSuccessMessage(`Cambio de "${equipName}" registrado correctamente`);
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        
        // Resetear formulario
        setFormData({
          equipmentId: '',
          previousOwner: '',
          newOwner: '',
          reason: '',
          fromDate: new Date().toISOString().split('T')[0],
          toDate: 'Presente'
        });
        setSelectedEquipment(null);
      })
      .catch(error => {
        alert(`Error al registrar cambio: ${error.message}`);
      });
  };
  
  return (
    <AnimatedContainer animation="slide-up" className="equipment-change-form form-fade-in">
      <h3 className="form-title">
        <FontAwesomeIcon icon="exchange" className="form-icon" />
        Nuevo cambio de equipo
      </h3>
      
      {successMessage && (
        <div className="success-message">
          <FontAwesomeIcon icon="check-circle" />
          {successMessage}
          <span className="message-progress"></span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="floating-form">
        <div className="form-group">
          <label htmlFor="equipmentId">
            <FontAwesomeIcon icon="laptop" className="form-field-icon" />
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
            {Array.isArray(equipment) ? equipment.map(eq => (
              <option key={eq.id} value={eq.id}>
                {eq.model} - {eq.inventoryNumber || 'Sin número de inventario'}
              </option>
            )) : <option value="">No hay equipos disponibles</option>}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="previousOwner">
            <FontAwesomeIcon icon="user" className="form-field-icon" />
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
            <FontAwesomeIcon icon="user" className="form-field-icon" />
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
            <FontAwesomeIcon icon="clipboard" className="form-field-icon" />
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
          <FontAwesomeIcon icon="save" />
          Registrar Cambio
        </button>
      </form>
    </AnimatedContainer>
  );
};

export default EquipmentChangeForm;