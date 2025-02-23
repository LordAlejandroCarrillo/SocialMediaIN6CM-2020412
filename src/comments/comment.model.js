import { Schema, model } from "mongoose";

const CommentSchema = Schema(
    {
        ownerUsername: {
            type: String,
            required: [true, "Owner username required."]
        },
        ownerEmail: {
            type: String,
            required: [true, "Owner email required."]
        },
        text: {
            type: String,
            required: [true, "Text is required"],
            maxLength: [1500, "Cant be overcome 1500 characters"]
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required : [true, "User required"]
        },
        postRef: {
            type: Schema.Types.ObjectId,
            ref: 'post',
            required : [true, "Post required"]
        },
        state: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model('Comment', CommentSchema)