import React, { useState } from 'react';
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
  yearDropdownItemNumber = 30 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  
  let dateValue = null;
  if (value) {
    const [year, month, day] = value.split('-');
    dateValue = new Date(year, month - 1, day);
  }

  
  const finalMaxDate = allowFutureDates ? maxDate : new Date();

  const handleChange = (date) => {
    if (!date) {
      onChange({ target: { name, value: '' } });
      return;
    }
    
    
    const formattedDate = date.toISOString().split('T')[0];
    onChange({ target: { name, value: formattedDate } });
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
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
          selected={dateValue}
          onChange={handleChange}
          onClickOutside={() => setIsOpen(false)}
          open={isOpen}
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
        />
        <button
          type="button"
          className="calendar-button"
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={['fas', 'calendar-alt']} />
        </button>
      </div>
    </div>
  );
};

export default DatePickerField;