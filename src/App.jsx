import { useState, useEffect } from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Navbar from './components/common/Navbar'
import ObjectChangeForm from './components/ObjectChange/ObjectChangeForm'
import ObjectChangeList from './components/ObjectChange/ObjectChangeList'
import EquipmentForm from './components/EquipmentChange/EquipmentForm'
import EquipmentList from './components/EquipmentChange/EquipmentList'
import EquipmentChangeForm from './components/EquipmentChange/EquipmentChangeForm'

function App() {
  const [activeTab, setActiveTab] = useState('objectChanges')

  
  useEffect(() => {
    const titles = {
      objectChanges: 'Cambio de Objetos',
      equipmentRegistry: 'Registro de Equipos',
      equipmentChanges: 'Cambio de Equipos'
    }
    document.title = `ARCO | ${titles[activeTab] || 'Registro de Cambios'}`
  }, [activeTab])

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
                <button className="btn btn-accent">
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
                <button className="btn btn-accent">
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
                <button className="btn btn-accent">
                  <FontAwesomeIcon icon={['fas', 'file-export']} />
                  Exportar a Excel
                </button>
              </div>
            </div>
            <EquipmentChangeForm />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
