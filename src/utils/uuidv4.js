import { v4 as uuidv4 } from 'uuid';

export const id25Bytes = () => {
    // Genera un UUID
    let miUUID = uuidv4();

    // Elimina los guiones y otros caracteres no deseados
    miUUID = miUUID.replace(/-/g, '').substring(0, 25);

    return miUUID;
};