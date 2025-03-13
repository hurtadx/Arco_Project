import { useState, useEffect } from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Navbar from './components/common/Navbar'
import ObjectChangeForm from './components/ObjectChange/ObjectChangeForm'
import ObjectChangeList from './components/ObjectChange/ObjectChangeList'
import EquipmentForm from './components/EquipmentChange/EquipmentForm'
import EquipmentList from './components/EquipmentChange/EquipmentList'
import EquipmentChangeForm from './components/EquipmentChange/EquipmentChangeForm'
import Debug from './components/common/Debug'  // Importar el nuevo componente

// Importar las funciones de los stores
import { getObjectChanges, exportToExcel as exportObjectChanges } from './data/objectChangesStore'
import { getEquipment, exportToExcel as exportEquipment } from './data/equipmentStore'
import { getEquipmentChanges, exportToExcel as exportEquipmentChanges } from './data/equipmentChangesStore'

console.log("App component loading...");

function App() {
  console.log("App function called");
  const [activeTab, setActiveTab] = useState('objectChanges')
  const [isInitialized, setIsInitialized] = useState(false)
  
  console.log("App rendered with activeTab:", activeTab);

  // Inicializar la aplicación
  useEffect(() => {
    console.log("App initialization effect running");
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    console.log("Title effect running for tab:", activeTab);
    const titles = {
      objectChanges: 'Cambio de Objetos',
      equipmentRegistry: 'Registro de Equipos',
      equipmentChanges: 'Cambio de Equipos'
    }
    document.title = `ARCO | ${titles[activeTab] || 'Registro de Cambios'}`
    
    // Manejar eventos de navegación
    const handleNavigate = (event) => {
      if (event.detail && titles[event.detail]) {
        setActiveTab(event.detail);
      }
    };
    
    window.addEventListener('navigate', handleNavigate);
    
    return () => {
      window.removeEventListener('navigate', handleNavigate);
    };
  }, [activeTab])

  const handleExport = (type) => {
    console.log("Export requested for:", type);
    try {
      if (type === 'objectChanges') {
        exportObjectChanges();
      } else if (type === 'equipment') {
        exportEquipment();
      } else if (type === 'equipmentChanges') {
        exportEquipmentChanges();
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert(`Error al exportar datos: ${error.message}`);
    }
  };

  // Si no está inicializado, mostrar mensaje de carga simple
  if (!isInitialized) {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: '#3a5a99'
    }}>Cargando ARCO...</div>;
  }

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="content">
        {activeTab === 'objectChanges' && (
          <div className="object-changes-container fade-in">
            <div className="section-header">
              <h2 className="section-title">
                <FontAwesomeIcon icon={['fas', 'box']} />
                Registro de Cambio de Objetos
              </h2>
              <div className="section-actions">
                <button 
                  className="btn btn-accent"
                  onClick={() => handleExport('objectChanges')}
                >
                  <FontAwesomeIcon icon={['fas', 'file-export']} />
                  Exportar a Excel
                </button>
              </div>
            </div>
            <ObjectChangeForm />
            <ObjectChangeList />
          </div>
        )}
        
        {activeTab === 'equipmentRegistry' && (
          <div className="equipment-registry-container fade-in">
            <div className="section-header">
              <h2 className="section-title">
                <FontAwesomeIcon icon={['fas', 'laptop']} />
                Registro de Equipos
              </h2>
              <div className="section-actions">
                <button 
                  className="btn btn-accent"
                  onClick={() => handleExport('equipment')}
                >
                  <FontAwesomeIcon icon={['fas', 'file-export']} />
                  Exportar a Excel
                </button>
              </div>
            </div>
            <EquipmentForm />
            <EquipmentList />
          </div>
        )}
        
        {activeTab === 'equipmentChanges' && (
          <div className="equipment-changes-container fade-in">
            <div className="section-header">
              <h2 className="section-title">
                <FontAwesomeIcon icon={['fas', 'exchange']} />
                Registro de Cambio de Equipos
              </h2>
              <div className="section-actions">
                <button 
                  className="btn btn-accent"
                  onClick={() => handleExport('equipmentChanges')}
                >
                  <FontAwesomeIcon icon={['fas', 'file-export']} />
                  Exportar a Excel
                </button>
              </div>
            </div>
            <EquipmentChangeForm />
          </div>
        )}
      </main>
      
      {/* Añadir el componente de depuración */}
      <Debug />
    </div>
  )
}

export default App
