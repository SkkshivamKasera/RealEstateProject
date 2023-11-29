import express, {urlencoded} from 'express'
import Route from './routes/route.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import stripe from 'stripe'
import expressFileUploder from 'express-fileupload'
import bodyParser from 'body-parser'
dotenv.config({path: './backend/config/config.env'})

export const app = express()

app.use(express.json({
    limit: '50mb'
}))
app.use(expressFileUploder())
app.use(urlencoded({extended: true}))
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(cookieParser())

app.use("/api/v1", Route)