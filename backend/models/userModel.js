import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: String,
    google_id: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false
    },
    premium: {
        type: Number,
        enum: [0, 1, 3, 12],
        default: 0
    },
    activePremium: {
        type: Date,
        default: null
    },
    phoneNo: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[0-9]{10}$/.test(value);
            },
            message: "Phone Number Should be 10 digits"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        select: false
    },
    favProperty: [
        
    ]
})

userSchema.pre("save", function (next) {
    if (this.isModified('activePremium')) {
        const currentDate = new Date();
        if (currentDate > this.activePremium) {
            this.premium = 0;
        }
    }
    next();
});

userSchema.pre("save", async function(){
    if(this.password){
        if(!this.isModified("password")){
            return
        }
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }else{
        return
    }
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("users", userSchema)