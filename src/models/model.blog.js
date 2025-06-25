'use strict'

import mongoose from "mongoose"
import slugify from "slugify"

const blogSchema = mongoose.Schema(
    {
        blog_title: {
            type: String,
            required: true,
            trim: true
        },
        blog_slug: {
            type: String,
            trim: true,
            unique: true
        },
        blog_content: {
            type: String,
            required: true,
            trim: true
        },
        blog_image: {
            type: String,
            required: true,
            trim: true
        },
    },
    {
        timestamps: true, // Automatically creates `createdAt` and `updatedAt`
    }
)

export default mongoose.model('Blog', blogSchema)