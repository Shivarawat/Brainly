import express from 'express';
import jwt from 'jsonwebtoken';
import { ContentModel, LinkModel, UserModel } from './db.js';
import { JWT_PASSWORD } from './config.js';
import { userMiddleware } from './middleware.js';
import { random } from './utils.js';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.post('/api/v1/signup', async (req, res) => {
    // TODO: zod validation, password hashing
    const username = req.body.username;
    const password = req.body.password;
    try {
        await UserModel.create({
            username: username,
            password: password
        });
        res.json({ message: "User signed up" });
    }
    catch (error) {
        res.status(411).json({ message: "Error", error });
    }
});
app.post('/api/v1/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username: username,
        password: password
    });
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id,
        }, JWT_PASSWORD);
        res.json({ token });
    }
    else {
        res.status(403).json({ message: "Incorrect Credentials" });
    }
});
app.post('/api/v1/content', userMiddleware, async (req, res) => {
    const link = req.body.link;
    const title = req.body.title;
    const type = req.body.type;
    await ContentModel.create({
        link,
        title,
        type,
        userId: req.userId,
        tags: []
    });
    res.json({ message: "Content Added" });
});
app.get('/api/v1/content', userMiddleware, async (req, res) => {
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({ content });
});
app.delete('/api/v1/content', userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    await ContentModel.deleteOne({
        contentId,
        userId: req.userId,
    });
    res.json({ message: "Deleted." });
});
app.post('/api/v1/brain/share', userMiddleware, async (req, res) => {
    const share = req.body.share;
    let shareLink;
    if (share) {
        shareLink = await LinkModel.create({
            userId: req.userId,
            hash: random(60)
        });
    }
    else {
        await LinkModel.deleteOne({
            userId: req.userId
        });
    }
    res.json({ hash: shareLink?.hash });
});
app.get('/api/v1/brain/:shareLink', async (req, res) => {
    const hash = req.params.shareLink;
    if (!hash) {
        res.json("Need the link");
        return;
    }
    const link = await LinkModel.findOne({ hash: hash });
    if (!link) {
        res.status(411).json("Incorrect link");
        return;
    }
    const user = await UserModel.findOne({ _id: link.userId });
    const content = await ContentModel.find({ userId: link.userId });
    console.log(user, content);
    if (!user) {
        res.status(403).json({ message: "User not found" });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
});
app.listen(3000, async () => { console.log("Server started at http://localhost:3000"); });
//# sourceMappingURL=index.js.map