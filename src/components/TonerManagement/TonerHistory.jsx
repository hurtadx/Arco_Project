import React, { useState, useEffect } from 'react';
import './TonerHistory.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getPrinterById } from '../../data/printerStore';
import { getTonerStatsByPrinterId } from '../../data/tonerChangeStore';
import AnimatedContainer from '../common/AnimatedContainer';

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

function TonerHistory({ printerId, onClose }) {
  const [printer, setPrinter] = useState(null);
  const [tonerStats, setTonerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        
        const printerData = await getPrinterById(printerId);
        if (!printerData) {
          throw new Error('Impresora no encontrada');
        }
        setPrinter(printerData);
        
        
        const stats = await getTonerStatsByPrinterId(printerId);
        setTonerStats(stats);
      } catch (err) {
        console.error('Error al cargar historial de tóner:', err);
        setError('No se pudo cargar el historial de cambios de tóner');
      } finally {
        setLoading(false);
      }
    };
    
    if (printerId) {
      loadData();
    }
  }, [printerId]);

  if (loading) {
    return (
      <div className="toner-history loading">
        <FontAwesomeIcon icon="spinner" spin /> 
        <span>Cargando historial...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="toner-history error">
        <FontAwesomeIcon icon="exclamation-circle" />
        <span>{error}</span>
        <button onClick={onClose} className="close-btn">
          <FontAwesomeIcon icon="times" />
        </button>
      </div>
    );
  }
  
  if (!printer) {
    return (
      <div className="toner-history error">
        <FontAwesomeIcon icon="exclamation-circle" />
        <span>Impresora no encontrada</span>
        <button onClick={onClose} className="close-btn">
          <FontAwesomeIcon icon="times" />
        </button>
      </div>
    );
  }

  return (
    <AnimatedContainer animation="fade-in" className="toner-history">
      <div className="history-header">
        <h3>
          <FontAwesomeIcon icon="history" className="history-icon" />
          Historial de {printer.model} 
        </h3>
        <button onClick={onClose} className="close-btn">
          <FontAwesomeIcon icon="times" />
        </button>
      </div>
      
      <div className="printer-info-summary">
        <div className="info-item">
          <span className="info-label">Ubicación:</span>
          <span className="info-value">{printer.location}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Propietario:</span>
          <span className="info-value">{printer.owner}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Tipo de tóner:</span>
          <span className="info-value">{printer.tonerType}</span>
        </div>
      </div>
      
      <div className="toner-stats">
        <h4>Estadísticas de uso</h4>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon="tint" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{tonerStats.totalToners}</span>
              <span className="stat-label">Tóners usados</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon="file-alt" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{tonerStats.totalPages.toLocaleString()}</span>
              <span className="stat-label">Páginas impresas</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon="chart-line" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{tonerStats.avgPagesPerToner.toLocaleString()}</span>
              <span className="stat-label">Promedio páginas/tóner</span>
            </div>
          </div>
        </div>
        
        {tonerStats.lastChange && (
          <div className="last-change">
            <div className="last-change-header">
              <FontAwesomeIcon icon="clock" />
              <span>Último cambio:</span>
            </div>
            <div className="last-change-info">
              <div>
                <strong>Fecha:</strong> {formatDateSafe(tonerStats.lastChange.changeDate)}
              </div>
              <div>
                <strong>Contador:</strong> {tonerStats.lastChange.pageCount.toLocaleString()} páginas
              </div>
              <div>
                <strong>Realizado por:</strong> {tonerStats.lastChange.changedBy || "No registrado"}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="toner-history-timeline">
        <h4>Historial de cambios</h4>
        
        {tonerStats.changes && tonerStats.changes.length > 0 ? (
          <div className="timeline">
            {tonerStats.changes.map((change, index) => {
              const isFirst = index === 0;
              
              return (
                <div key={change.id} className="timeline-item">
                  <div className="timeline-marker">
                    <FontAwesomeIcon icon={isFirst ? "flag" : "tint"} />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h5>{isFirst ? "Primer registro" : `Cambio de tóner #${index}`}</h5>
                      <span className="timeline-date">{formatDateSafe(change.changeDate)}</span>
                    </div>
                    <div className="timeline-details">
                      <p>
                        <strong>Contador:</strong> {change.pageCount.toLocaleString()} páginas
                        {index > 0 && (
                          <span className="pages-printed">
                            <FontAwesomeIcon icon="print" />
                            {change.pagesPrinted.toLocaleString()} páginas impresas
                          </span>
                        )}
                      </p>
                      <p><strong>Realizado por:</strong> {change.changedBy || "No registrado"}</p>
                      {change.notes && <p><strong>Notas:</strong> {change.notes}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-changes">
            <FontAwesomeIcon icon="info-circle" />
            <p>Esta impresora no tiene cambios de tóner registrados.</p>
            <p>Registre un cambio para comenzar a generar estadísticas.</p>
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
}

export default TonerHistory;