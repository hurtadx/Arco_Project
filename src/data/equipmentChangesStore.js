import { getEquipmentById, updateEquipment } from './equipmentStore';

let equipmentChanges = [];
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
      const result = await window.electron.invoke('load-excel-data', {
        fileName: 'cambios-equipos.xlsx',
        sheet: 'CambiosEquipos'
      });
      
      if (result.success) {
        equipmentChanges = result.data || [];
        console.log(`${equipmentChanges.length} cambios de equipos cargados desde Excel.`);
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
        fileName: 'cambios-equipos.xlsx'
      });
      
      const result = await window.electron.invoke('save-excel-data', {
        fileName: 'cambios-equipos.xlsx',
        sheet: 'CambiosEquipos',
        data: equipmentChanges
      });
      
      return result.success;
    }
    return false;
  } catch (error) {
    console.error('Error al guardar en Excel:', error);
    return false;
  }
};

export const addEquipmentChange = async (changeData) => {
  await checkReadOnlyStatus();
  if (isReadOnly) {
    throw new Error('La aplicación está en modo solo lectura. No se pueden realizar cambios.');
  }
  
  if (equipmentChanges.length === 0) {
    await loadFromExcel();
  }
  
  const newChange = {
    id: Date.now().toString(),
    ...changeData,
    timestamp: new Date().toISOString()
  };
  
  equipmentChanges.push(newChange);
  
  
  const equipment = await getEquipmentById(changeData.equipmentId);
  if (equipment) {
    await updateEquipment(changeData.equipmentId, { 
      currentOwner: changeData.newOwner,
      lastChangeDate: changeData.fromDate
    });
  }
  
  await saveToExcel();
  
  console.log('Nuevo cambio de equipo registrado:', newChange);
  return newChange;
};

export const getEquipmentChanges = async () => {
  if (equipmentChanges.length === 0) {
    await loadFromExcel();
  }
  return [...equipmentChanges];
};

export const getChangesByEquipmentId = async (equipmentId) => {
  if (equipmentChanges.length === 0) {
    await loadFromExcel();
  }
  
  const result = equipmentChanges.filter(change => change.equipmentId === equipmentId);
  console.log(`Encontrados ${result.length} cambios para el equipo ${equipmentId}`);
  return result;
};

export const exportToExcel = () => {
  console.log('Exportando cambios de equipos a Excel:', equipmentChanges);
  alert('Esta función estará disponible en la versión final de la aplicación');
};

(async () => {
  try {
    await loadFromExcel();
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
  }
})();