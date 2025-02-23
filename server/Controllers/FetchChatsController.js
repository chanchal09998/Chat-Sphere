import ChatModel from "../Models/ChatModel.js";

export const fetchChats = async (req, res) => {
  const { sender } = req.query;

  if (!sender) {
    return res.status(400).json({ error: "Sender is required" });
  }

  try {
    // Fetch private chats where the sender is a member
    const privateChats = await ChatModel.find({
      members: sender,
      group: null, // Ensure it's not a group chat
    })
      .populate("members", "name email ")
      .populate("latestMessage");

    // Fetch group chats where the sender is a member
    const groupChats = await ChatModel.find({
      members: sender,
      group: { $ne: null }, // Ensure it's a group chat
    })
      .populate("latestMessage")
      .populate("group", "name") // Fetch the group name
      .select("_id group groupName members latestMessage");

    // Format private chats
    const formattedPrivateChats = privateChats.map((chat) => {
      const otherMember = chat.members.find(
        (member) => member._id.toString() !== sender
      );
      return {
        type: "user",
        _id: otherMember?._id || chat._id,
        name: otherMember?.name || "Unknown User",
        email: otherMember?.email || "",
        latestMessage: chat.latestMessage
          ? {
              message: chat.latestMessage.message,
              createdAt: chat.latestMessage.createdAt,
            }
          : null,
      };
    });

    // Format group chats
    const formattedGroups = groupChats.map((chat) => ({
      type: "group",
      _id: chat.group._id, // Group ID
      name: chat.group.name, // Fetch group name from population
      members: chat.members, // Group members
      latestMessage: chat.latestMessage
        ? {
            message: chat.latestMessage.message,
            createdAt: chat.latestMessage.createdAt,
          }
        : null,
    }));

    // Send response
    res.status(200).json([...formattedPrivateChats, ...formattedGroups]);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
