
let objectChanges = [];


export const addObjectChange = (changeData) => {
  const newChange = {
    id: Date.now().toString(),
    ...changeData,
    timestamp: new Date().toISOString()
  };
  
  objectChanges.push(newChange);
  console.log('Nuevo cambio de objeto registrado:', newChange);
  
  return newChange;
};


export const getObjectChanges = () => {
  return [...objectChanges];
};


export const exportToExcel = () => {
  console.log('Exportando cambios de objetos a Excel:', objectChanges);
  alert('Esta función estará disponible en la versión final de la aplicación');
};