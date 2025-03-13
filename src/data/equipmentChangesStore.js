
import { getEquipmentById, updateEquipment } from './equipmentStore';

let equipmentChanges = [];


export const addEquipmentChange = (changeData) => {
  const newChange = {
    id: Date.now().toString(),
    ...changeData,
    timestamp: new Date().toISOString()
  };
  
  equipmentChanges.push(newChange);
  
  
  if (changeData.equipmentId) {
    const equipment = getEquipmentById(changeData.equipmentId);
    if (equipment) {
      updateEquipment(changeData.equipmentId, { 
        currentOwner: changeData.newOwner 
      });
    }
  }
  
  console.log('Nuevo cambio de equipo registrado:', newChange);
  return newChange;
};


export const getEquipmentChanges = () => {
  return [...equipmentChanges];
};


export const getChangesByEquipmentId = (equipmentId) => {
  return equipmentChanges.filter(change => change.equipmentId === equipmentId);
};


export const exportToExcel = () => {
  console.log('Exportando cambios de equipos a Excel:', equipmentChanges);
  alert('Esta función estará disponible en la versión final de la aplicación');
};