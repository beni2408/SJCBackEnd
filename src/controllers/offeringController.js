import { MonthlyOfferingModel, SpecialOfferingModel } from "../models/offeringModel.js";

// Admin only - Record monthly offering
export const recordMonthlyOffering = async (req, res) => {
  try {
    const { hometaxno, offeringType, month, year, amount } = req.body;
    
    const existingOffering = await MonthlyOfferingModel.findOne({ hometaxno, offeringType, month, year });
    if (existingOffering) {
      existingOffering.amount = amount;
      existingOffering.updatedBy = req.user.memberID;
      await existingOffering.save();
    } else {
      await MonthlyOfferingModel.create({
        hometaxno,
        offeringType,
        month,
        year,
        amount,
        updatedBy: req.user.memberID
      });
    }
    
    res.status(201).json({ message: "Monthly offering recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to record monthly offering", error: error.message });
  }
};

// Admin only - Record special offering
export const recordSpecialOffering = async (req, res) => {
  try {
    const { donorName, amount, purpose, date } = req.body;
    
    await SpecialOfferingModel.create({
      donorName,
      amount,
      purpose,
      date,
      updatedBy: req.user.memberID
    });
    
    res.status(201).json({ message: "Special offering recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to record special offering", error: error.message });
  }
};

// Get monthly offering status for user's own family
export const getMonthlyOfferingStatus = async (req, res) => {
  try {
    const { hometaxno } = req.params;
    const currentYear = new Date().getFullYear();
    
    // Check if user belongs to this hometaxno or is admin
    if (req.user.hometaxno !== hometaxno && req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied. You can only check your own family's offering status." });
    }
    
    const offerings = await MonthlyOfferingModel.find({ 
      hometaxno, 
      year: currentYear 
    });
    
    const offeringTypes = ["Paribalana Committee", "Church Construction"];
    const status = offeringTypes.map(type => {
      const monthlyStatus = [];
      for (let month = 1; month <= 12; month++) {
        const offering = offerings.find(o => o.offeringType === type && o.month === month);
        monthlyStatus.push({
          month,
          paid: !!offering,
          amount: offering?.amount || 0
        });
      }
      return {
        offeringType: type,
        monthlyStatus
      };
    });
    
    res.status(200).json({ offeringStatus: status });
  } catch (error) {
    res.status(500).json({ message: "Failed to get offering status", error: error.message });
  }
};