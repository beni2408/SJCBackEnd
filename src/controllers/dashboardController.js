import { TaxModel, TaxPaymentModel } from "../models/taxModel.js";
import { MonthlyOfferingModel } from "../models/offeringModel.js";
import { AnnouncementModel } from "../models/announcementModel.js";
import MemberModel from "../models/memberModal.js";

// Get dashboard data for user
export const getDashboard = async (req, res) => {
  try {
    const member = await MemberModel.findById(req.user.id);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    // Get upcoming taxes
    const taxes = await TaxModel.find({ taxYear: currentYear, status: "active" });
    const taxPayments = await TaxPaymentModel.find({ hometaxno: member.hometaxno, taxYear: currentYear });
    
    const upcomingTaxes = taxes.filter(tax => {
      return !taxPayments.some(payment => payment.taxType === tax.taxType);
    }).map(tax => ({
      taxType: tax.taxType,
      amount: tax.taxAmount,
      dueDate: `December 31, ${currentYear}`
    }));
    
    // Get monthly offering status
    const monthlyOfferings = await MonthlyOfferingModel.find({ 
      hometaxno: member.hometaxno, 
      year: currentYear,
      month: currentMonth
    });
    
    const offeringTypes = ["Paribalana Committee", "Church Construction"];
    const pendingOfferings = offeringTypes.filter(type => {
      return !monthlyOfferings.some(offering => offering.offeringType === type);
    });
    
    // Get recent announcements
    const announcements = await AnnouncementModel.find({ status: "active" })
      .sort({ priority: -1, createdAt: -1 })
      .limit(5);
    
    // Get upcoming events
    const upcomingEvents = await AnnouncementModel.find({ 
      type: "event", 
      status: "active",
      eventDate: { $gte: new Date() }
    })
      .sort({ eventDate: 1 })
      .limit(3);
    
    res.status(200).json({
      member: {
        name: member.name,
        memberID: member.memberID,
        hometaxno: member.hometaxno
      },
      upcomingTaxes,
      pendingOfferings,
      announcements,
      upcomingEvents
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get dashboard data", error: error.message });
  }
};