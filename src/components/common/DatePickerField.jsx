import React, { useState, useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerField.css';

registerLocale('es', es);

const DatePickerField = ({ 
  label, 
  name, 
  value, 
  onChange,
  minDate,
  maxDate = new Date(), 
  required = false,
  optional = false,
  allowFutureDates = false, 
  showYearDropdown = true,   
  yearDropdownItemNumber = 30,
  helpText 
}) => {
  const datePickerRef = useRef(null);

  
  let dateValue = null;
  if (value) {
    try {
      const [year, month, day] = value.split('-');
      const parsedDate = new Date(year, month - 1, day);
      
      
      if (!isNaN(parsedDate.getTime())) {
        dateValue = parsedDate;
      } else {
        console.warn(`Fecha inválida detectada en DatePickerField: ${value}`);
      }
    } catch (error) {
      console.error(`Error al parsear fecha en DatePickerField: ${value}`, error);
    }
  }

  
  const finalMaxDate = allowFutureDates ? maxDate : new Date();

  const handleChange = (date) => {
    if (!date) {
      onChange({ target: { name, value: '' } });
      return;
    }
    
    try {
      
      const formattedDate = date.toISOString().split('T')[0];
      onChange({ target: { name, value: formattedDate } });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      onChange({ target: { name, value: '' } });
    }
  };

  const handleClick = () => {
    if (datePickerRef.current && datePickerRef.current.setOpen) {
      datePickerRef.current.setOpen(true);
    }
  };

  return (
    <div className="date-picker-field">
      <label>
        <FontAwesomeIcon icon={['fas', 'calendar-alt']} className="form-field-icon" />
        {label}
        {optional && <span className="optional-label">(Opcional)</span>}
      </label>
      
      <div className="date-picker-container">
        <DatePicker
          ref={datePickerRef}
          selected={dateValue}
          onChange={handleChange}
          locale="es"
          dateFormat="dd/MM/yyyy"
          className="enhanced-input date-input"
          placeholderText="Seleccionar fecha"
          minDate={minDate}
          maxDate={finalMaxDate}
          required={required}
          showYearDropdown={showYearDropdown}
          scrollableYearDropdown
          yearDropdownItemNumber={yearDropdownItemNumber}
          showMonthDropdown
          dropdownMode="select"
          popperProps={{ strategy: 'fixed' }}
          popperPlacement="top-end"
        />
        <button
          type="button"
          className="calendar-button"
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={['fas', 'calendar-alt']} />
        </button>
      </div>

      {helpText && (
        <div className="field-help-text">
          <FontAwesomeIcon icon="info-circle" className="help-icon" />
          {helpText}
        </div>
      )}
    </div>
  );
};

export default DatePickerField;