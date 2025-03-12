import { useState } from 'react'
import './App.css'
import Navbar from './components/common/Navbar'
import ObjectChangeForm from './components/ObjectChange/ObjectChangeForm'
import ObjectChangeList from './components/ObjectChange/ObjectChangeList'
import EquipmentForm from './components/EquipmentChange/EquipmentForm'
import EquipmentList from './components/EquipmentChange/EquipmentList'
import EquipmentChangeForm from './components/EquipmentChange/EquipmentChangeForm'

function App() {
  const [activeTab, setActiveTab] = useState('objectChanges')

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="content">
        {activeTab === 'objectChanges' && (
          <div className="object-changes-container">
            <h2>Registro de Cambio de Objetos</h2>
            <ObjectChangeForm />
            <ObjectChangeList />
          </div>
        )}
        
        {activeTab === 'equipmentRegistry' && (
          <div className="equipment-registry-container">
            <h2>Registro de Equipos</h2>
            <EquipmentForm />
            <EquipmentList />
          </div>
        )}
        
        {activeTab === 'equipmentChanges' && (
          <div className="equipment-changes-container">
            <h2>Registro de Cambio de Equipos</h2>
            <EquipmentChangeForm />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
