import { generateId } from '../utils/idGenerator';

let printers = [];
let isReadOnly = false;

const checkReadOnlyStatus = async () => {
  if (window.electron) {
    try {
      const lockStatus = await window.electron.invoke('check-lock');
      isReadOnly = lockStatus.isLocked;
    } catch (error) {
      console.error('Error al verificar estado de bloqueo:', error);
    }
  }
};

export const loadFromExcel = async () => {
  try {
    if (window.electron) {
      
      const dataPath = await window.electron.invoke('get-data-path');
      
      const result = await window.electron.invoke('load-excel-data', {
        fileName: 'impresoras.xlsx',
        sheet: 'Impresoras',
        dataPath 
      });
      
      if (result.success && Array.isArray(result.data)) {
        printers = result.data.map(printer => ({
          ...printer,
          id: printer.id || generateId()
        }));
        return printers;
      }
      return [];
    }
    return [];
  } catch (error) {
    console.error('Error al cargar impresoras desde Excel:', error);
    return [];
  }
};

const saveToExcel = async () => {
  try {
    if (window.electron) {
      await window.electron.invoke('create-backup', {
        fileName: 'impresoras.xlsx'
      });
      
      const result = await window.electron.invoke('save-excel-data', {
        fileName: 'impresoras.xlsx',
        sheet: 'Impresoras',
        data: printers
      });
      
      return result.success;
    }
    return false;
  } catch (error) {
    console.error('Error al guardar impresoras en Excel:', error);
    return false;
  }
};

export const getPrinters = async () => {
  if (printers.length === 0) {
    await loadFromExcel();
  }
  return printers;
};

export const getPrinterById = async (id) => {
  if (printers.length === 0) {
    await loadFromExcel();
  }
  return printers.find(printer => printer.id === id);
};

export const addPrinter = async (printerData) => {
  await checkReadOnlyStatus();
  if (isReadOnly) {
    throw new Error('La aplicación está en modo solo lectura. No se pueden realizar cambios.');
  }
  
  if (printers.length === 0) {
    await loadFromExcel();
  }
  
  const newPrinter = {
    id: generateId(),
    model: printerData.model,
    location: printerData.location,
    owner: printerData.owner,
    tonerType: printerData.tonerType,
    timestamp: new Date().toISOString()
  };
  
  printers.push(newPrinter);
  
  await saveToExcel();
  
  return newPrinter;
};

export const updatePrinter = async (id, printerData) => {
  await checkReadOnlyStatus();
  if (isReadOnly) {
    throw new Error('La aplicación está en modo solo lectura. No se pueden realizar cambios.');
  }
  
  if (printers.length === 0) {
    await loadFromExcel();
  }
  
  const index = printers.findIndex(printer => printer.id === id);
  
  if (index !== -1) {
    printers[index] = {
      ...printers[index],
      ...printerData,
      lastUpdated: new Date().toISOString()
    };
    
    await saveToExcel();
    
    return printers[index];
  }
  
  throw new Error('Impresora no encontrada.');
};

export const deletePrinter = async (id) => {
  await checkReadOnlyStatus();
  if (isReadOnly) {
    throw new Error('La aplicación está en modo solo lectura. No se pueden realizar cambios.');
  }
  
  if (printers.length === 0) {
    await loadFromExcel();
  }
  
  const initialLength = printers.length;
  printers = printers.filter(printer => printer.id !== id);
  
  if (printers.length !== initialLength) {
    await saveToExcel();
    return true;
  }
  
  return false;
};