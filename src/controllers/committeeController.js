import { CommitteeModel, ReverendModel } from "../models/committeeModel.js";
import MemberModel from "../models/memberModal.js";

// Admin only - Add committee member
export const addCommitteeMember = async (req, res) => {
  try {
    const { memberID, name, committeeType, position, year, age, gender, memberCategory, phone, email, photo } = req.body;
    
    // Check if memberID exists
    const memberExists = await MemberModel.findOne({ memberID });
    if (!memberExists) {
      return res.status(400).json({ message: "Enter valid memberID" });
    }
    
    // Validate position for committee type
    if (committeeType === "LCF" && position === "DC") {
      return res.status(400).json({ message: "DC position is only for Pastorate Committee" });
    }
    if (committeeType === "Pastorate" && !['DC', 'Secretary', 'Treasurer', 'Member'].includes(position)) {
      return res.status(400).json({ message: "Invalid position for Pastorate Committee" });
    }
    
    // Validation for committee types
    if (committeeType === "LCF") {
      // LCF Committee validation - only one Secretary and one Treasurer allowed
      if (position === "Secretary") {
        const existingSecretary = await CommitteeModel.findOne({ committeeType: "LCF", position: "Secretary", year });
        if (existingSecretary) {
          return res.status(400).json({ message: `LCF Secretary already exists for ${year}` });
        }
      } else if (position === "Treasurer") {
        const existingTreasurer = await CommitteeModel.findOne({ committeeType: "LCF", position: "Treasurer", year });
        if (existingTreasurer) {
          return res.status(400).json({ message: `LCF Treasurer already exists for ${year}` });
        }
      }
      
      // For LCF, create member
      await CommitteeModel.create({
        memberID,
        name,
        committeeType,
        position,
        year,
        phone,
        email,
        photo,
        hierarchy: position === "Secretary" ? 1 : position === "Treasurer" ? 2 : 3,
        updatedBy: req.user.memberID
      });
      
    } else if (committeeType === "Pastorate") {
      // Pastorate Committee validation
      const currentMembers = await CommitteeModel.find({ committeeType: "Pastorate", year });
      
      // Check total members limit (18)
      if (currentMembers.length >= 18) {
        return res.status(400).json({ message: "Pastorate Committee already has maximum 18 members" });
      }
      
      // Check specific category limits
      if (memberCategory === "DC") {
        const dcCount = currentMembers.filter(m => m.memberCategory === "DC").length;
        if (dcCount >= 2) {
          return res.status(400).json({ message: "Maximum 2 DC members allowed" });
        }
      } else if (memberCategory === "Under35") {
        const under35Count = currentMembers.filter(m => m.memberCategory === "Under35").length;
        if (under35Count >= 2) {
          return res.status(400).json({ message: "Maximum 2 Under35 members allowed" });
        }
      } else if (memberCategory === "Women") {
        const womenCount = currentMembers.filter(m => m.memberCategory === "Women").length;
        if (womenCount >= 2) {
          return res.status(400).json({ message: "Maximum 2 Women members allowed" });
        }
      } else if (memberCategory === "CC") {
        const ccCount = currentMembers.filter(m => m.memberCategory === "CC").length;
        if (ccCount >= 3) {
          return res.status(400).json({ message: "Maximum 3 CC members allowed" });
        }
      } else if (memberCategory === "Secretary") {
        const existingSecretary = await CommitteeModel.findOne({ committeeType: "Pastorate", memberCategory: "Secretary", year });
        if (existingSecretary) {
          return res.status(400).json({ message: `Pastorate Secretary already exists for ${year}` });
        }
      } else if (memberCategory === "Treasurer") {
        const existingTreasurer = await CommitteeModel.findOne({ committeeType: "Pastorate", memberCategory: "Treasurer", year });
        if (existingTreasurer) {
          return res.status(400).json({ message: `Pastorate Treasurer already exists for ${year}` });
        }
      }
      
      // Auto-assign hierarchy based on category
      let hierarchy = 0;
      if (memberCategory === "DC") {
        const dcMembers = currentMembers.filter(m => m.memberCategory === "DC");
        hierarchy = dcMembers.length === 0 ? 1 : 2; // First DC gets 1, second gets 2
      } else if (memberCategory === "Secretary") {
        hierarchy = 3;
      } else if (memberCategory === "Treasurer") {
        hierarchy = 4;
      } else {
        // For other members, assign based on age (older gets lower hierarchy number)
        const otherMembers = currentMembers.filter(m => !['DC', 'Secretary', 'Treasurer'].includes(m.memberCategory));
        const olderMembers = otherMembers.filter(m => m.age > age).length;
        hierarchy = 5 + olderMembers;
      }
      
      // Set position based on memberCategory for Pastorate
      const position = memberCategory === "DC" ? "DC" : 
                      memberCategory === "Secretary" ? "Secretary" :
                      memberCategory === "Treasurer" ? "Treasurer" : "Member";
      
      await CommitteeModel.create({
        memberID,
        name,
        committeeType,
        position,
        year,
        age,
        gender,
        memberCategory,
        phone,
        email,
        photo,
        hierarchy,
        updatedBy: req.user.memberID
      });
    }
    
    res.status(201).json({ message: "Committee member added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add committee member", error: error.message });
  }
};

// Admin only - Add reverend
export const addReverend = async (req, res) => {
  try {
    const { name, position, year, phone, email, photo } = req.body;
    
    // Check if position already exists for the year
    const existingReverend = await ReverendModel.findOne({ position, year });
    if (existingReverend) {
      return res.status(400).json({ message: `${position} already exists for ${year}` });
    }
    
    // Auto-assign hierarchy based on position
    let hierarchy;
    switch (position) {
      case "Council Chairman":
        hierarchy = 1;
        break;
      case "Pastorate Chairman":
        hierarchy = 2;
        break;
      case "Madathuvilai Church Presbyter":
        hierarchy = 3;
        break;
      default:
        hierarchy = 4;
    }
    
    await ReverendModel.create({
      name,
      position,
      year,
      phone,
      email,
      photo,
      hierarchy,
      updatedBy: req.user.memberID
    });
    
    res.status(201).json({ message: "Reverend added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add reverend", error: error.message });
  }
};

// Get reverends
export const getReverends = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();
    
    const reverends = await ReverendModel.find({ year: currentYear }).sort({ hierarchy: 1 });
    
    res.status(200).json({ reverends });
  } catch (error) {
    res.status(500).json({ message: "Failed to get reverends", error: error.message });
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