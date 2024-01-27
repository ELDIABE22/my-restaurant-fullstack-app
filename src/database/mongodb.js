import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected to MongoDB Atlas')
    } catch (error) {
        console.log('Mongoose connected error ' + error)
    }
}