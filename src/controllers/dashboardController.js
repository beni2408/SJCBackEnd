import { TaxModel, TaxPaymentModel } from "../models/taxModel.js";
import { MonthlyOfferingModel } from "../models/offeringModel.js";
import { AnnouncementModel } from "../models/announcementModel.js";

export const getDashboard = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const user = req.user;

    // Get pending taxes for user's family
    const taxes = await TaxModel.find({ taxYear: currentYear, status: "active" });
    const payments = await TaxPaymentModel.find({ hometaxno: user.hometaxno, taxYear: currentYear });
    
    const pendingTaxes = taxes.filter(tax => 
      !payments.some(payment => payment.taxType === tax.taxType)
    ).map(tax => ({
      taxType: tax.taxType,
      taxAmount: tax.taxAmount,
      dueDate: `December 31, ${currentYear}`
    }));

    // Get monthly offering status
    const currentMonth = new Date().getMonth() + 1;
    const monthlyOfferings = await MonthlyOfferingModel.find({
      hometaxno: user.hometaxno,
      month: currentMonth,
      year: currentYear
    });

    // Get recent announcements
    const announcements = await AnnouncementModel.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      user: {
        name: user.name,
        memberID: user.memberID,
        hometaxno: user.hometaxno
      },
      pendingTaxes,
      monthlyOfferings: monthlyOfferings.map(o => ({
        offeringType: o.offeringType,
        amount: o.amount,
        month: o.month
      })),
      announcements: announcements.map(a => ({
        title: a.title,
        content: a.content,
        type: a.type,
        priority: a.priority,
        createdAt: a.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get dashboard data", error: error.message });
  }
};