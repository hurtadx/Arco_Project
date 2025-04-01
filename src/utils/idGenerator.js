export const generateId = () => {
  
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000000);
  return `id-${timestamp}-${random}`;
};