import { Schema, model } from "mongoose";

const PostSchema = Schema(
    {
        ownerUsername: {
            type: String,
            required: [true, "Owner username required."]
        },
        ownerEmail: {
            type: String,
            required: [true, "Owner email required."]
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            maxLength: [85, "Cant be overcome 85 characters"]
        },
        text: {
            type: String,
            required: [true, "Text is required"],
            maxLength: [1500, "Cant be overcome 1500 characters"]
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'category',
            required : [true, "Category required"]
        },
        category: {
            type: String,
            required : [true, "Category name required"]
        },
        trendLevel:{
            type: String,
            required :[true, "Category trend level required"]
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required : [true, "User required"]
        },
        state: {
            type: Boolean,
            default: true,
        },
        views: {
            type: Number,
            default: 0
        },
        comments: {
            type: [],
            default: []

        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model('Post', PostSchema)