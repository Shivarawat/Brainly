import mongoose, { Schema, model, mongo } from 'mongoose';
const URI = 'mongodb+srv://admin:shiv1234@cluster0.8ggvq4l.mongodb.net/brainly';
mongoose.connect(URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: String
});
const ContentSchema = new Schema({
    title: String,
    link: String,
    type: String,
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
});
const LinkSchema = new Schema({
    hash: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
});
export const LinkModel = model("Link", LinkSchema);
export const UserModel = model("User", UserSchema);
export const ContentModel = model("Content", ContentSchema);
//# sourceMappingURL=db.js.map