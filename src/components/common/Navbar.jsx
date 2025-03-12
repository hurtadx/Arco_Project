import React from 'react'
import './Navbar.css'

function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">ARCO</h1>
      <ul className="nav-links">
        <li 
          className={activeTab === 'objectChanges' ? 'active' : ''} 
          onClick={() => setActiveTab('objectChanges')}
        >
          Cambio de Objetos
        </li>
        <li 
          className={activeTab === 'equipmentRegistry' ? 'active' : ''} 
          onClick={() => setActiveTab('equipmentRegistry')}
        >
          Registro de Equipos
        </li>
        <li 
          className={activeTab === 'equipmentChanges' ? 'active' : ''} 
          onClick={() => setActiveTab('equipmentChanges')}
        >
          Cambio de Equipos
        </li>
      </ul>
    </nav>
  )
}

export default Navbar