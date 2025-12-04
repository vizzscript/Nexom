import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
    email: string;
    otp?: string | null;
    otpExpiresAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email must be provided."],
            unique: true,
            trim: true,
            validate: {
                validator: function (value: string) {
                    return validator.isEmail(value);
                },
                message: "Please provide a valid email address."
            }
        },
        otp: {
            type: String,
            select: false,
            default: null
        },
        lastOtpSentAt: {
            type: Date,
            select: false,
            default: null,
        },
        otpExpiresAt: {
            type: Date,
            select: false,
            default: null
        }
    },
    {
        timestamps: true
    }
);


const User = mongoose.model<IUser>("User", UserSchema);

export default User;