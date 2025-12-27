import User from '../models/user.model.js';
import Message from '../models/message.model.js';

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
        
        res.status(200).json({ users: filteredUsers });
    } catch (error) {
        console.error('Error fetching users for sidebar:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};  


export const getMessages = async (req, res) => {    
    try {
        const {id: userTochatId} = req.params;
        const myId = req.user.id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userTochatId },
                { senderId: userTochatId, receiverId: myId }
            ]
        })

        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        const { text, image } = req.body;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl || "No image provided"
        });
        
        await newMessage.save();

        // todo: realtime functionality goes here with socet.io

        res.status(201).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
        console.error('Error sending message:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};