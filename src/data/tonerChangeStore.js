import { v4 as uuidv4 } from 'uuid';

let tonerChanges = [];
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
      const result = await window.electron.invoke('load-excel-data', {
        fileName: 'cambios-toner.xlsx',
        sheet: 'CambiosToner'
      });
      
      if (result.success && Array.isArray(result.data)) {
        tonerChanges = result.data.map(change => ({
          ...change,
          id: change.id || uuidv4()
        }));
        return tonerChanges;
      }
      return [];
    }
    return [];
  } catch (error) {
    console.error('Error al cargar cambios de toner desde Excel:', error);
    return [];
  }
};

const saveToExcel = async () => {
  try {
    if (window.electron) {
      await window.electron.invoke('create-backup', {
        fileName: 'cambios-toner.xlsx'
      });
      
      const result = await window.electron.invoke('save-excel-data', {
        fileName: 'cambios-toner.xlsx',
        sheet: 'CambiosToner',
        data: tonerChanges
      });
      
      return result.success;
    }
    return false;
  } catch (error) {
    console.error('Error al guardar cambios de toner en Excel:', error);
    return false;
  }
};

export const getTonerChanges = async () => {
  if (tonerChanges.length === 0) {
    await loadFromExcel();
  }
  return tonerChanges;
};

export const getTonerChangesByPrinterId = async (printerId) => {
  if (tonerChanges.length === 0) {
    await loadFromExcel();
  }
  return tonerChanges.filter(change => change.printerId === printerId);
};

export const addTonerChange = async (changeData) => {
  await checkReadOnlyStatus();
  if (isReadOnly) {
    throw new Error('La aplicación está en modo solo lectura. No se pueden realizar cambios.');
  }
  
  if (tonerChanges.length === 0) {
    await loadFromExcel();
  }
  
  const newChange = {
    id: uuidv4(),
    printerId: changeData.printerId,
    printerModel: changeData.printerModel,
    pageCount: changeData.pageCount,
    changeDate: changeData.changeDate,
    tonerType: changeData.tonerType,
    changedBy: changeData.changedBy,
    notes: changeData.notes,
    timestamp: new Date().toISOString()
  };
  
  tonerChanges.push(newChange);
  
  await saveToExcel();
  
  return newChange;
};

export const getTonerStatsByPrinterId = async (printerId) => {
  if (tonerChanges.length === 0) {
    await loadFromExcel();
  }
  
  
  const printerChanges = tonerChanges.filter(change => change.printerId === printerId);
  
  if (printerChanges.length === 0) {
    return {
      totalToners: 0,
      totalPages: 0,
      avgPagesPerToner: 0,
      lastChange: null,
      changes: []
    };
  }
  
  
  const sortedChanges = [...printerChanges].sort((a, b) => 
    new Date(a.changeDate) - new Date(b.changeDate)
  );
  
  
  const totalToners = sortedChanges.length;
  let totalPages = 0;
  
  const changes = sortedChanges.map((change, index) => {
    const pageCount = parseInt(change.pageCount) || 0;
    
    
    
    const pagesPrinted = index === 0 ? 0 : pageCount;
    
    
    if (index > 0) {
      totalPages += pagesPrinted;
    }
    
    return {
      ...change,
      pagesPrinted: pagesPrinted
    };
  });
  
  const avgPagesPerToner = totalToners > 1 ? Math.round(totalPages / (totalToners - 1)) : 0;
  
  return {
    totalToners,
    totalPages,
    avgPagesPerToner,
    lastChange: sortedChanges[sortedChanges.length - 1],
    changes
  };
};

export const exportToExcel = async () => {
  try {
    if (window.electron) {
      if (tonerChanges.length === 0) {
        await loadFromExcel();
      }
      
      const result = await window.electron.invoke('export-excel', {
        fileName: 'cambios-toner-export.xlsx',
        sheets: [
          {
            name: 'Cambios de Toner',
            data: tonerChanges.map(change => ({
              ID: change.id,
              'ID Impresora': change.printerId,
              'Modelo': change.printerModel,
              'Contador': change.pageCount,
              'Fecha': change.changeDate,
              'Tipo de Toner': change.tonerType,
              'Realizado por': change.changedBy,
              'Notas': change.notes,
              'Timestamp': change.timestamp
            }))
          }
        ]
      });
      
      return result.success;
    } else {
      alert('La exportación a Excel solo está disponible en la versión de escritorio');
      return false;
    }
  } catch (error) {
    console.error('Error al exportar datos de cambios de toner:', error);
    return false;
  }
};