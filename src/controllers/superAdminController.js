import MemberModel from "../models/memberModal.js";

// Super Admin only - Change user role
export const changeUserRole = async (req, res) => {
  try {
    const { memberID, newRole } = req.body;
    
    const member = await MemberModel.findOne({ memberID });
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    // Prevent changing super_admin role
    if (member.role === "super_admin" && req.user.memberID !== member.memberID) {
      return res.status(403).json({ message: "Cannot change super admin role" });
    }
    
    member.role = newRole;
    await member.save();
    
    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change user role", error: error.message });
  }
};

// Super Admin only - Get all members
export const getAllMembers = async (req, res) => {
  try {
    const members = await MemberModel.find({}, { password: 0 }).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      count: members.length,
      members 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get all members", error: error.message });
  }
};

// Super Admin only - Get members by role
export const getMembersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    const members = await MemberModel.find({ role }, { password: 0 }).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      role,
      count: members.length,
      members 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get members by role", error: error.message });
  }
};