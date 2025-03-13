import fs from 'fs';
import path from 'path';
import os from 'os';


const LOCK_FILE = 'arco-lock.json';
const LOCK_TIMEOUT = 5 * 60 * 1000; 


let sharedDataDir = '';
let lockCheckInterval = null;

const initLockManager = (dataDir) => {
  sharedDataDir = dataDir;
  
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  return {
    isDataLocked: checkIfLocked,
    acquireLock,
    releaseLock
  };
};


const checkIfLocked = () => {
  const lockPath = path.join(sharedDataDir, LOCK_FILE);
  
  if (!fs.existsSync(lockPath)) return { isLocked: false };
  
  try {
    const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    
    
    const isOurLock = lockData.hostname === os.hostname() && 
                      lockData.username === os.userInfo().username;
    
    
    if (isOurLock) return { isLocked: false };
    
    
    const lockTime = new Date(lockData.timestamp).getTime();
    const now = Date.now();
    
    if (now - lockTime > LOCK_TIMEOUT) {
      
      try {
        fs.unlinkSync(lockPath);
        return { isLocked: false };
      } catch {
        
        return { 
          isLocked: true, 
          lockedBy: `${lockData.username}@${lockData.hostname} (expirado)` 
        };
      }
    }
    
    
    return { 
      isLocked: true, 
      lockedBy: `${lockData.username}@${lockData.hostname}` 
    };
    
  } catch (error) {
    console.error('Error al verificar el bloqueo:', error);
    return { 
      isLocked: true, 
      error: 'Error al verificar bloqueo' 
    }; 
  }
};


const acquireLock = () => {
  const lockStatus = checkIfLocked();
  
  if (lockStatus.isLocked) {
    return { 
      success: false, 
      message: lockStatus.lockedBy 
        ? `Los datos están siendo editados por ${lockStatus.lockedBy}` 
        : 'Los datos están siendo editados por otro usuario'
    };
  }
  
  const lockPath = path.join(sharedDataDir, LOCK_FILE);
  const lockData = {
    username: os.userInfo().username,
    hostname: os.hostname(),
    timestamp: new Date().toISOString()
  };
  
  try {
    fs.writeFileSync(lockPath, JSON.stringify(lockData, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error al adquirir bloqueo:', error);
    return { success: false, message: 'Error al adquirir bloqueo: ' + error.message };
  }
};


const releaseLock = () => {
  const lockPath = path.join(sharedDataDir, LOCK_FILE);
  
  if (!fs.existsSync(lockPath)) return { success: true };
  
  try {
    const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    
    
    if (lockData.hostname === os.hostname() && 
        lockData.username === os.userInfo().username) {
      fs.unlinkSync(lockPath);
      return { success: true };
    }
    
    return { 
      success: false, 
      message: 'No puedes liberar un bloqueo que pertenece a otro usuario' 
    };
  } catch (error) {
    console.error('Error al liberar bloqueo:', error);
    return { success: false, message: 'Error al liberar bloqueo: ' + error.message };
  }
};


export {
  initLockManager,
  checkIfLocked,
  acquireLock,
  releaseLock
};