import { error } from "./error.js"
import jwt from 'jsonwebtoken'

export const sendToken = async (res, user, set, message) => {
    try{
        const token = await jwt.sign({ id: user._id }, process.env.SIGN)
        res.cookie("token", set?token:null, {
            maxAge: set?process.env.AGE * 24 * 60 * 60 * 1000:0
        }).json({ success: true, message })
    }catch(err){
        return error(res, 500, err.message)
    }
}