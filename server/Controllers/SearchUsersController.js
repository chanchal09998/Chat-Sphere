import GroupModel from "../Models/GroupModel.js";
import User from "../Models/UserModel.js";

export const searchUsers = async (req, res) => {
  const { searchQuery, userId } = req.body;

  try {
    // Search users based on the query
    const users = await User.find({
      name: { $regex: searchQuery, $options: "i" },
      _id: { $ne: userId },
    });

    // Find groups where the user is a member
    const groups = await GroupModel.find({
      members: userId,
    }).populate("members", "name email"); // Populate members with their details

    // Map users and groups into a unified format
    const userResults = users.map((user) => ({
      type: "user", // Add a type identifier
      _id: user._id,
      name: user.name,
      email: user.email,
    }));

    const groupResults = groups.map((group) => ({
      type: "group", // Add a type identifier
      _id: group._id,
      name: group.name,
      members: group.members, // Include the populated members if needed
    }));

    // Combine users and groups into one array
    const combinedResults = [...userResults, ...groupResults];

    res.status(200).json(combinedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

export const searchIUsersForGroups = async (req, res) => {
  const { searchQuery, userId } = req.body;

  try {
    // Search users based on the query
    const users = await User.find({
      name: { $regex: searchQuery, $options: "i" },
      _id: { $ne: userId },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};
