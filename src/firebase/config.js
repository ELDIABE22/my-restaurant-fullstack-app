import { getStorage, uploadBytes, ref, getDownloadURL, deleteObject } from "firebase/storage"
import { v4 as uuidv4 } from "uuid";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFile(file) {
    try {
        const storageRef = ref(storage, uuidv4());
        const data = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return {
            url,
            id: data.metadata.name,
        };
    } catch (error) {
        console.error("Error al montar el archivo: ", error);
    }
}

export async function deleteFile(imageId) {
    try {
        const fileRef = ref(storage, imageId);
        await deleteObject(fileRef);
    } catch (error) {
        console.error("Error al eliminar el archivo: ", error);
    }
}