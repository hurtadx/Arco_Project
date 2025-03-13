import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Message from './Message';

/**
 * Componente de validación de formulario avanzado
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Formulario a validar
 * @param {Function} props.onSubmit - Función a llamar cuando el formulario es válido
 * @param {Object} props.initialValues - Valores iniciales del formulario
 * @param {Object} props.validationRules - Reglas de validación
 * @param {Object} props.customMessages - Mensajes de error personalizados
 */
const FormValidation = ({ 
  children, 
  onSubmit, 
  initialValues = {}, 
  validationRules = {},
  customMessages = {}
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  
  
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;
    
    let error = null;
    
    
    if (rules.required && (!value || value === '')) {
      error = customMessages[name]?.required || 'Este campo es obligatorio';
    } 
    
    
    else if (rules.minLength && value && value.length < rules.minLength) {
      error = customMessages[name]?.minLength || 
        `Debe tener al menos ${rules.minLength} caracteres`;
    } 
    
    
    else if (rules.maxLength && value && value.length > rules.maxLength) {
      error = customMessages[name]?.maxLength || 
        `No puede tener más de ${rules.maxLength} caracteres`;
    } 
    
    
    else if (rules.pattern && value && !new RegExp(rules.pattern).test(value)) {
      error = customMessages[name]?.pattern || 'Formato inválido';
    } 
    
    
    else if (rules.email && value && !/\S+@\S+\.\S+/.test(value)) {
      error = customMessages[name]?.email || 'Email inválido';
    } 
    
    
    else if (rules.match && value && value !== values[rules.match]) {
      const matchFieldName = customMessages[name]?.matchFieldName || rules.match;
      error = customMessages[name]?.match || 
        `Debe coincidir con ${matchFieldName}`;
    } 
    
    
    else if (rules.custom && typeof rules.custom === 'function') {
      const customError = rules.custom(value, values);
      if (customError) {
        error = customError;
      }
    }
    
    return error;
  };
  
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    return { isValid, errors: newErrors };
  };
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setValues({
      ...values,
      [name]: value
    });
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };
  
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    const allTouched = Object.keys(validationRules).reduce(
      (acc, field) => ({ ...acc, [field]: true }), 
      {}
    );
    setTouched(allTouched);
    
    
    const { isValid, errors: newErrors } = validateForm();
    setErrors(newErrors);
    
    if (!isValid) {
      setFormError('Por favor, corrija los errores antes de enviar.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError(null);
      
      
      await onSubmit(values);
      
      
      setFormSuccess('Formulario enviado correctamente.');
      setTimeout(() => {
        setFormSuccess(null);
      }, 3000);
      
    } catch (error) {
      setFormError(error.message || 'Error al enviar el formulario.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setFormError(null);
    setFormSuccess(null);
  };
  
  const setFieldValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  
  return (
    <div className={`form-validation ${isSubmitting ? 'form-submitting' : ''}`}>
      {formError && (
        <Message 
          type="error" 
          message={formError} 
          onClose={() => setFormError(null)} 
          autoClose={false}
        />
      )}
      
      {formSuccess && (
        <Message 
          type="success" 
          message={formSuccess} 
          onClose={() => setFormSuccess(null)} 
          autoClose={true}
          duration={3000}
        />
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        {React.Children.map(children, child => {
          
          if (!React.isValidElement(child)) return child;
          
          
          const childProps = {
            ...child.props,
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
            setFieldValue
          };
          
          
          if (child.props.name) {
            childProps.value = values[child.props.name] || '';
            childProps.error = touched[child.props.name] ? errors[child.props.name] : null;
            childProps.onChange = handleChange;
            childProps.onBlur = handleBlur;
            childProps.disabled = isSubmitting;
          }
          
          return React.cloneElement(child, childProps);
        })}
        
        {/* Botón de envío con estado de carga */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={['fas', 'spinner']} spin />
                Enviando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={['fas', 'save']} />
                Guardar
              </>
            )}
          </button>
          
          <button 
            type="button" 
            className="reset-btn"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={['fas', 'undo']} />
            Reiniciar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormValidation;