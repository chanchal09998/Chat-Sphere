import ChatModel from "../Models/ChatModel.js";
import GroupModel from "../Models/GroupModel.js";
import MessageModel from "../Models/MessageModel.js";

// send-message
export const sendMessage = async (req, res) => {
  const { sender, receiver, message } = req.body;

  if (!sender || !receiver || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid input data" });
  }

  try {
    // Save new message
    const newMessage = new MessageModel({
      sender,
      receiver,
      message,
      isGroupMessage: false,
    });

    const savedMessage = await newMessage.save();

    // Find existing chat between sender and receiver
    let existingChat = await ChatModel.findOne({
      members: { $all: [sender, receiver] }, // Ensures both are in the chat
      group: null,
    });

    if (existingChat) {
      existingChat.latestMessage = savedMessage._id; // Store message ID, not just text
      await existingChat.save();
    } else {
      // Create a new chat
      const newChat = new ChatModel({
        members: [sender, receiver],
        latestMessage: savedMessage._id,
      });
      await newChat.save();
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// send-group-message
export const sendGroupMessage = async (req, res) => {
  const { sender, group, message } = req.body;

  if (!sender || !group || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid input data" });
  }

  try {
    const groupAvailable = await GroupModel.findById(group);
    console.log("groupAvailable", groupAvailable);
    // Save new message
    const newMessage = new MessageModel({
      sender,
      receiver: group,
      group: group,
      message,
      isGroupMessage: true,
    });

    const savedMessage = await newMessage.save();

    // Find existing chat for the group
    let existingGroupChat = await ChatModel.findOne({
      group: group, // Ensure it's a group chat
    });

    if (existingGroupChat) {
      existingGroupChat.latestMessage = savedMessage._id;
      await existingGroupChat.save();
    } else {
      // Create new group chat
      const newGroupChat = new ChatModel({
        members: [sender, ...groupAvailable.members],
        receiver: group, // Only store sender, because group members are in the Group model
        group: group,
        groupName: groupAvailable.name, // Save group name
        latestMessage: savedMessage._id,
      });
      await newGroupChat.save();
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to send group message",
      error: error.message,
    });
  }
};
