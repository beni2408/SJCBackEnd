import { TaxModel, TaxPaymentModel } from "../models/taxModel.js";
import { generateTaxID } from "../utils/generateTaxID.js";
import MemberModel from "../models/memberModal.js";

// Admin only - Set tax amounts (only if not exists)
export const setTaxAmount = async (req, res) => {
  try {
    const { taxType, taxYear, taxAmount } = req.body;
    
    const existingTax = await TaxModel.findOne({ taxType, taxYear });
    if (existingTax) {
      return res.status(400).json({ message: `${taxType} for ${taxYear} already exists. Use update endpoint to modify.` });
    }
    
    const taxID = generateTaxID(taxType, taxYear);
    const newTax = await TaxModel.create({ taxID, taxType, taxYear, taxAmount });
    
    res.status(201).json({ message: "Tax amount set successfully", tax: newTax });
  } catch (error) {
    res.status(500).json({ message: "Failed to set tax amount", error: error.message });
  }
};

// Admin only - Update existing tax amount
export const updateTaxAmount = async (req, res) => {
  try {
    const { taxType, taxYear, taxAmount } = req.body;
    
    const existingTax = await TaxModel.findOne({ taxType, taxYear });
    if (!existingTax) {
      return res.status(404).json({ message: "Tax not found. Use set-amount endpoint to create." });
    }
    
    existingTax.taxAmount = taxAmount;
    await existingTax.save();
    
    res.status(200).json({ message: "Tax amount updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update tax amount", error: error.message });
  }
};

// Admin only - Delete tax
export const deleteTax = async (req, res) => {
  try {
    const { taxType, taxYear } = req.body;
    
    const deletedTax = await TaxModel.findOneAndDelete({ taxType, taxYear });
    if (!deletedTax) {
      return res.status(404).json({ message: "Tax not found" });
    }
    
    res.status(200).json({ message: "Tax deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete tax", error: error.message });
  }
};

// Admin only - Get all taxes
export const getAllTaxes = async (req, res) => {
  try {
    const { year } = req.query;
    const query = year ? { taxYear: parseInt(year) } : {};
    
    const taxes = await TaxModel.find(query).sort({ taxYear: -1, taxType: 1 });
    
    res.status(200).json({ taxes });
  } catch (error) {
    res.status(500).json({ message: "Failed to get taxes", error: error.message });
  }
};

// Admin only - Record tax payment
export const recordTaxPayment = async (req, res) => {
  try {
    const { hometaxno, taxType, taxYear, amountPaid, paidBy, paidDate } = req.body;
    
    // Check if hometaxno exists
    const familyExists = await MemberModel.findOne({ hometaxno });
    if (!familyExists) {
      return res.status(400).json({ message: "Enter valid hometaxno" });
    }
    
    const existingPayment = await TaxPaymentModel.findOne({ hometaxno, taxType, taxYear });
    if (existingPayment) {
      return res.status(400).json({ message: "Tax already paid for this family" });
    }
    
    await TaxPaymentModel.create({
      hometaxno,
      taxType,
      taxYear,
      amountPaid,
      paidBy,
      paidDate,
      updatedBy: req.user.memberID
    });
    
    res.status(201).json({ message: "Tax payment recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to record tax payment", error: error.message });
  }
};

// Admin only - Update tax payment record
export const updateTaxPayment = async (req, res) => {
  try {
    const { hometaxno, taxType, taxYear, amountPaid, paidBy, paidDate } = req.body;
    
    // Check if hometaxno exists
    const familyExists = await MemberModel.findOne({ hometaxno });
    if (!familyExists) {
      return res.status(400).json({ message: "Enter valid hometaxno" });
    }
    
    const payment = await TaxPaymentModel.findOne({ hometaxno, taxType, taxYear });
    if (!payment) {
      return res.status(404).json({ message: "Tax payment record not found" });
    }
    
    payment.amountPaid = amountPaid;
    payment.paidBy = paidBy;
    payment.paidDate = paidDate;
    payment.updatedBy = req.user.memberID;
    await payment.save();
    
    res.status(200).json({ message: "Tax payment updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update tax payment", error: error.message });
  }
};

// Admin only - Delete tax payment record
export const deleteTaxPayment = async (req, res) => {
  try {
    const { hometaxno, taxType, taxYear } = req.body;
    
    const deletedPayment = await TaxPaymentModel.findOneAndDelete({ hometaxno, taxType, taxYear });
    if (!deletedPayment) {
      return res.status(404).json({ message: "Tax payment record not found" });
    }
    
    res.status(200).json({ message: "Tax payment record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete tax payment", error: error.message });
  }
};

// Get tax status for user's own family
export const getTaxStatus = async (req, res) => {
  try {
    const { hometaxno } = req.params;
    const currentYear = new Date().getFullYear();
    
    // Check if user belongs to this hometaxno or is admin
    if (req.user.hometaxno !== hometaxno && req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied. You can only check your own family's tax status." });
    }
    
    const taxes = await TaxModel.find({ taxYear: currentYear, status: "active" });
    const payments = await TaxPaymentModel.find({ hometaxno, taxYear: currentYear });
    
    const pendingTaxes = [];
    const paidTaxes = [];
    
    taxes.forEach(tax => {
      const payment = payments.find(p => p.taxType === tax.taxType);
      
      // Generate taxID if missing (for old taxes)
      let taxID = tax.taxID;
      if (!taxID) {
        taxID = generateTaxID(tax.taxType, tax.taxYear);
      }
      
      const taxInfo = {
        taxID: taxID,
        taxType: tax.taxType,
        taxAmount: tax.taxAmount,
        taxYear: tax.taxYear
      };
      
      if (payment) {
        paidTaxes.push({
          ...taxInfo,
          paidAmount: payment.amountPaid,
          paidBy: payment.paidBy,
          paidDate: payment.paidDate,
          paymentDate: payment.createdAt,
          recordedBy: payment.updatedBy,
          recordedAt: payment.createdAt
        });
      } else {
        pendingTaxes.push({
          ...taxInfo,
          status: "pending",
          dueDate: `December 31, ${currentYear}`
        });
      }
    });
    
    res.status(200).json({ 
      hometaxno,
      year: currentYear,
      pendingTaxes,
      paidTaxes,
      summary: {
        totalTaxes: taxes.length,
        paidCount: paidTaxes.length,
        pendingCount: pendingTaxes.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get tax status", error: error.message });
  }
};

// Admin only - Get tax overview by Tax ID
export const getTaxOverviewByID = async (req, res) => {
  try {
    const { taxID } = req.params;
    
    const tax = await TaxModel.findOne({ taxID });
    if (!tax) {
      return res.status(404).json({ message: "Tax not found" });
    }
    
    const payments = await TaxPaymentModel.find({ taxType: tax.taxType, taxYear: tax.taxYear });
    
    const paidFamilies = payments.map(p => ({
      hometaxno: p.hometaxno,
      paidAmount: p.amountPaid,
      paidBy: p.paidBy,
      paidDate: p.paidDate,
      paymentDate: p.createdAt,
      recordedBy: p.updatedBy,
      recordedAt: p.createdAt
    }));
    
    // Get actual count of unique families (hometaxno) from members
    const uniqueHometaxnos = await MemberModel.distinct("hometaxno");
    const totalFamiliesCount = uniqueHometaxnos.length;
    
    // Get list of families who haven't paid
    const paidHometaxnos = payments.map(p => p.hometaxno);
    const pendingFamilies = uniqueHometaxnos
      .filter(hometaxno => !paidHometaxnos.includes(hometaxno))
      .map(hometaxno => ({
        hometaxno,
        taxAmount: tax.taxAmount,
        status: "pending",
        dueDate: `December 31, ${tax.taxYear}`
      }));
    
    const totalPaidAmount = payments.reduce((sum, p) => sum + p.amountPaid, 0);
    const paidFamiliesCount = paidFamilies.length;
    const pendingFamiliesCount = pendingFamilies.length;
    const expectedTotalAmount = totalFamiliesCount * tax.taxAmount;
    
    res.status(200).json({
      taxInfo: {
        taxID: tax.taxID,
        taxType: tax.taxType,
        taxYear: tax.taxYear,
        taxAmount: tax.taxAmount
      },
      statistics: {
        totalFamilies: totalFamiliesCount,
        paidFamilies: paidFamiliesCount,
        pendingFamilies: pendingFamiliesCount,
        paidPercentage: Math.round((paidFamiliesCount / totalFamiliesCount) * 100),
        totalPaidAmount,
        expectedTotalAmount,
        pendingAmount: expectedTotalAmount - totalPaidAmount
      },
      paidFamilies,
      pendingFamilies
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get tax overview by ID", error: error.message });
  }
};