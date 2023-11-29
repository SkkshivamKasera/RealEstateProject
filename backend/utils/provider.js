import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import passport from 'passport'
import { User } from '../models/userModel.js'

export const connectPassport = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, async function(accessToken, refreshToken, profile, done){
        const user = await User.findOne({
            google_id: profile.id
        })
        if(!user)
        {
            const new_user = await User.create({
                name: profile.displayName,
                google_id: profile.id,
                avatar: profile.photos[0].value
            })

            return done(null, new_user)
        }
        else
        {
            console.log(user)
            return done(null, user)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        done(null, user)
    })
}