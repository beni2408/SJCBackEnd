import MemberModel from "../models/memberModal.js";

// Super admin only - Change user role
export const changeUserRole = async (req, res) => {
  try {
    const { memberID, newRole } = req.body;
    
    if (!["admin", "user"].includes(newRole)) {
      return res.status(400).json({ message: "Invalid role. Only 'admin' or 'user' allowed." });
    }
    
    const member = await MemberModel.findOne({ memberID });
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    if (member.role === "super_admin") {
      return res.status(400).json({ message: "Cannot change super admin role" });
    }
    
    member.role = newRole;
    await member.save();
    
    res.status(200).json({ message: `User role changed to ${newRole} successfully` });
  } catch (error) {
    res.status(500).json({ message: "Failed to change user role", error: error.message });
  }
};

// Super admin only - Get all members with roles
export const getAllMembers = async (req, res) => {
  try {
    const members = await MemberModel.find({}, {
      password: 0
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ members });
  } catch (error) {
    res.status(500).json({ message: "Failed to get members", error: error.message });
  }
};

// Super admin only - Get members by role
export const getMembersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    if (!['admin', 'user', 'super_admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Use 'admin', 'user', or 'super_admin'" });
    }
    
    const members = await MemberModel.find({ role }, {
      password: 0
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      role,
      count: members.length,
      members 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get members by role", error: error.message });
  }
};