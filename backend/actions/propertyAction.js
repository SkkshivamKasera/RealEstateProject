import { Property } from "../models/propertyModel.js";
import { User } from "../models/userModel.js";
import { error } from "../utils/error.js"
import cloudinary from 'cloudinary'
import { ApiFeatures } from '../utils/apiFeatures.js'

export const post_property = async (req, res) => {
    try {
        const {
            contact_details,
            property_for,
            property_type,
            country,
            state,
            city,
            appartment_or_Society,
            address,
            number_of_floors,
            availability,
            property_on_the_floor,
            ownership,
            sale_type,
            age_of_property,
            built_up_area,
            carpet_area,
            super_area,
            no_of_bedrooms,
            no_of_bathrooms,
            no_of_balconies,
            furnishing,
            facing,
            type_of_flooring,
            desc,
            propertyImages
        } = req.body
        let { price } = req.body

        const user = await User.findById(req.user._id)

        if (!contact_details || !price || !property_type || !state || !city || !appartment_or_Society || !address || !propertyImages || !no_of_bedrooms || !desc) {
            return error(res, 401, "All Fields Are Required")
        }

        console.log({ ownership, age_of_property, sale_type })
        if (price) {
            if (price.includes("Crore")) {
                price = price.split("C")[0] * 10000000
            } else {
                price = price.split("L")[0] * 100000
            }
        }

        let images = []
        for (let i = 0; i < propertyImages.length; i++) {
            const result = await cloudinary.v2.uploader.upload(propertyImages[i], {
                folder: "realestate"
            })
            images.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        const property = await Property.create({
            contact_details, property_type, property_for, country, state, city, appartment_or_Society, address, number_of_floors, availability, property_on_the_floor, ownership, sale_type, age_of_property, built_up_area, carpet_area, super_area, price, no_of_bedrooms, no_of_bathrooms, no_of_balconies,
            furnishing, facing, type_of_flooring, images, desc, user
        })

        res.status(200).json({ success: true, message: "Property Post Successfully", property })

    } catch (err) {
        return error(res, 500, err.message)
    }
}

export const get_all_properties = async (req, res) => {
    try {
        const resultPerPage = process.env.PAGE

        const apiFeatures = new ApiFeatures(Property.find(), req.query)
        apiFeatures.pagination(resultPerPage)

        let filteredProperties = await apiFeatures.query;

        filteredProperties = filteredProperties.map((item) => (
            {
                ...item.toObject(),
                price: (item.price / 10000000) + " Crore"
            }
        ))

        res.status(200).json({ success: true, properties: filteredProperties });
    } catch (err) {
        return error(res, 500, err.message);
    }
};


export const get_property_details = async (req, res) => {
    try {
        const { id } = req.params
        let property = await Property.findById(id)
        if (property) {
            property.visitors += 1
            await property.save()
            property = {
                ...property.toObject(),
                price: (property.price / 10000000) + " Crore",
            };
            res.status(200).json({ success: true, property });
        } else {
            return error(res, 404, 'Property not found');
        }
    } catch (err) {
        return error(res, 500, err.message)
    }
}

export const get_my_properties = async (req, res) => {
    try {
        const myProperties = await Property.find({ user: req.user._id })
        res.status(200).json({ success: true, myProperties })
    } catch (err) {
        return error(res, 500, err.message)
    }
}

export const update_property = async (req, res) => {
    try {
        const {
            contact_details,
            property_for,
            property_type,
            country,
            state,
            city,
            appartment_or_Society,
            address,
            number_of_floors,
            availability,
            property_on_the_floor,
            ownership,
            sale_type,
            age_of_property,
            built_up_area,
            carpet_area,
            super_area,
            no_of_bedrooms,
            no_of_bathrooms,
            no_of_balconies,
            furnishing,
            facing,
            type_of_flooring,
            desc
        } = req.body
        let { price } = req.body

        const { id } = req.params
        const user = await User.findById(req.user._id)

        if (!contact_details || !price || !property_type || !state || !city || !appartment_or_Society || !address || !no_of_bathrooms || !desc) {
            return error(res, 401, "All Fields Are Required")
        }

        if (price) {
            if (price.includes("Crore")) {
                price = price.split("C")[0] * 10000000
            } else {
                price = price.split("L")[0] * 100000
            }
        }

        const property = await Property.findByIdAndUpdate(id, {
            contact_details, property_type, property_for, country, state, city, appartment_or_Society, address, number_of_floors, availability, property_on_the_floor, ownership, sale_type, age_of_property, built_up_area, carpet_area, super_area, price, no_of_bedrooms, no_of_bathrooms, no_of_balconies,
            furnishing, facing, type_of_flooring, desc, user
        })

        res.status(200).json({ success: true, message: "Property Update Successfully", property })

    } catch (err) {
        return error(res, 500, err.message)
    }
}

export const search = async (req, res) => {
    try {
        const { type, minPrice, maxPrice, city } = req.query
        let searchResults
        if (type) {
            console.log("Ha")
            if (minPrice && !maxPrice) {
                searchResults = await Property.find({
                    property_type: {
                        $regex: type,
                        $options: 'i'
                    },
                    price: {
                        $gte: minPrice
                    }
                })
            }
            else if (maxPrice && !minPrice) {
                searchResults = await Property.find({
                    property_type: {
                        $regex: type,
                        $options: 'i'
                    },
                    price: {
                        $lte: maxPrice
                    }
                })
            }
            else if (maxPrice && minPrice) {
                searchResults = await Property.find({
                    property_type: {
                        $regex: type,
                        $options: 'i'
                    },
                    price: {
                        $gte: minPrice,
                        $lte: maxPrice
                    }
                })
            }
            else {
                searchResults = await Property.find({
                    property_type: {
                        $regex: type,
                        $options: 'i'
                    },
                })
            }
        }
        else if (city) {
            if (minPrice && !maxPrice) {
                searchResults = await Property.find({
                    city: {
                        $regex: city,
                        $options: 'i'
                    },
                    price: {
                        $gte: minPrice
                    }
                })
            }
            else if (maxPrice && !minPrice) {
                searchResults = await Property.find({
                    city: {
                        $regex: city,
                        $options: 'i'
                    },
                    price: {
                        $lte: maxPrice
                    }
                })
            }
            else if (maxPrice && minPrice) {
                searchResults = await Property.find({
                    city: {
                        $regex: city,
                        $options: 'i'
                    },
                    price: {
                        $gte: minPrice,
                        $lte: maxPrice
                    }
                })
            }
            else if (type) {
                searchResults = await Property.find({
                    city: {
                        $regex: city,
                        $options: 'i'
                    },
                    property_type: {
                        $regex: type,
                        $options: 'i'
                    }
                })
            }
            else {
                searchResults = await Property.find({
                    city: {
                        $regex: city,
                        $options: 'i'
                    },
                })
            }
        }
        else if (minPrice && maxPrice) {
            searchResults = await Property.find({
                price: {
                    $gte: minPrice,
                    $lte: maxPrice
                }
            })
        }
        else if (minPrice) {
            searchResults = await Property.find({
                price: {
                    $gte: minPrice
                }
            })
        }
        else if (maxPrice) {
            searchResults = await Property.find({
                price: {
                    $lte: maxPrice
                }
            })
        }
        else {
            searchResults = await Property.find({
                property_type: {
                    $regex: type,
                    $options: 'i'
                },
                city: {
                    $regex: city,
                    $options: 'i'
                },
                price: {
                    $gte: minPrice,
                    $lte: maxPrice
                }
            })
        }
        searchResults = searchResults.map((item) => (
            {
                ...item.toObject(),
                price: (item.price / 10000000) + " Crore"
            }
        ))
        res.status(200).json({ success: true, results: searchResults })
    } catch (err) {
        return error(res, 500, err.message)
    }
}