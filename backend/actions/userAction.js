import { error } from "../utils/error.js"
import { User } from '../models/userModel.js'
import { sendToken } from "../utils/setToken.js"
import otpGenerator from 'otp-generator'
import { sendEmail } from '../utils/sendEmail.js'

export const register = async (req, res) => {
    try {
        const { name, email, id, password } = req.body
        if (!name || !email || (!id && !password)) {
            return error(res, 400, "All fields are required")
        }
        let user
        if (password) {
            user = await User.create({
                name, email, password, verified: true
            })
        } else if (id) {
            user = await User.create({
                name, email, google_id: id, verified: true
            })
        }
        sendToken(res, user, true, "Registeration Successfully")
    } catch (err) {
        return error(res, 500, err.message)
    }
}

export const send_otp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (user) {
            return error(res, 400, "User Already Exists")
        }
        const otp = await otpGenerator.generate(6, { digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false });
        await sendEmail(email, "OTP Confirmation", `Your OTP is : ${otp}`)
        res.status(200).json({ otp, message: "OTP sent successfully" })
    } catch (err) {
        return error(res, 500, err.message)
    }
}

export const login = async (req, res) => {
    try {
        const { email, id, password } = req.body
        if (!email || (!id && !password)) {
            return error(res, 400, "All fields are required")
        }
        let user
        if (password) {
            user = await User.findOne({ email }).select("+password")
            console.log(user)
            if (!user) {
                return error(res, 400, "Invalid Email Or Password")
            }
            const isMatched = await user.comparePassword(password)
            if(!isMatched){
                return error(res, 400, "Invalid Email Or Password")
            }
        } else if (id) {
            user = await User.findOne({ google_id: id })
            if (!user) {
                return error(res, 400, "Invalid Email")
            }
        }
        sendToken(res, user, true, "Login Successfull")
    } catch (err) {
        return error(res, 500, err.message)
    }
}

export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.status(200).json({ success: true, user })
    } catch (err) {
        return error(res, 500, err.message)
    }
}

export const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        sendToken(res, user, false, "Logout Successfully")
    } catch (err) {
        return error(res, 500, err.message)
    }
}

export const addToFav = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        let { item } = req.body
        if(item){
            item = {
                ...item,
                price: item.price.split("C")[0] * 10000000,
            };
        }
        user.favProperty.push(item)
        await user.save()
        res.status(200).json({ success: true, message: "Successfully Added To Favourite" })
    } catch (err) {
        return error(res, 500, err.message)
    }
}

export const deleteToFav = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        let { item } = req.body
        
        user.favProperty = user.favProperty.filter((property) => property._id !== item._id)
        await user.save()
        res.status(200).json({ success: true, message: "Successfully Deleted To Favourite" })
    } catch (err) {
        return error(res, 500, err.message)
    }
}