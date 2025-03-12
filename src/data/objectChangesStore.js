const { ipcRenderer } = window.require('electron');
const fs = window.require('fs');
const path = window.require('path');
const { app } = window.require('@electron/remote');


const dataPath = path.join(app.getPath('userData'), 'objectChanges.json');


let objectChanges = [];


try {
  if (fs.existsSync(dataPath)) {
    const data = fs.readFileSync(dataPath, 'utf8');
    objectChanges = JSON.parse(data);
  }
} catch (error) {
  console.error('Error loading object changes data', error);
}


const saveChanges = () => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(objectChanges, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving object changes data', error);
  }
};


export const addObjectChange = (changeData) => {
  const newChange = {
    id: Date.now().toString(),
    ...changeData
  };
  objectChanges.push(newChange);
  console.log('Nuevo cambio registrado:', newChange);
  console.log('Todos los cambios:', objectChanges);
  saveChanges();
  return objectChanges;
};


export const getObjectChanges = () => {
  return objectChanges;
};


export const exportToExcel = () => {
  console.log('Exportando a Excel:', objectChanges);
  alert('Esta función será implementada próximamente');
};