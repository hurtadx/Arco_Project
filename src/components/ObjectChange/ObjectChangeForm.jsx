import React, { useState } from 'react'
import './ObjectChangeForm.css'
import { addObjectChange } from '../../data/objectChangesStore'

function ObjectChangeForm() {
  const [formData, setFormData] = useState({
    location: '',
    personName: '',
    objectType: '',
    otherObject: '',
    date: new Date().toISOString().split('T')[0]
  })
  
  const [showOtherField, setShowOtherField] = useState(false)
  
  const locations = ['Administración', 'Extrusión', 'Producción', 'Logística', 'Otro']
  const objectTypes = ['Teléfono', 'Mousepad', 'Pantalla', 'Garra de Pantalla', 'Teclado', 'Mouse', 'Otro']
  
  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'objectType' && value === 'Otro') {
      setShowOtherField(true)
    } else if (name === 'objectType') {
      setShowOtherField(false)
    }
    
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    
    const changeData = {
      ...formData,
      objectType: formData.objectType === 'Otro' ? formData.otherObject : formData.objectType,
      timestamp: new Date().toISOString()
    }
    
    
    addObjectChange(changeData)
    
    
    setFormData({
      location: '',
      personName: '',
      objectType: '',
      otherObject: '',
      date: new Date().toISOString().split('T')[0]
    })
    setShowOtherField(false)
  }
  
  return (
    <div className="object-change-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="location">Lugar:</label>
          <select 
            id="location" 
            name="location" 
            value={formData.location} 
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un lugar</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="personName">Nombre de la Persona (Opcional):</label>
          <input
            type="text"
            id="personName"
            name="personName"
            value={formData.personName}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="objectType">Objeto:</label>
          <select 
            id="objectType" 
            name="objectType" 
            value={formData.objectType} 
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un objeto</option>
            {objectTypes.map(obj => (
              <option key={obj} value={obj}>{obj}</option>
            ))}
          </select>
        </div>
        
        {showOtherField && (
          <div className="form-group">
            <label htmlFor="otherObject">Especifique el Objeto:</label>
            <input
              type="text"
              id="otherObject"
              name="otherObject"
              value={formData.otherObject}
              onChange={handleChange}
              required
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="date">Fecha:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">Registrar Cambio</button>
      </form>
    </div>
  )
}

export default ObjectChangeForm