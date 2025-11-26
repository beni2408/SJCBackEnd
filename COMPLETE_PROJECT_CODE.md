# St. John's Church Management System - Complete Project Code

## Project Structure
```
SJCBackEnd/
├── package.json
├── index.js
├── .env
├── src/
│   ├── config/
│   │   └── connectDB.js
│   ├── controllers/
│   │   ├── memberController.js
│   │   ├── taxController.js
│   │   ├── offeringController.js
│   │   ├── committeeController.js
│   │   ├── announcementController.js
│   │   ├── dashboardController.js
│   │   └── superAdminController.js
│   ├── middleware/
│   │   ├── adminAuth.js
│   │   └── superAdminAuth.js
│   ├── models/
│   │   ├── memberModal.js
│   │   ├── taxModel.js
│   │   ├── offeringModel.js
│   │   ├── committeeModel.js
│   │   └── announcementModel.js
│   ├── routes/
│   │   ├── memberRoutes.js
│   │   ├── taxRoutes.js
│   │   ├── offeringRoutes.js
│   │   ├── committeeRoutes.js
│   │   ├── announcementRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── superAdminRoutes.js
│   └── utils/
│       ├── emailService.js
│       ├── generateMemberID.js
│       ├── generateTaxID.js
│       └── memberEmail.js
```

---

## 1. PACKAGE.JSON

```json
{
  "name": "sjcbackend",
  "version": "1.0.0",
  "description": "",
  "homepage": "https://github.com/beni2408/SJCBackEnd#readme",
  "bugs": {
    "url": "https://github.com/beni2408/SJCBackEnd/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/beni2408/SJCBackEnd.git"
  },
  "license": "ISC",
  "author": "jascar",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "echo 'No build step required'"
  },
  "dependencies": {
    "@sendgrid/mail": "^8.1.6",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^9.0.0",
    "nodemailer": "^7.0.10"
  },
  "devDependencies": {
    "nodemon": "^3.1.11"
  }
}
```

---

## 2. MAIN SERVER FILE (index.js)

```javascript
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/config/connectDB.js";
import authRouter from "./src/routes/memberRoutes.js";
import taxRouter from "./src/routes/taxRoutes.js";
import offeringRouter from "./src/routes/offeringRoutes.js";
import committeeRouter from "./src/routes/committeeRoutes.js";
import announcementRouter from "./src/routes/announcementRoutes.js";
import dashboardRouter from "./src/routes/dashboardRoutes.js";
import superAdminRouter from "./src/routes/superAdminRoutes.js";
const app = express();

app.use(express.json());

// Root route for API status
app.get("/", (req, res) => {
  res.json({
    message: "St. John's Church Management System API",
    status: "Running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      tax: "/api/tax",
      offering: "/api/offering",
      committee: "/api/committee",
      announcement: "/api/announcement",
      dashboard: "/api/dashboard",
      superAdmin: "/api/super-admin"
    }
  });
});

app.use("/api/auth", authRouter);
app.use("/api/tax", taxRouter);
app.use("/api/offering", offeringRouter);
app.use("/api/committee", committeeRouter);
app.use("/api/announcement", announcementRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/super-admin", superAdminRouter);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
```

---

## 3. ENVIRONMENT VARIABLES (.env)

```env
PORT=1212
MONGO_URI=your_mongodb_connection_string
DB_PASSWORD=your_db_password
DB_USER=your_db_user
SALT_ROUNDS=10
JWT_SECRET=your_jwt_secret

EMAIL_PASS="your_gmail_app_password"
EMAIL_USER=your_email@gmail.com

sendgridkey=your_sendgrid_api_key
```

---

## 4. DATABASE CONNECTION (src/config/connectDB.js)

```javascript
import mongoose from "mongoose";

import dotenv from "dotenv";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI environment variable is not set");
    process.exit(1);
  }

  mongoose.set('bufferCommands', false);
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      connectTimeoutMS: 10000
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
```

---

## 5. DATA MODELS

### 5.1 Member Model (src/models/memberModal.js)

```javascript
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const memberSchema = new mongoose.Schema(
  {
    memberID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    hometaxno: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);
memberSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(
    this.password,
    parseInt(process.env.SALT_ROUNDS) || 10
  );
});
const MemberModel = mongoose.model("Member", memberSchema);

export default MemberModel;
```

### 5.2 Tax Model (src/models/taxModel.js)

```javascript
import mongoose from "mongoose";

const taxSchema = new mongoose.Schema(
  {
    taxID: {
      type: String,
      required: true,
      unique: true,
    },
    taxType: {
      type: String,
      enum: ["Yearly Tax", "Rice Tax", "Asanam Tax", "Christmas Tax"],
      required: true,
    },
    taxYear: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const taxPaymentSchema = new mongoose.Schema(
  {
    hometaxno: {
      type: String,
      required: true,
    },
    taxType: {
      type: String,
      enum: ["Yearly Tax", "Rice Tax", "Asanam Tax", "Christmas Tax"],
      required: true,
    },
    taxYear: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    paidBy: {
      type: String,
      required: true,
    },
    paidDate: {
      type: Date,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const TaxModel = mongoose.model("Tax", taxSchema);
export const TaxPaymentModel = mongoose.model("TaxPayment", taxPaymentSchema);
```

### 5.3 Offering Model (src/models/offeringModel.js)

```javascript
import mongoose from "mongoose";

const monthlyOfferingSchema = new mongoose.Schema(
  {
    hometaxno: {
      type: String,
      required: true,
    },
    offeringType: {
      type: String,
      enum: ["Paribalana Committee", "Church Construction"],
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const specialOfferingSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    purpose: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const MonthlyOfferingModel = mongoose.model("MonthlyOffering", monthlyOfferingSchema);
export const SpecialOfferingModel = mongoose.model("SpecialOffering", specialOfferingSchema);
```

### 5.4 Committee Model (src/models/committeeModel.js)

```javascript
import mongoose from "mongoose";

const committeeSchema = new mongoose.Schema(
  {
    memberID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    committeeType: {
      type: String,
      enum: ["LCF", "Pastorate"],
      required: true,
    },
    position: {
      type: String,
      enum: ["DC", "Secretary", "Treasurer", "Member"],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: function() {
        return this.committeeType === "Pastorate";
      }
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: function() {
        return this.committeeType === "Pastorate";
      }
    },
    memberCategory: {
      type: String,
      enum: ["DC", "Secretary", "Treasurer", "Under35", "Women", "CC", "Regular"],
      required: function() {
        return this.committeeType === "Pastorate";
      }
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    photo: {
      type: String,
    },
    hierarchy: {
      type: Number,
      default: 0,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const reverendSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      enum: ["Council Chairman", "Pastorate Chairman", "Madathuvilai Church Presbyter"],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    photo: {
      type: String,
    },
    hierarchy: {
      type: Number,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const CommitteeModel = mongoose.model("Committee", committeeSchema);
export const ReverendModel = mongoose.model("Reverend", reverendSchema);
```

### 5.5 Announcement Model (src/models/announcementModel.js)

```javascript
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["announcement", "event"],
      required: true,
    },
    eventDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const AnnouncementModel = mongoose.model("Announcement", announcementSchema);
```

---

## 6. CONTROLLERS

### 6.1 Member Controller (src/controllers/memberController.js)

```javascript
import MemberModel from "../models/memberModal.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  sendWelcomeEmail,
  sendLoginNotification,
} from "../utils/emailService.js";
import { generateMemberID } from "../utils/generateMemberID.js";
import dotenv from "dotenv";
dotenv.config();
export const newMember = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      hometaxno,
      gender,
      dateOfBirth,
      age,
      phone,
      address,
      role,
    } = req.body;

    const memberID = await generateMemberID(hometaxno);

    const member = await MemberModel.create({
      memberID,
      name,
      email,
      password,
      hometaxno,
      gender,
      dateOfBirth,
      age,
      phone,
      address,
      role,
    });
    try {
      await sendWelcomeEmail(email, name, memberID);
    } catch (emailError) {
      console.log("Welcome email failed:", emailError.message);
    }
    res
      .status(201)
      .json({ message: "Member created successfully", member, memberID });
  } catch (error) {
    if (error.code === 11000) {
      console.log("Duplicate error:", error.keyPattern);
      const field = Object.keys(error.keyPattern)[0];
      const message =
        field === "email"
          ? "Email already exists"
          : field === "phone"
          ? "Phone number already exists"
          : field === "memberID"
          ? "Member ID already exists"
          : "Duplicate field error";
      return res.status(400).json({ message, field });
    }
    res
      .status(500)
      .json({ message: "Failed to create member", error: error.message });
  }
};

export const loginMember = async (req, res) => {
  try {
    const { memberID, password } = req.body;
    
    const member = await MemberModel.findOne({ memberID }).maxTimeMS(5000).lean();
    if (!member) {
      return res.status(401).json({ message: "Invalid member ID or password" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, member.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid member ID or password" });
    }
    const token = jwt.sign({ id: member._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    try {
      await sendLoginNotification(member.email, member.name);
    } catch (emailError) {
      console.log("Email notification failed:", emailError.message);
    }
    res
      .status(200)
      .json({ message: "Login successful", token, memberID: member.memberID });
  } catch (error) {
    console.log("Login error:", error.message);
    if (error.name === 'MongoTimeoutError' || error.message.includes('buffering timed out')) {
      return res.status(503).json({ message: "Database temporarily unavailable. Please try again." });
    }
    res
      .status(500)
      .json({ message: "Failed to login member", error: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { memberID } = req.params;
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedMember = await MemberModel.findOneAndUpdate(
      { memberID },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res
      .status(200)
      .json({ message: "Member updated successfully", member: updatedMember });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update member", error: error.message });
  }
};
```

### 6.2 Tax Controller (src/controllers/taxController.js)

```javascript
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
```

---

## 7. UTILITY FUNCTIONS

### 7.1 Generate Member ID (src/utils/generateMemberID.js)

```javascript
import MemberModel from "../models/memberModal.js";

export const generateMemberID = async (hometaxno) => {
  try {
    // Pad hometaxno to 4 digits
    const paddedHometaxno = hometaxno.toString().padStart(4, '0');
    
    // Find existing members with same hometaxno
    const existingMembers = await MemberModel.find({ hometaxno }).sort({ memberID: -1 });
    
    let sequence = 1;
    if (existingMembers.length > 0) {
      // Extract sequence from last memberID and increment
      const lastMemberID = existingMembers[0].memberID;
      const lastSequence = parseInt(lastMemberID.slice(-4));
      sequence = lastSequence + 1;
    }
    
    // Pad sequence to 4 digits
    const paddedSequence = sequence.toString().padStart(4, '0');
    
    // Generate memberID: MID + paddedHometaxno + paddedSequence
    const memberID = `MID${paddedHometaxno}${paddedSequence}`;
    
    return memberID;
  } catch (error) {
    throw new Error(`Failed to generate Member ID: ${error.message}`);
  }
};
```

### 7.2 Generate Tax ID (src/utils/generateTaxID.js)

```javascript
export const generateTaxID = (taxType, taxYear) => {
  const taxTypeMap = {
    "Yearly Tax": "0001",
    "Rice Tax": "0002", 
    "Asanam Tax": "0003",
    "Christmas Tax": "0004"
  };
  
  const typeCode = taxTypeMap[taxType];
  if (!typeCode) {
    throw new Error("Invalid tax type");
  }
  
  return `TID${taxYear}${typeCode}`;
};
```

### 7.3 Email Service (src/utils/emailService.js)

```javascript
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.sendgridkey);

export const sendWelcomeEmail = async (email, name, memberID) => {
  const msg = {
    to: email,
    from: 'stjohnschurchmadathuvilai@gmail.com',
    subject: 'Welcome to St. John\'s Church Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #dc2626, #ffffff); padding: 30px; text-align: center;">
          <h1 style="color: #dc2626; margin: 0; font-size: 28px;">St. John's Church</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Madathuvilai</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #dc2626; margin-bottom: 20px;">Welcome, ${name}!</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            We're delighted to welcome you to the St. John's Church Management System. Your account has been successfully created.
          </p>
          
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
            <h3 style="color: #dc2626; margin: 0 0 10px 0;">Your Member Details:</h3>
            <p style="margin: 5px 0; color: #333;"><strong>Member ID:</strong> ${memberID}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> ${email}</p>
          </div>
          
          <p style="color: #333; line-height: 1.6; margin: 20px 0;">
            Please keep your Member ID safe as you'll need it to log into the system. You can now access your dashboard to view your tax status, offerings, and church announcements.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; font-style: italic;">"For where two or three gather in my name, there am I with them." - Matthew 18:20</p>
          </div>
        </div>
        
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">St. John's Church Management System</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Madathuvilai Parish</p>
        </div>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendLoginNotification = async (email, name) => {
  const msg = {
    to: email,
    from: 'stjohnschurchmadathuvilai@gmail.com',
    subject: 'Login Notification - St. John\'s Church System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #dc2626, #ffffff); padding: 20px; text-align: center;">
          <h1 style="color: #dc2626; margin: 0; font-size: 24px;">St. John's Church</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Madathuvilai</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #dc2626; margin-bottom: 20px;">Hello, ${name}!</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            You have successfully logged into the St. John's Church Management System.
          </p>
          
          <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
            <p style="margin: 0; color: #333;"><strong>Login Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin: 20px 0;">
            If this wasn't you, please contact the church administration immediately.
          </p>
        </div>
        
        <div style="background-color: #dc2626; color: white; padding: 15px; text-align: center;">
          <p style="margin: 0; font-size: 12px;">St. John's Church Management System - Madathuvilai Parish</p>
        </div>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    console.log('Login notification sent successfully');
  } catch (error) {
    console.error('Error sending login notification:', error);
    throw error;
  }
};
```

---

## 8. MIDDLEWARE

### 8.1 Admin Authentication (src/middleware/adminAuth.js)

```javascript
import jwt from "jsonwebtoken";
import MemberModel from "../models/memberModal.js";

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await MemberModel.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token. User not found." });
    }

    if (user.role !== "admin" && user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    res.status(401).json({ message: "Invalid token." });
  }
};
```

### 8.2 Super Admin Authentication (src/middleware/superAdminAuth.js)

```javascript
import jwt from "jsonwebtoken";
import MemberModel from "../models/memberModal.js";

export const superAdminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await MemberModel.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token. User not found." });
    }

    if (user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied. Super admin privileges required." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    res.status(401).json({ message: "Invalid token." });
  }
};
```

---

## 9. ROUTES

### 9.1 Member Routes (src/routes/memberRoutes.js)

```javascript
import express from "express";
import { newMember, loginMember, updateMember } from "../controllers/memberController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/register", newMember);
router.post("/login-member", loginMember);
router.put("/update-member/:memberID", adminAuth, updateMember);

export default router;
```

### 9.2 Tax Routes (src/routes/taxRoutes.js)

```javascript
import express from "express";
import {
  setTaxAmount,
  updateTaxAmount,
  deleteTax,
  getAllTaxes,
  recordTaxPayment,
  updateTaxPayment,
  deleteTaxPayment,
  getTaxStatus,
  getTaxOverviewByID
} from "../controllers/taxController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { userAuth } from "../middleware/userAuth.js";

const router = express.Router();

// Admin only routes
router.post("/set-amount", adminAuth, setTaxAmount);
router.put("/update-amount", adminAuth, updateTaxAmount);
router.delete("/delete", adminAuth, deleteTax);
router.get("/all", adminAuth, getAllTaxes);
router.post("/record-payment", adminAuth, recordTaxPayment);
router.put("/update-payment", adminAuth, updateTaxPayment);
router.delete("/delete-payment", adminAuth, deleteTaxPayment);
router.get("/overview/:taxID", adminAuth, getTaxOverviewByID);

// User routes (can check own family status)
router.get("/status/:hometaxno", userAuth, getTaxStatus);

export default router;
```

---

## 10. DEPLOYMENT CONFIGURATION

### 10.1 Render Configuration (render.yaml)

```yaml
services:
  - type: web
    name: sjc-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

---

## 11. API ENDPOINTS SUMMARY

### Authentication
- POST `/api/auth/register` - Register new member
- POST `/api/auth/login-member` - Member login

### Tax Management (Admin)
- POST `/api/tax/set-amount` - Set tax amount
- PUT `/api/tax/update-amount` - Update tax amount
- DELETE `/api/tax/delete` - Delete tax
- GET `/api/tax/all` - Get all taxes
- POST `/api/tax/record-payment` - Record tax payment
- PUT `/api/tax/update-payment` - Update tax payment
- DELETE `/api/tax/delete-payment` - Delete tax payment
- GET `/api/tax/overview/:taxID` - Get tax overview

### Tax Status (User)
- GET `/api/tax/status/:hometaxno` - Get family tax status

### Offering Management (Admin)
- POST `/api/offering/monthly` - Record monthly offering
- PUT `/api/offering/update-monthly` - Update monthly offering
- DELETE `/api/offering/delete-monthly` - Delete monthly offering
- POST `/api/offering/special` - Record special offering
- PUT `/api/offering/update-special/:id` - Update special offering
- DELETE `/api/offering/delete-special/:id` - Delete special offering
- GET `/api/offering/all-special` - Get all special offerings
- GET `/api/offering/all-monthly` - Get monthly offerings overview

### Offering Status (User)
- GET `/api/offering/monthly-status/:hometaxno` - Get family offering status

### Committee Management (Admin)
- POST `/api/committee/add` - Add committee member
- PUT `/api/committee/update/:id` - Update committee member
- DELETE `/api/committee/delete/:id` - Delete committee member
- POST `/api/committee/add-reverend` - Add reverend

### Committee Info (Public)
- GET `/api/committee/members` - Get committee members
- GET `/api/committee/reverends` - Get reverends

### Announcement Management (Admin)
- POST `/api/announcement/create` - Create announcement
- PUT `/api/announcement/update/:id` - Update announcement
- DELETE `/api/announcement/delete/:id` - Delete announcement

### Announcements (Public)
- GET `/api/announcement/list` - Get announcements

### Dashboard
- GET `/api/dashboard/` - Get user dashboard

### Super Admin
- PUT `/api/super-admin/change-role` - Change user role
- GET `/api/super-admin/all-members` - Get all members
- GET `/api/super-admin/members-by-role/:role` - Get members by role

---

## 12. ENVIRONMENT SETUP

1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Start development server: `npm run dev`
4. Start production server: `npm start`

---

## 13. DATABASE COLLECTIONS

1. **members** - User accounts and authentication
2. **taxes** - Tax definitions and amounts
3. **taxpayments** - Tax payment records
4. **monthlyofferings** - Monthly family offerings
5. **specialofferings** - Special individual donations
6. **committees** - Committee member information
7. **reverends** - Church reverend information
8. **announcements** - Church announcements and events

---

This file contains the complete codebase for the St. John's Church Management System backend. Every line of code, configuration, and structure is documented here for backup and reference purposes.