

const mongoose = require("mongoose")



const brandSchema = new mongoose.Schema(
    {

        name: {

            type: String,
            require: true,
            trim: true,
            unique: true,

        },
        slug: {

            type: String,
            require: true,
            unique: true,
            lowercase: true,
        },
        brandImage: {

            type: String,
            require: true,

        },
        status: {

            type: Boolean,
            default: true,
        },

    },
    {
        timestamps: true,

    }

)

const brandmodel = mongoose.model('brand', brandSchema)

module.exports = brandmodel;