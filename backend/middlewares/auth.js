import { User } from "../models/userModel.js"
import { error } from "../utils/error.js"
import jwt from 'jsonwebtoken'
export const isAuthenticated = async (req, res, next) => {
    try {
        const {token} = req.cookies
        if (!token) {
            return error(res, 404, "Token Not Exists");
        }
        const decode = await jwt.verify(token, process.env.SIGN)
        const user = await User.findById(decode.id)
        req.user = user
        next()
    }catch(err){
        return error(res, 500, err.message)
    }
}