import { app } from "./app.js";
import dotenv from "dotenv"
import { database } from "./config/database.js";
import { connectPassport } from "./utils/provider.js";
import cloudinary from 'cloudinary'

dotenv.config({path: "./backend/config/config.env"})

database()
connectPassport()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on : http://localhost:${process.env.PORT}`)
})