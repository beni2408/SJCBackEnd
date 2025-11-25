import { MonthlyOfferingModel, SpecialOfferingModel } from "../models/offeringModel.js";
import MemberModel from "../models/memberModal.js";

// Admin only - Record monthly offering
export const recordMonthlyOffering = async (req, res) => {
  try {
    const { hometaxno, offeringType, month, year, amount } = req.body;
    
    // Check if hometaxno exists
    const familyExists = await MemberModel.findOne({ hometaxno });
    if (!familyExists) {
      return res.status(400).json({ message: "Enter valid hometaxno" });
    }
    
    const existingOffering = await MonthlyOfferingModel.findOne({ hometaxno, offeringType, month, year });
    if (existingOffering) {
      return res.status(400).json({ message: `Already the offering for ${offeringType} in month ${month} has been paid` });
    }
    
    await MonthlyOfferingModel.create({
      hometaxno,
      offeringType,
      month,
      year,
      amount,
      updatedBy: req.user.memberID
    });
    
    res.status(201).json({ message: "Monthly offering recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to record monthly offering", error: error.message });
  }
};

// Admin only - Update monthly offering
export const updateMonthlyOffering = async (req, res) => {
  try {
    const { hometaxno, offeringType, month, year, amount } = req.body;
    
    // Check if hometaxno exists
    const familyExists = await MemberModel.findOne({ hometaxno });
    if (!familyExists) {
      return res.status(400).json({ message: "Enter valid hometaxno" });
    }
    
    const existingOffering = await MonthlyOfferingModel.findOne({ hometaxno, offeringType, month, year });
    if (!existingOffering) {
      return res.status(404).json({ message: "Monthly offering record not found" });
    }
    
    existingOffering.amount = amount;
    existingOffering.updatedBy = req.user.memberID;
    await existingOffering.save();
    
    res.status(200).json({ message: "Monthly offering updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update monthly offering", error: error.message });
  }
};

// Admin only - Delete monthly offering
export const deleteMonthlyOffering = async (req, res) => {
  try {
    const { hometaxno, offeringType, month, year } = req.body;
    
    const deletedOffering = await MonthlyOfferingModel.findOneAndDelete({ hometaxno, offeringType, month, year });
    if (!deletedOffering) {
      return res.status(404).json({ message: "Monthly offering record not found" });
    }
    
    res.status(200).json({ message: "Monthly offering record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete monthly offering", error: error.message });
  }
};

// Admin only - Get all monthly offerings overview
export const getAllMonthlyOfferings = async (req, res) => {
  try {
    const { offeringType, month, year } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    
    console.log('Query params:', { offeringType, month, year });
    console.log('Searching for:', { currentMonth, currentYear });
    
    // Get all unique families
    const uniqueHometaxnos = await MemberModel.distinct("hometaxno");
    
    if (offeringType) {
      // Return specific offering type
      const offerings = await MonthlyOfferingModel.find({
        offeringType,
        month: currentMonth,
        year: currentYear
      });
      
      const paidFamilies = offerings.map(offering => ({
        hometaxno: offering.hometaxno,
        amount: offering.amount,
        recordedBy: offering.updatedBy,
        recordedAt: offering.createdAt,
        updatedAt: offering.updatedAt
      }));
      
      const paidHometaxnos = offerings.map(o => o.hometaxno);
      const pendingFamilies = uniqueHometaxnos
        .filter(hometaxno => !paidHometaxnos.includes(hometaxno))
        .map(hometaxno => ({
          hometaxno,
          status: "pending"
        }));
      
      const totalPaidAmount = offerings.reduce((sum, o) => sum + o.amount, 0);
      
      res.status(200).json({
        offeringInfo: {
          offeringType,
          month: currentMonth,
          year: currentYear
        },
        statistics: {
          totalFamilies: uniqueHometaxnos.length,
          paidFamilies: paidFamilies.length,
          pendingFamilies: pendingFamilies.length,
          paidPercentage: Math.round((paidFamilies.length / uniqueHometaxnos.length) * 100),
          totalPaidAmount
        },
        paidFamilies,
        pendingFamilies
      });
    } else {
      // Return both offering types
      const offeringTypes = ["Paribalana Committee", "Church Construction"];
      const result = {};
      
      for (const type of offeringTypes) {
        const offerings = await MonthlyOfferingModel.find({
          offeringType: type,
          month: currentMonth,
          year: currentYear
        });
        
        const paidFamilies = offerings.map(offering => ({
          hometaxno: offering.hometaxno,
          amount: offering.amount,
          recordedBy: offering.updatedBy,
          recordedAt: offering.createdAt,
          updatedAt: offering.updatedAt
        }));
        
        const paidHometaxnos = offerings.map(o => o.hometaxno);
        const pendingFamilies = uniqueHometaxnos
          .filter(hometaxno => !paidHometaxnos.includes(hometaxno))
          .map(hometaxno => ({
            hometaxno,
            status: "pending"
          }));
        
        const totalPaidAmount = offerings.reduce((sum, o) => sum + o.amount, 0);
        
        result[type] = {
          statistics: {
            totalFamilies: uniqueHometaxnos.length,
            paidFamilies: paidFamilies.length,
            pendingFamilies: pendingFamilies.length,
            paidPercentage: Math.round((paidFamilies.length / uniqueHometaxnos.length) * 100),
            totalPaidAmount
          },
          paidFamilies,
          pendingFamilies
        };
      }
      
      res.status(200).json({
        offeringInfo: {
          month: currentMonth,
          year: currentYear,
          showingAllTypes: true
        },
        offerings: result
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to get monthly offerings overview", error: error.message });
  }
};

// Admin only - Update special offering
export const updateSpecialOffering = async (req, res) => {
  try {
    const { id } = req.params;
    const { donorName, email, mobile, address, description, purpose, amount, date } = req.body;
    
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }
    
    const updatedOffering = await SpecialOfferingModel.findByIdAndUpdate(
      id,
      {
        donorName,
        email,
        mobile,
        address,
        description,
        purpose,
        amount,
        date,
        updatedBy: req.user.memberID
      },
      { new: true }
    );
    
    if (!updatedOffering) {
      return res.status(404).json({ message: "Special offering not found" });
    }
    
    res.status(200).json({ message: "Special offering updated successfully", offering: updatedOffering });
  } catch (error) {
    res.status(500).json({ message: "Failed to update special offering", error: error.message });
  }
};

// Admin only - Delete special offering
export const deleteSpecialOffering = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedOffering = await SpecialOfferingModel.findByIdAndDelete(id);
    if (!deletedOffering) {
      return res.status(404).json({ message: "Special offering not found" });
    }
    
    res.status(200).json({ message: "Special offering deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete special offering", error: error.message });
  }
};

// Admin only - Get all special offerings
export const getAllSpecialOfferings = async (req, res) => {
  try {
    const { year, month } = req.query;
    let query = {};
    
    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const offerings = await SpecialOfferingModel.find(query).sort({ date: -1 });
    const totalAmount = offerings.reduce((sum, offering) => sum + offering.amount, 0);
    
    const offeringsWithAdminDetails = offerings.map(offering => ({
      _id: offering._id,
      donorName: offering.donorName,
      email: offering.email,
      mobile: offering.mobile,
      address: offering.address,
      description: offering.description,
      purpose: offering.purpose,
      amount: offering.amount,
      date: offering.date,
      recordedBy: offering.updatedBy,
      recordedAt: offering.createdAt,
      updatedAt: offering.updatedAt
    }));
    
    res.status(200).json({
      count: offerings.length,
      totalAmount,
      offerings: offeringsWithAdminDetails
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get special offerings", error: error.message });
  }
};

// Admin only - Record special offering
export const recordSpecialOffering = async (req, res) => {
  try {
    const { donorName, email, mobile, address, description, purpose, amount, date } = req.body;
    
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }
    
    await SpecialOfferingModel.create({
      donorName,
      email,
      mobile,
      address,
      description,
      purpose,
      amount,
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
          amount: offering?.amount || 0,
          recordedBy: offering?.updatedBy || null,
          recordedAt: offering?.createdAt || null
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