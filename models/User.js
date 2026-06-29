import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    name: { type: String },
    username: { type: String, required: true },
    isCreator: { type: Boolean, default: false },
    profilepic: {type: String},
    coverpic: {type: String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    });

 
export default mongoose.models.User || model("User", UserSchema);;

