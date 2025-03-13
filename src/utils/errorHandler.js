export const initErrorHandler = () => {
  
  window.addEventListener('error', (event) => {
    console.error('Error no manejado:', event.error);
    logError({
      type: 'unhandled',
      message: event.message,
      stack: event.error?.stack || 'No stack trace available'
    });
  });
  
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no manejada:', event.reason);
    logError({
      type: 'unhandledRejection',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack || 'No stack trace available'
    });
  });
};


const logError = (errorData) => {
  console.error('ERROR REGISTRADO:', errorData);
  
  
  if (window.electron) {
    try {
      window.electron.send('log-error', errorData);
    } catch (err) {
      console.error('Error al guardar el log de error:', err);
    }
  }
};