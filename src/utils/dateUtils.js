/**
 * Formatea una fecha a formato local de forma segura
 * @param {string|Date} dateInput - La fecha a formatear
 * @param {string} defaultValue - Valor por defecto si la fecha es inválida
 * @returns {string} - La fecha formateada
 */
export const formatDateSafe = (dateInput, defaultValue = "Fecha inválida") => {
  try {
    if (!dateInput) return defaultValue;
    
    // Si es string, asegurarse que sea en formato YYYY-MM-DD para evitar problemas de zona horaria
    let date;
    if (typeof dateInput === 'string') {
      // Para fechas en formato YYYY-MM-DD, añadir T00:00:00 para evitar problemas de zona horaria
      if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
        date = new Date(dateInput + 'T00:00:00');
      } else {
        date = new Date(dateInput);
      }
    } else {
      date = dateInput;
    }
    
    if (isNaN(date.getTime())) return defaultValue;
    
    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error al formatear fecha:", error, "Valor recibido:", dateInput);
    return defaultValue;
  }
};