import React from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">
        <FontAwesomeIcon icon={['fas', 'clipboard-list']} className="logo-icon" />
        ARCO
      </h1>
      <ul className="nav-links">
        <li 
          className={activeTab === 'objectChanges' ? 'active' : ''} 
          onClick={() => setActiveTab('objectChanges')}
        >
          <FontAwesomeIcon icon={['fas', 'box']} className="nav-icon" />
          Cambio de Objetos
        </li>
        <li 
          className={activeTab === 'equipmentRegistry' ? 'active' : ''} 
          onClick={() => setActiveTab('equipmentRegistry')}
        >
          <FontAwesomeIcon icon={['fas', 'laptop']} className="nav-icon" />
          Registro de Equipos
        </li>
        <li 
          className={activeTab === 'equipmentChanges' ? 'active' : ''} 
          onClick={() => setActiveTab('equipmentChanges')}
        >
          <FontAwesomeIcon icon={['fas', 'exchange']} className="nav-icon" />
          Cambio de Equipos
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;