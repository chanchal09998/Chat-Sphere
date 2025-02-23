import GroupModel from "../Models/GroupModel.js";

export const createGroup = async (req, res) => {
  const { name, members } = req.body;

  try {
    const existingGroup = await GroupModel.findOne({ name });

    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: "A group with this name already exists.",
      });
    }

    const memberIds = members.map((member) => member._id);

    // Create the new group
    const newGroup = new GroupModel({
      name,
      members: memberIds, // Store the user IDs as references
    });

    // Save the group to the database
    await newGroup.save();

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: newGroup,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the group.",
    });
  }
};
