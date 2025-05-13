import React from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ThemeToggle from './ThemeToggle';

function Navbar({ activeTab, setActiveTab, children }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1 className="navbar-title">
          <FontAwesomeIcon icon={['fas', 'clipboard-list']} className="logo-icon" />
          ARCO
        </h1>
      </div>
      
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
        <li 
          className={activeTab === 'tonerManagement' ? 'active' : ''} 
          onClick={() => setActiveTab('tonerManagement')}
        >
          <FontAwesomeIcon icon="tint" className="nav-icon" />
          Gestión de Toners
        </li>
      </ul>
      
      <div className="navbar-actions">
        {children}
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar;