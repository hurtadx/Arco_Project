import * as XLSX from 'xlsx';

let objectChanges = [];
let isReadOnly = false;


export const checkReadOnlyStatus = async () => {
  if (window.electron) {
    const lockStatus = await window.electron.invoke('check-lock');
    isReadOnly = lockStatus.isLocked;
    return isReadOnly;
  }
  return false;
};


export const loadFromExcel = async () => {
  try {
    if (window.electron) {
    
      const dataPath = await window.electron.invoke('get-data-path');
      
      const result = await window.electron.invoke('load-excel-data', {
        fileName: 'cambios-objetos.xlsx',
        sheet: 'CambiosObjetos',
        dataPath 
      });
      
      if (result.success) {
        objectChanges = result.data;
        console.log(`${objectChanges.length} cambios de objetos cargados desde Excel.`);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error al cargar datos desde Excel:', error);
    return false;
  }
};


const saveToExcel = async () => {
  await checkReadOnlyStatus();
  if (isReadOnly) return false;
  
  try {
    if (window.electron) {
      await window.electron.invoke('create-backup', {
        fileName: 'cambios-objetos.xlsx'
      });
      
      const result = await window.electron.invoke('save-excel-data', {
        fileName: 'cambios-objetos.xlsx',
        sheet: 'CambiosObjetos',
        data: objectChanges
      });
      
      return result.success;
    }
    return false;
  } catch (error) {
    console.error('Error al guardar en Excel:', error);
    return false;
  }
};

export const addObjectChange = async (changeData) => {
  await checkReadOnlyStatus();
  if (isReadOnly) {
    throw new Error('La aplicación está en modo solo lectura. No se pueden realizar cambios.');
  }
  
  if (objectChanges.length === 0) {
    await loadFromExcel();
  }
  
  const newChange = {
    id: Date.now().toString(),
    ...changeData,
    timestamp: new Date().toISOString()
  };
  
  objectChanges.push(newChange);
  
  await saveToExcel();
  
  console.log('Nuevo cambio de objeto registrado:', newChange);
  return newChange;
};

export const getObjectChanges = async () => {
  if (objectChanges.length === 0) {
    await loadFromExcel();
  }
  return [...objectChanges];
};

export const exportToExcel = async () => {
  try {
    if (window.electron) {
      const result = await window.electron.invoke('export-dialog', {
        fileName: 'cambios-objetos.xlsx',
        sheet: 'CambiosObjetos',
        data: objectChanges
      });
      
      return result.success;
    }
    return false;
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    throw error;
  }
};

export const importFromExcel = async (file) => {
  await checkReadOnlyStatus();
  if (isReadOnly) {
    throw new Error('La aplicación está en modo solo lectura. No se pueden realizar cambios.');
  }
  
  try {
    if (window.electron) {
      const result = await window.electron.invoke('import-excel-file', {
        filePath: file.path,
        targetFile: 'cambios-objetos.xlsx',
        sheet: 'CambiosObjetos'
      });
      
      if (result.success) {
        objectChanges = result.data;
        return objectChanges;
      } else {
        throw new Error(result.error || 'Error al importar archivo');
      }
    }
    throw new Error('Esta función solo está disponible en la aplicación de escritorio');
  } catch (error) {
    console.error('Error al importar Excel:', error);
    throw error;
  }
};


(async () => {
  try {
    await loadFromExcel();
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
  }
})();