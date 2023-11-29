import mongoose from "mongoose";

export const database = async () => {
    try{
        await mongoose.connect(process.env.CLOUD_MONGO_URI)
        console.log("Connected")
    }catch(error){
        console.log(error.message)
    }
}