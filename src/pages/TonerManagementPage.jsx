import React, { useState } from 'react';
import PrinterList from '../components/TonerManagement/Printer/List/PrinterList';
import PrinterForm from '../components/TonerManagement/Printer/Form/PrinterForm';
import AnimatedContainer from '../components/common/AnimatedContainer/AnimatedContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TonerManagementPage.css';

function TonerManagementPage() {
  const [showAddPrinter, setShowAddPrinter] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  
  const handleAddPrinterClick = () => {
    setShowAddPrinter(true);
    setSelectedPrinter(null);
  };
  
  const handlePrinterAdded = () => {
    setShowAddPrinter(false);
  };
  
  const handleEditPrinter = (printer) => {
    setSelectedPrinter(printer);
    setShowAddPrinter(true);
  };
  
  const handleCloseForm = () => {
    setShowAddPrinter(false);
    setSelectedPrinter(null);
  };
  
  return (
    <AnimatedContainer animation="fade-in" className="toner-management-page">
      <div className="page-header">
        <h2>
          <FontAwesomeIcon icon="tint" className="page-icon" />
          Gestión de Toners
        </h2>
        <button 
          className="btn btn-primary" 
          onClick={handleAddPrinterClick}
        >
          <FontAwesomeIcon icon="plus" /> Añadir Impresora
        </button>
      </div>
      
      {showAddPrinter ? (
        <PrinterForm 
          onPrinterAdded={handlePrinterAdded} 
          onClose={handleCloseForm} 
          printerToEdit={selectedPrinter}
        />
      ) : (
        <PrinterList onEditPrinter={handleEditPrinter} />
      )}
    </AnimatedContainer>
  );
}

export default TonerManagementPage;