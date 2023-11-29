import stripe from 'stripe'
import { error } from '../utils/error.js'
import { User } from '../models/userModel.js'

export async function processPayment(req, res) {
    try {
        const { plan } = req.body
        const stripe_key = stripe(process.env.STRIPE_SECRET_KEY)
        const myPayment = await stripe_key.paymentIntents.create({
            amount: req.body.amount,
            currency: "inr",
            metadata: {
                company: "RealEstateIndia"
            }
        })
        const user = await User.findById(req.user._id)
        const currentDate = new Date();
        const oneMonthFromNow = new Date(currentDate);
        oneMonthFromNow.setMonth(currentDate.getMonth() + plan);
        user.premium = plan
        user.activePremium = oneMonthFromNow;
        await user.save()
        res.status(200).json({ success: true, client_secret: myPayment.client_secret, message: `${user.premium} Month Activated` })
    }
    catch (err) {
        return error(res, 500, err.message)
    }
}

export async function sendStripeKey(req, res) {
    try {
        res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY })
    } catch (err) {
        return error(res, 500, err.message)
    }
}