import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from './components/common/Navbar';
import ObjectChangeForm from './components/ObjectChange/ObjectChangeForm';
import ObjectChangeList from './components/ObjectChange/ObjectChangeList';
import EquipmentForm from './components/EquipmentChange/EquipmentForm';
import EquipmentList from './components/EquipmentChange/EquipmentList';
import EquipmentChangeForm from './components/EquipmentChange/EquipmentChangeForm';
import EquipmentChangeList from './components/EquipmentChange/EquipmentList';
import AnimatedContainer from './components/common/AnimatedContainer';
import LockStatus from './components/common/LockStatus';
import StatusBar from './components/common/StatusBar';
import Debug from './components/common/Debug';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  exportToExcel as exportEquipment 
} from './data/equipmentStore';
import { 
  exportToExcel as exportObjectChanges 
} from './data/objectChangesStore';
import { 
  exportToExcel as exportEquipmentChanges 
} from './data/equipmentChangesStore';
import { initErrorHandler } from './utils/errorHandler';
import EquipmentHistory from './components/EquipmentChange/EquipmentHistory';
import TonerManagementPage from './pages/TonerManagementPage';

initErrorHandler();

function App() {
  const [activeTab, setActiveTab] = useState('objectChanges');
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  
  useEffect(() => {
    const checkConnection = async () => {
      if (window.electron) {
        try {
          const result = await window.electron.invoke('check-connection');
          setIsConnected(result.connected);
          if (!result.connected) {
            console.error('Error de conexión:', result.error);
          }
        } catch (error) {
          setIsConnected(false);
          console.error('Error al verificar conexión:', error);
        }
      }
      
      setIsInitialized(true);
    };
    
    checkConnection();
    
    const interval = setInterval(checkConnection, 30000); 
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const testExcelAccess = async () => {
      if (window.electron) {
        try {
          const testData = [{ id: 'test1', value: 'Test Data ' + new Date().toISOString() }];
          const result = await window.electron.invoke('save-excel-data', {
            fileName: 'test.xlsx',
            sheet: 'Test',
            data: testData
          });
          
          console.log('Excel write test result:', result);
          
          const readResult = await window.electron.invoke('load-excel-data', {
            fileName: 'test.xlsx',
            sheet: 'Test'
          });
          
          console.log('Excel read test result:', readResult);
        } catch (error) {
          console.error('Excel access test failed:', error);
        }
      }
    };
    
    if (isConnected) {
      testExcelAccess();
    }
  }, [isConnected]);

  useEffect(() => {
    if (location.pathname === '/toner-management') {
      setActiveTab('tonerManagement');
    }
  }, [location.pathname]);
  
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'tonerManagement') {
      navigate('/toner-management');
    } else {
      navigate('/');
    }
  };

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

  if (!isInitialized) {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: '#3a5a99'
    }}>Cargando ARCO...</div>;
  }
  
  if (!isConnected) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: '#f44336',
      gap: '1rem',
      padding: '2rem'
    }}>
      <FontAwesomeIcon icon={['fas', 'exclamation-triangle']} size="3x" />
      <h2>Error de conexión</h2>
      <p style={{ textAlign: 'center' }}>No se ha podido conectar con la carpeta compartida P:\ArcoData.</p>
      <p style={{ textAlign: 'center' }}>Verifique que la unidad P: está correctamente mapeada y accesible.</p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#3a5a99',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Reintentar conexión
      </button>
    </div>;
  }

  return (
    <div className={`app ${theme}`}>
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />
      
       <main className="content">
        <Routes>
          <Route path="/toner-management" element={<TonerManagementPage />} />
          <Route path="/" element={
            <>
              {activeTab === 'objectChanges' && (
                <AnimatedContainer animation="slide-up">
                  <div className="object-changes-container">
                    <div className="section-header">
                      <h2 className="section-title">
                        <FontAwesomeIcon icon={['fas', 'box']} />
                        Registro de Cambio de Objetos
                      </h2>
                    </div>
                    
                    <AnimatedContainer animation="slide-in-right" delay={0.1}>
                      <ObjectChangeForm />
                    </AnimatedContainer>
                    
                    <AnimatedContainer animation="slide-in-right" delay={0.2}>
                      <ObjectChangeList />
                    </AnimatedContainer>
                  </div>
                </AnimatedContainer>
              )}
              
              {activeTab === 'equipmentRegistry' && (
                <AnimatedContainer animation="slide-up">
                  <div className="equipment-registry-container fade-in">
                    <div className="section-header">
                      <h2 className="section-title">
                        <FontAwesomeIcon icon={['fas', 'laptop']} />
                        Registro de Equipos
                      </h2>
                    </div>
                    <EquipmentForm />
                    <EquipmentList />
                  </div>
                </AnimatedContainer>
              )}
              
              {activeTab === 'equipmentChanges' && (
                <AnimatedContainer animation="slide-up">
                  <div className="equipment-changes-container fade-in">
                    <div className="section-header">
                      <h2 className="section-title">
                        <FontAwesomeIcon icon={['fas', 'exchange']} />
                        Registro de Cambios de Equipos
                      </h2>
                    </div>
                    <EquipmentChangeForm />
                    <EquipmentChangeList />
                  </div>
                </AnimatedContainer>
              )}
            </>
          } />
        </Routes>
      </main>
      
      <StatusBar />
      <Debug />
    </div>
  );
}

export default App;
