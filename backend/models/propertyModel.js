import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    contact_details: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return /^[0-9]{10}$/.test(value);
                },
                message: "Phone Number Should be 10 digits"
            }
        },
        location: {
            type: String,
            required: true
        }
    },

    property_for: {
        type: String,
        default: "sale"
    },
    property_type: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: "IN"
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    appartment_or_Society: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },

    number_of_floors: Number,
    availability: String,
    property_on_the_floor: String,
    ownership: {
        type: String,
    },
    sale_type: String,
    age_of_property: String,

    built_up_area: {
        value: Number,
        unit: String
    },
    carpet_area: {
        value: Number,
        unit: String
    },
    super_area: {
        value: Number,
        unit: String
    },
    price: {
        type: Number,
        required: true
    },
    no_of_bedrooms: {
        type: String,
        required: true
    },
    no_of_bathrooms: {
        type: String,
    },
    no_of_balconies: String,
    furnishing: String,
    facing: String,
    type_of_flooring: String,

    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],

    desc: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    visitors: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        default: "Inactive"
    },

    response: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const Property = mongoose.model("properties", propertySchema)