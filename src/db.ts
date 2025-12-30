const URI = 'mongodb+srv://admin:shiv1234@cluster0.8ggvq4l.mongodb.net/';

import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
});

export const UserModel = model( "User", UserSchema);