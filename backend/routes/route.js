import express from 'express'
import { addToFav, deleteToFav, getMyProfile, login, logout, register, send_otp } from '../actions/userAction.js'
import { isAuthenticated } from '../middlewares/auth.js'
import { get_all_properties, get_my_properties, get_property_details, post_property, search, update_property } from '../actions/propertyAction.js'
import { processPayment, sendStripeKey } from '../actions/paymentAction.js'

const router = express.Router()

/* Authentication */
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/send_otp").post(send_otp)
router.route("/me").get(isAuthenticated, getMyProfile)
router.route("/logout").get(isAuthenticated, logout)

/* Properties */
router.route("/property/post").post(isAuthenticated, post_property)
router.route("/property/update/:id").post(isAuthenticated, update_property)
router.route("/property/get/all").get(get_all_properties)
router.route("/property/get/:id").get(get_property_details)
router.route("/property/search").get(search)

router.route("/property/get/me/all").get(isAuthenticated, get_my_properties)
router.route("/property/add_to_fav").post(isAuthenticated, addToFav)
router.route("/property/delete_to_fav").post(isAuthenticated, deleteToFav)

/* Payments */
router.route("/payment").post(isAuthenticated, processPayment)
router.route("/get_stripe_key").get(sendStripeKey)

export default router