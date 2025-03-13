





let equipment = [];


export const addEquipment = (equipData) => {
  const newEquipment = {
    id: Date.now().toString(),
    ...equipData,
    createdAt: new Date().toISOString()
  };
  
  equipment.push(newEquipment);
  console.log('Nuevo equipo registrado:', newEquipment);
  
  return newEquipment;
};


export const getEquipment = () => {
  return [...equipment];
};


export const getEquipmentById = (id) => {
  return equipment.find(eq => eq.id === id);
};


export const updateEquipment = (id, updates) => {
  const index = equipment.findIndex(eq => eq.id === id);
  if (index !== -1) {
    equipment[index] = {
      ...equipment[index],
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    console.log('Equipo actualizado:', equipment[index]);
    return equipment[index];
  }
  return null;
};


export const exportToExcel = () => {
  console.log('Exportando equipos a Excel:', equipment);
  alert('Esta función estará disponible en la versión final de la aplicación');
};