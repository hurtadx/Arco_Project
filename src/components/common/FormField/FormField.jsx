import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './FormField.css';

const FormField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  icon,
  placeholder,
  required = false,
  options = [],
  error = null,
  optional = false,
  className = '',
  min,
  max,
  minLength,
  maxLength,
  pattern
}) => {
  const fieldClassName = `form-field ${error ? 'form-error' : ''} ${className}`;
  
  return (
    <div className={fieldClassName}>
      {label && (
        <label htmlFor={name}>
          {icon && <FontAwesomeIcon icon={['fas', icon]} className="form-field-icon" />}
          {label}
          {optional && <span className="optional-label">(Opcional)</span>}
        </label>
      )}
      
      {type === 'select' ? (
        <div className="select-container">
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="enhanced-select"
          >
            <option value="">{placeholder || "Seleccione una opción"}</option>
            {options.map(option => (
              <option 
                key={option.value || option} 
                value={option.value || option}
              >
                {option.label || option}
              </option>
            ))}
          </select>
        </div>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="enhanced-textarea"
          minLength={minLength}
          maxLength={maxLength}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="enhanced-input"
          min={min}
          max={max}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
        />
      )}
      
      {error && (
        <div className="error-text">
          <FontAwesomeIcon icon={['fas', 'exclamation-circle']} /> 
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;