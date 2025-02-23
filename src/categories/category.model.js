import { Schema, model } from "mongoose";

const CategorySchema = Schema(
    {
        name: {
            type: String,
            unique: [true, "Category already exists"],
            required: [true, "Name is required"],
            maxLength: [25, "Cant be overcome 25 characters"]
        },
        description: {
            type: String,
            maxLength: [200, "Cant be overcome 200 characters"]
        },
        state: {
            type: Boolean,
            default: true,
        },
        trendLevel: {
            type: String,
            default:"NEW",
            enum: ["NEW","CLOSED" ,"UNPOPULAR", "GROWING", "POPULAR"]
        },
        usesCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model('Category', CategorySchema);