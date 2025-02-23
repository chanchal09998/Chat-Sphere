import MessageModel from "../Models/MessageModel.js";
import GroupModel from "../Models/GroupModel.js";

export const fetchMessages = async (req, res) => {
  const { sender, receiver } = req.body;

  try {
    // Check if receiver is a group
    const isGroup = await GroupModel.findById(receiver);

    let messages;
    if (isGroup) {
      // Fetch messages for group and populate sender name
      messages = await MessageModel.find({ group: receiver })
        .populate("sender", "name") // Populate sender's name
        .sort({ createdAt: 1 });
    } else {
      // Fetch private messages and populate sender & receiver names
      messages = await MessageModel.find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      })
        .populate("sender", "name") // Populate sender name
        .populate("receiver", "name") // Populate receiver name
        .sort({ createdAt: 1 });
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
