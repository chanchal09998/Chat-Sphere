import mongoose from "mongoose";
const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the group
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // List of user IDs in the group
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const GroupModel = mongoose.model("Group", groupSchema);
export default GroupModel;
