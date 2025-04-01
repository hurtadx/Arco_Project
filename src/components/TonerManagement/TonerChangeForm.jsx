import React, { useState, useEffect } from 'react';
import './TonerChangeForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getPrinterById } from '../../data/printerStore';
import { addTonerChange, getTonerChangesByPrinterId } from '../../data/tonerChangeStore';
import DatePickerField from '../common/DatePickerField';
import AnimatedContainer from '../common/AnimatedContainer';

function TonerChangeForm({ printerId, onClose, onSaved }) {
  const [printer, setPrinter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    pageCount: '',
    changeDate: new Date().toISOString().split('T')[0],
    changedBy: '',
    notes: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [lastTonerChange, setLastTonerChange] = useState(null);

  
  useEffect(() => {
    const loadPrinterData = async () => {
      try {
        setLoading(true);
        
        const printerData = await getPrinterById(printerId);
        if (!printerData) {
          throw new Error('Impresora no encontrada');
        }
        setPrinter(printerData);
        
        
        const tonerChanges = await getTonerChangesByPrinterId(printerId);
        if (tonerChanges && tonerChanges.length > 0) {
          
          const byDate = [...tonerChanges].sort(
            (a, b) => new Date(b.changeDate) - new Date(a.changeDate)
          );
          
          
          const byCounter = [...tonerChanges].sort(
            (a, b) => parseInt(b.pageCount) - parseInt(a.pageCount)
          );
          
          
          
          const recentByDate = byDate.slice(0, 3);
          let highestCounter = null;
          let highestValue = -1;
          
          for (const change of recentByDate) {
            const count = parseInt(change.pageCount);
            if (count > highestValue) {
              highestValue = count;
              highestCounter = change;
            }
          }
          
          
          setLastTonerChange(highestCounter || byCounter[0]);
          
          
          console.log('Usando contador previo:', highestCounter || byCounter[0]);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar los datos de la impresora');
      } finally {
        setLoading(false);
      }
    };
    
    if (printerId) {
      loadPrinterData();
    }
  }, [printerId]);

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
      const changeData = {
        printerId,
        printerModel: printer.model,
        pageCount: parseInt(formData.pageCount, 10) || 0,
        changeDate: formData.changeDate,
        tonerType: printer.tonerType,
        changedBy: formData.changedBy,
        notes: formData.notes
      };
      
      await addTonerChange(changeData);
      
      setSuccessMessage(`Cambio de toner registrado correctamente`);
      
      setTimeout(() => {
        setSuccessMessage('');
        if (onSaved) onSaved();
      }, 2000);
      
    } catch (error) {
      console.error('Error al registrar cambio de toner:', error);
      alert('Error al registrar: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="toner-change-form loading">
        <FontAwesomeIcon icon="spinner" spin size="2x" />
        <p>Cargando datos de la impresora...</p>
      </div>
    );
  }

  return (
    <AnimatedContainer animation="fade-in" className="toner-change-form">
      <div className="form-header">
        <h3 className="form-title">
          <FontAwesomeIcon icon="tint" className="form-icon" />
          Registrar cambio de toner
        </h3>
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon="times" />
        </button>
      </div>
      
      {successMessage && (
        <div className="success-message">
          <FontAwesomeIcon icon="check-circle" />
          {successMessage}
        </div>
      )}
      
      <div className="printer-info">
        <h4>Información de la impresora</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Modelo:</span>
            <span className="info-value">{printer.model}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Ubicación:</span>
            <span className="info-value">{printer.location}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Propietario:</span>
            <span className="info-value">{printer.owner}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tipo de toner:</span>
            <span className="info-value">{printer.tonerType}</span>
          </div>
          {lastTonerChange && (
            <div className="info-item full-width">
              <span className="info-label">Último contador:</span>
              <span className="info-value counter-value">{lastTonerChange.pageCount.toLocaleString()} páginas</span>
              <span className="info-date">({new Date(lastTonerChange.changeDate).toLocaleDateString()})</span>
            </div>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="floating-form">
        <div className="form-group">
          <label htmlFor="pageCount">
            <FontAwesomeIcon icon="file-alt" className="form-field-icon" />
            Contador actual:
          </label>
          <input
            type="number"
            id="pageCount"
            name="pageCount"
            value={formData.pageCount}
            onChange={handleChange}
            placeholder="Número de páginas"
            className="enhanced-input"
            required
            min="0"
          />
          {lastTonerChange && parseInt(formData.pageCount) < lastTonerChange.pageCount && (
            <div className="warning-message">
              <FontAwesomeIcon icon="exclamation-triangle" />
              Contador menor que el anterior ({lastTonerChange.pageCount})
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="changedBy">
            <FontAwesomeIcon icon="user" className="form-field-icon" />
            Realizado por:
          </label>
          <input
            type="text"
            id="changedBy"
            name="changedBy"
            value={formData.changedBy}
            onChange={handleChange}
            placeholder="Nombre de quien realizó el cambio"
            className="enhanced-input"
            required
          />
        </div>
        
        <DatePickerField
          label="Fecha de cambio"
          name="changeDate"
          value={formData.changeDate}
          onChange={handleChange}
          required={true}
          maxDate={new Date()}
        />
        
        <div className="form-group notes-group">
          <label htmlFor="notes">
            <FontAwesomeIcon icon="sticky-note" className="form-field-icon" />
            Notas: <span className="optional-label">(Opcional)</span>
          </label>
          <input
            type="text"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Observaciones breves"
            className="enhanced-input"
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            <FontAwesomeIcon icon="times" /> Cancelar
          </button>
          <button type="submit" className="submit-btn">
            <FontAwesomeIcon icon="save" /> Registrar cambio
          </button>
        </div>
      </form>
    </AnimatedContainer>
  );
}

export default TonerChangeForm;