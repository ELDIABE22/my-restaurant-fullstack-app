// Función para normalizar un string con la primera letra en mayúscula y el resto en minúscula 
export const normalizeString = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
