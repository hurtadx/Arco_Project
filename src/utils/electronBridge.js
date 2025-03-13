


export const createElectronBridge = () => {
  
  if (window.electron) return;
  
  
  window.electron = {
    invoke: async (channel, ...args) => {
      console.log(`Web mock: invoke llamado con canal "${channel}"`, args);
      
      
      if (channel === 'check-lock') {
        return { isLocked: false };
      }
      
      if (channel === 'load-excel-data') {
        return { success: true, data: [] };
      }
      
      if (channel === 'save-excel-data') {
        console.log('Web mock: simulando guardado de datos', args);
        return { success: true };
      }
      
      if (channel === 'get-data-path') {
        return 'Simulación navegador (no hay persistencia real)';
      }
      
      return { success: false, error: 'Función no disponible en navegador' };
    },
    
    send: (channel, data) => {
      console.log(`Web mock: send llamado con canal "${channel}"`, data);
    },
    
    receive: (channel, func) => {
      console.log(`Web mock: receive registrado para canal "${channel}"`);
    },
    
    exportToExcel: () => {
      alert('La exportación a Excel solo está disponible en la versión de escritorio');
      return Promise.resolve({ success: true });
    }
  };
};