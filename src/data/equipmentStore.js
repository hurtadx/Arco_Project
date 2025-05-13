import * as XLSX from 'xlsx';

let equipment = [];
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
        fileName: 'equipos.xlsx',
        sheet: 'Equipos',
        dataPath
      });
      
      if (result.success) {
        equipment = result.data;
        console.log(`${equipment.length} equipos cargados desde Excel.`);
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
        fileName: 'equipos.xlsx'
      });
      
      
      const result = await window.electron.invoke('save-excel-data', {
        fileName: 'equipos.xlsx',
        sheet: 'Equipos',
        data: equipment
      });
      
      return result.success;
    }
    return false;
  } catch (error) {
    console.error('Error al guardar en Excel:', error);
    return false;
  }
};


export const addEquipment = async (equipData) => {
  await checkReadOnlyStatus();
  if (isReadOnly) {
    throw new Error('La aplicación está en modo solo lectura. No se pueden realizar cambios.');
  }
  
  if (equipment.length === 0) {
    await loadFromExcel();
  }
  
  const newEquipment = {
    id: Date.now().toString(),
    ...equipData,
    initialOwner: equipData.currentOwner, 
    createdAt: new Date().toISOString()
  };
  
  equipment.push(newEquipment);
  await saveToExcel();
  
  return newEquipment;
};

export const getEquipment = async () => {
  
  if (equipment.length === 0) {
    await loadFromExcel();
  }
  return [...equipment];
};


export const getEquipmentById = async (equipmentId) => {
  if (equipment.length === 0) {
    await loadFromExcel();
  }
  
  return equipment.find(eq => eq.id === equipmentId);
};

export const updateEquipment = async (id, updates) => {
  
  await checkReadOnlyStatus();
  if (isReadOnly) {
    throw new Error('La aplicación está en modo solo lectura. No se pueden realizar cambios.');
  }
  
  const index = equipment.findIndex(eq => eq.id === id);
  if (index !== -1) {
    equipment[index] = {
      ...equipment[index],
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    
    await saveToExcel();
    
    console.log('Equipo actualizado:', equipment[index]);
    return equipment[index];
  }
  return null;
};

export const exportToExcel = async () => {
  try {
    if (window.electron) {
      const result = await window.electron.invoke('export-dialog', {
        fileName: 'equipos.xlsx',
        sheet: 'Equipos',
        data: equipment
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
        targetFile: 'equipos.xlsx',
        sheet: 'Equipos'
      });
      
      if (result.success) {
        equipment = result.data;
        return equipment;
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