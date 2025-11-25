import { AnnouncementModel } from "../models/announcementModel.js";

// Admin only - Create announcement/event
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, type, eventDate, priority } = req.body;
    
    await AnnouncementModel.create({
      title,
      content,
      type,
      eventDate,
      priority,
      createdBy: req.user.memberID
    });
    
    res.status(201).json({ message: "Announcement created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create announcement", error: error.message });
  }
};

// Admin only - Update announcement/event
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    res.status(200).json({ message: "Announcement updated successfully", announcement: updatedAnnouncement });
  } catch (error) {
    res.status(500).json({ message: "Failed to update announcement", error: error.message });
  }
};

// Get all active announcements and events
export const getAnnouncements = async (req, res) => {
  try {
    const { type } = req.query;
    
    const query = { status: "active" };
    if (type) query.type = type;
    
    const announcements = await AnnouncementModel.find(query)
      .sort({ priority: -1, createdAt: -1 });
    
    res.status(200).json({ announcements });
  } catch (error) {
    res.status(500).json({ message: "Failed to get announcements", error: error.message });
  }
};

// Admin only - Delete announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedAnnouncement = await AnnouncementModel.findByIdAndDelete(id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete announcement", error: error.message });
  }
};