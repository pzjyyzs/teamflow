import { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        passwordHash: { type: String, required: true },
        roles: { type: [String], default: [] },
        refreshToken: { type: String }
    },
    {
        timestamps: true,
    }
);

export const UserModel = model("User", userSchema);