import { CommitteeModel } from "../models/committeeModel.js";

// Admin only - Add committee member
export const addCommitteeMember = async (req, res) => {
  try {
    const { name, committeeType, position, year, phone, email, photo, hierarchy } = req.body;
    
    await CommitteeModel.create({
      name,
      committeeType,
      position,
      year,
      phone,
      email,
      photo,
      hierarchy,
      updatedBy: req.user.memberID
    });
    
    res.status(201).json({ message: "Committee member added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add committee member", error: error.message });
  }
};

// Admin only - Update committee member
export const updateCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updatedBy = req.user.memberID;
    
    const updatedMember = await CommitteeModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedMember) {
      return res.status(404).json({ message: "Committee member not found" });
    }
    
    res.status(200).json({ message: "Committee member updated successfully", member: updatedMember });
  } catch (error) {
    res.status(500).json({ message: "Failed to update committee member", error: error.message });
  }
};

// Get committee members
export const getCommitteeMembers = async (req, res) => {
  try {
    const { type, year } = req.query;
    const currentYear = year || new Date().getFullYear();
    
    const query = { year: currentYear };
    if (type) query.committeeType = type;
    
    const members = await CommitteeModel.find(query).sort({ hierarchy: 1, createdAt: 1 });
    
    res.status(200).json({ members });
  } catch (error) {
    res.status(500).json({ message: "Failed to get committee members", error: error.message });
  }
};

// Admin only - Delete committee member
export const deleteCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedMember = await CommitteeModel.findByIdAndDelete(id);
    if (!deletedMember) {
      return res.status(404).json({ message: "Committee member not found" });
    }
    
    res.status(200).json({ message: "Committee member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete committee member", error: error.message });
  }
};