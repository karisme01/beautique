import messageModel from "../models/messageModel.js";

export const createMessageController = async (req, res) => {
    try {
        const {userId, text} = req.body
        if (!userId || !text) {
            return res.status(400).send({ message: 'userId and text are required' });
        }
        const newMessage = new messageModel({
            userId,
            text
        });
        await newMessage.save();
        res.status(201).send({ message: 'Message created successfully', data: newMessage });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed to create messages', error });
    }
}