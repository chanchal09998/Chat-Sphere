import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // The user who sent the message
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // Receiver for one-to-one messages
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    }, // Group ID for group messages
    message: { type: String, required: true }, // The message content
    isGroupMessage: { type: Boolean, default: false }, // True if the message belongs to a group chat
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const MessageModel = mongoose.model("Message", messageSchema);
export default MessageModel;
