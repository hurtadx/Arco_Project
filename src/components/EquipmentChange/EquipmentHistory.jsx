import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getChangesByEquipmentId } from '../../data/equipmentChangesStore';
import { getEquipmentById } from '../../data/equipmentStore';
import AnimatedContainer from '../common/AnimatedContainer';
import './EquipmentHistory.css';


const formatDateSafe = (dateString) => {
  try {
    if (!dateString) return "Fecha desconocida";
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return "Fecha inválida";
    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "Fecha inválida";
  }
};

const EquipmentHistory = ({ equipmentId, onClose }) => {
  const [equipment, setEquipment] = useState(null);
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const equipData = await getEquipmentById(equipmentId);
        if (!equipData) {
          throw new Error('Equipo no encontrado');
        }
        setEquipment(equipData);
        
        const changeHistory = await getChangesByEquipmentId(equipmentId);
        
        
        const validChanges = Array.isArray(changeHistory) 
          ? changeHistory
            .filter(change => change.fromDate && !isNaN(new Date(change.fromDate).getTime()))
            .sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate)) 
          : [];
        
        setChanges(validChanges);
        console.log("Cambios validados cargados en orden cronológico:", validChanges);
      } catch (err) {
        console.error('Error al cargar historial:', err);
        setError('No se pudo cargar el historial del equipo');
      } finally {
        setLoading(false);
      }
    };
    
    if (equipmentId) {
      loadData();
    }
  }, [equipmentId]);

  if (loading) {
    return (
      <div className="equipment-history loading">
        <FontAwesomeIcon icon="spinner" spin /> 
        <span>Cargando historial...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="equipment-history error">
        <FontAwesomeIcon icon="exclamation-circle" />
        <span>{error}</span>
        <button onClick={onClose} className="close-btn">
          <FontAwesomeIcon icon="times" />
        </button>
      </div>
    );
  }
  
  if (!equipment) {
    return (
      <div className="equipment-history error">
        <FontAwesomeIcon icon="exclamation-circle" />
        <span>Equipo no encontrado</span>
        <button onClick={onClose} className="close-btn">
          <FontAwesomeIcon icon="times" />
        </button>
      </div>
    );
  }

  
  const purchaseDate = equipment.purchaseDate && !isNaN(new Date(equipment.purchaseDate).getTime())
    ? new Date(equipment.purchaseDate)
    : new Date();

  return (
    <AnimatedContainer animation="fade-in" className="equipment-history">
      <div className="history-header">
        <h3>
          <FontAwesomeIcon icon="history" className="history-icon" />
          Historial de {equipment.model} {equipment.inventoryNumber ? `(${equipment.inventoryNumber})` : ''}
        </h3>
        <button onClick={onClose} className="close-btn">
          <FontAwesomeIcon icon="times" />
        </button>
      </div>
      
      <div className="current-status">
        <div className="status-item">
          <span className="status-label">Propietario Actual:</span> 
          <span className="status-value current-owner">
            <strong>{equipment.currentOwner || equipment.initialOwner || "Sin asignar"}</strong>
          </span>
        </div>
        
        <div className="status-item">
          <span className="status-label">Desde:</span>
          <span className="status-value">
            {changes && changes.length > 0 
              ? formatDateSafe(changes[changes.length-1].fromDate) 
              : formatDateSafe(equipment.purchaseDate)}
          </span>
        </div>
      </div>
      
      <div className="history-timeline">
        <div className="timeline-item initial">
          <div className="timeline-marker">
            <FontAwesomeIcon icon="star" />
          </div>
          <div className="timeline-content">
            <div className="timeline-header">
              <h4>Adquisición inicial</h4>
              <span className="timeline-date">
                {formatDateSafe(equipment.purchaseDate)}
              </span>
            </div>
            <div className="timeline-details">
              <p><strong>Propietario Inicial:</strong> {equipment.initialOwner || "No registrado"}</p>
              <p><strong>Periodo:</strong> {formatDateSafe(equipment.purchaseDate)} - 
                {changes && changes.length > 0 ? formatDateSafe(changes[0].fromDate) : "Presente"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Mostrar los cambios en orden cronológico */}
        {changes && changes.length > 0 ? changes.map((change, index) => {
          
          const nextChange = changes[index + 1]; 
          const endDate = nextChange ? formatDateSafe(nextChange.fromDate) : "Presente";
          
          return (
            <div key={change.id} className="timeline-item change">
              <div className="timeline-marker">
                <FontAwesomeIcon icon="exchange-alt" />
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>Cambio de propietario</h4>
                  <span className="timeline-date">
                    {formatDateSafe(change.fromDate)}
                  </span>
                </div>
                <div className="timeline-details">
                  <p><strong>De:</strong> {change.previousOwner}</p>
                  <p><strong>A:</strong> {change.newOwner}</p>
                  <p><strong>Motivo:</strong> {change.reason}</p>
                  <p><strong>Periodo:</strong> {formatDateSafe(change.fromDate)} - {endDate}</p>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="no-changes">
            <FontAwesomeIcon icon="info-circle" />
            <p>Este equipo no tiene cambios registrados.</p>
            <p>Propietario desde adquisición: {equipment.initialOwner || "No registrado"}</p>
            <p>Desde: {formatDateSafe(equipment.purchaseDate)} - Presente</p>
          </div>
        )}

       
        {changes && changes.length > 0 && (
          <div className="timeline-item current">
            <div className="timeline-marker current">
              <FontAwesomeIcon icon="user-check" />
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <h4>Propietario Actual</h4>
                <span className="timeline-date">
                  Presente
                </span>
              </div>
              <div className="timeline-details">
                <p><strong>Propietario:</strong> {equipment.currentOwner || equipment.initialOwner || "Sin asignar"}</p>
                <p><strong>Desde:</strong> {changes.length > 0 
                  ? formatDateSafe(changes[changes.length-1].fromDate) 
                  : formatDateSafe(equipment.purchaseDate)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
};

export default EquipmentHistory;