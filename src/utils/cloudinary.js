import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async file => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'menuItems' }, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }).end(buffer);
    });
}

export const deleteImage = async id => {
    return await cloudinary.uploader.destroy(id);
}