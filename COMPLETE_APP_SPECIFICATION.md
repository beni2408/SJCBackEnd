# St. John's Church Management System - Complete Application Specification

## 🏛️ **APPLICATION OVERVIEW**

This is a comprehensive church management system for **St. John's Church Madathuvilai** designed to manage 250+ families, their taxes, offerings, committees, and church activities. The system uses a family-based approach with unique home tax numbers (hometaxno) for each family.

---

## 🎨 **DESIGN THEME**
- **Primary Colors**: White and Red
- **Logo**: Church logo in white and red theme
- **Style**: Clean, professional church management interface
- **Responsive**: Mobile and desktop friendly

---

## 👥 **USER ROLES & PERMISSIONS**

### **Super Admin (You - MID00230002)**
- Complete system control
- Change user roles (admin ↔ user)
- All admin capabilities
- View all members by role
- Cannot be demoted by other admins

### **Admin**
- Manage taxes, offerings, committees
- Create announcements and events
- Update member details
- View all financial data
- Cannot change user roles

### **User (Church Members)**
- View own family's tax/offering status
- View announcements and events
- View committee members
- View dashboard with personal data
- Cannot modify any data

---

## 🏠 **FAMILY-BASED SYSTEM**

### **Home Tax Number (hometaxno)**
- Each family has unique hometaxno (e.g., "23", "47", "123")
- Multiple members can belong to same family
- All taxes and monthly offerings are family-based
- Members share same hometaxno but have unique Member IDs

### **Member ID Generation**
- Format: `MID{padded_hometaxno}{sequence}`
- Examples:
  - Family 23: MID00230001, MID00230002, MID00230003
  - Family 123: MID01230001, MID01230002
- Auto-increments for each family member
- Always 11 characters long

---

## 💰 **TAX MANAGEMENT SYSTEM**

### **Tax Types & IDs**
1. **Yearly Tax** → TID{YEAR}0001 (e.g., TID20250001)
2. **Rice Tax** → TID{YEAR}0002 (e.g., TID20250002)
3. **Asanam Tax** → TID{YEAR}0003 (e.g., TID20250003)
4. **Christmas Tax** → TID{YEAR}0004 (e.g., TID20250004)

### **Tax Features**
- **Family-based**: One payment per family per tax type per year
- **Admin Control**: Set, update, delete tax amounts
- **Payment Tracking**: Record who paid, when, and which admin recorded it
- **Status Tracking**: Pending vs Paid with complete details
- **Validation**: Prevents duplicate payments
- **Statistics**: Overview of collection progress

### **Tax Workflow**
1. Admin sets tax amount for year (e.g., Rice Tax 2025 = ₹600)
2. Tax becomes active for all families
3. Admin records payment when family pays
4. System tracks: amount, paidBy (MemberID), date, recordedBy (Admin)
5. Family status changes from pending to paid

---

## 🎁 **OFFERING MANAGEMENT SYSTEM**

### **Monthly Offerings (Family-based)**
1. **Paribalana Committee** - Monthly family offering
2. **Church Construction** - Monthly building fund offering

**Rules:**
- One offering per family per month per type
- No Member ID needed (family-based)
- Admin records: hometaxno + amount + month/year
- Prevents duplicate entries for same month
- Can update/delete if mistakes made

### **Special Offerings (Individual donations)**
- **Flexible donations** from anyone (members/visitors/other churches)
- **Only amount required** - all other fields optional
- **Optional fields**: donorName, email, mobile, address, description, purpose
- **Use cases**: Prayer offerings, anonymous donations, urgent situations
- **No restrictions**: Multiple per day allowed

### **Offering Features**
- **Admin tracking**: Who recorded each offering and when
- **Monthly overview**: See all families' payment status
- **Statistics**: Collection progress, paid vs pending families
- **Validation**: Prevents duplicate monthly offerings

---

## 🏛️ **COMMITTEE MANAGEMENT SYSTEM**

### **LCF Committee**
- **Unlimited members** allowed
- **Positions**: Secretary, Treasurer, Member
- **Restrictions**: Only 1 Secretary and 1 Treasurer per year
- **Hierarchy**: Secretary (1), Treasurer (2), Members (3)
- **Requirements**: Valid Member ID

### **Pastorate Committee (18 Members Max)**
- **Positions**: DC, Secretary, Treasurer, Member
- **Required fields**: age, gender, memberCategory
- **Strict limits**:
  - 2 DC members (hierarchy 1-2, older gets priority)
  - 1 Secretary (hierarchy 3)
  - 1 Treasurer (hierarchy 4)
  - Max 2 Under35 members
  - Max 2 Women members
  - Max 3 CC members
  - Rest ordered by age (older = lower hierarchy)

### **Member Categories**
- **DC**: District Committee members
- **Secretary**: Committee secretary
- **Treasurer**: Committee treasurer
- **Under35**: Members under 35 years
- **Women**: Female members
- **CC**: Council Chairman's nominees
- **Regular**: Other members

### **Reverend List (Separate System)**
1. **Council Chairman** (hierarchy 1)
2. **Pastorate Chairman** (hierarchy 2)
3. **Madathuvilai Church Presbyter** (hierarchy 3)

---

## 📢 **ANNOUNCEMENT & EVENT SYSTEM**

### **Content Types**
- **Announcements**: General church notices
- **Events**: Scheduled church activities with dates

### **Features**
- **Priority levels**: Low, Medium, High
- **Status control**: Active/Inactive
- **Event dates**: For scheduled events
- **Admin tracking**: Who created/updated
- **Filtering**: View by type (announcement/event)

### **Examples**
- Sunday service timings
- Special prayer meetings
- Christmas celebrations
- Church construction updates

---

## 📊 **DASHBOARD SYSTEM**

### **User Dashboard**
- **Personal info**: Name, Member ID, hometaxno
- **Pending taxes**: What needs to be paid with due dates
- **Paid taxes**: Payment history with details
- **Monthly offerings**: Current month status
- **Recent announcements**: Latest church news
- **Upcoming events**: Scheduled activities

### **Admin Dashboard Features**
- **Tax overview**: Collection statistics by tax type
- **Offering overview**: Monthly collection progress
- **Family lists**: Who paid vs who's pending
- **Financial summaries**: Total amounts, percentages
- **Member management**: Add, update, delete members

---

## 🔐 **AUTHENTICATION & SECURITY**

### **Login System**
- **Login with**: Member ID + Password (not email)
- **JWT tokens**: Secure session management (1 hour expiry)
- **Role-based access**: Different permissions per role
- **Password hashing**: bcrypt with salt rounds
- **Session management**: Auto-logout on token expiry

### **Data Validation & Security**
- **Member ID validation**: Must exist in database before any action
- **Home tax number validation**: Must belong to registered family
- **Duplicate prevention**: No duplicate payments/offerings for same period
- **Committee limits**: Enforced member restrictions with clear error messages
- **Admin tracking**: All actions logged with admin MemberID and timestamp
- **Cross-family access**: Users can only view their own family data
- **Admin verification**: All financial transactions require admin authentication
- **Input sanitization**: All user inputs validated and sanitized
- **Error handling**: Graceful error messages, no system details exposed

## ❌ **ERROR HANDLING & EDGE CASES**

### **Common Error Scenarios**
- **Invalid Member ID**: "Enter valid memberID" - prevents non-existent member actions
- **Invalid hometaxno**: "Enter valid hometaxno" - prevents orphaned financial records
- **Duplicate payments**: "Tax already paid for this family" - prevents double payments
- **Duplicate offerings**: "Already the offering for [type] in month [X] has been paid"
- **Committee limits**: "Maximum 2 DC members allowed" - enforces committee rules
- **Position conflicts**: "LCF Secretary already exists for 2025" - prevents duplicates
- **Email failures**: Logged but doesn't break functionality
- **Token expiry**: Auto-redirect to login page
- **Unauthorized access**: "Access denied" with role-specific messages
- **Database errors**: Graceful handling with user-friendly messages

### **Data Integrity Measures**
- **Atomic transactions**: Financial operations are all-or-nothing
- **Referential integrity**: All foreign keys validated
- **Audit trails**: Complete history of who did what when
- **Backup considerations**: All critical data properly structured
- **Validation layers**: Frontend, backend, and database validation
- **Rollback capabilities**: Admin can correct mistakes

---

## 📧 **EMAIL NOTIFICATION SYSTEM**

### **SendGrid Integration**
- **Welcome emails**: New member registration
- **Login notifications**: Successful login alerts
- **White & red theme**: Matches app design
- **Member ID included**: In welcome emails
- **Professional templates**: Church-appropriate styling

### **Email Features**
- **Automatic sending**: On registration (welcome) and login (notification)
- **Error handling**: Graceful failure, doesn't break main functionality
- **Admin tracking**: Email send status logged
- **Template customization**: White & red church branding
- **Member ID inclusion**: Welcome emails show generated Member ID
- **SendGrid integration**: Reliable delivery for production
- **Fallback handling**: System works even if email fails
- **Professional templates**: Church-appropriate styling and content
- **Multi-language ready**: Template structure supports localization

---

## 🗄️ **DATABASE STRUCTURE**

### **Members Collection**
```javascript
{
  memberID: "MID00230001",
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  hometaxno: "23",
  gender: "male",
  dateOfBirth: "1990-01-01",
  age: 34,
  phone: "9876543210",
  address: "123 Main St",
  role: "user", // super_admin, admin, user
  createdAt: "2025-01-01T00:00:00Z"
}
```

### **Taxes Collection**
```javascript
{
  taxID: "TID20250002",
  taxType: "Rice Tax",
  taxYear: 2025,
  taxAmount: 600,
  status: "active"
}
```

### **Tax Payments Collection**
```javascript
{
  hometaxno: "23",
  taxType: "Rice Tax",
  taxYear: 2025,
  amountPaid: 600,
  paidBy: "MID00230001",
  paidDate: "2025-01-15",
  updatedBy: "MID00230002", // Admin who recorded
  createdAt: "2025-01-15T10:30:00Z"
}
```

### **Monthly Offerings Collection**
```javascript
{
  hometaxno: "23",
  offeringType: "Paribalana Committee",
  month: 1,
  year: 2025,
  amount: 100,
  updatedBy: "MID00230002", // Admin who recorded
  createdAt: "2025-01-15T10:30:00Z"
}
```

### **Special Offerings Collection**
```javascript
{
  donorName: "Anonymous", // Optional
  email: "donor@example.com", // Optional
  mobile: "9876543210", // Optional
  address: "123 Street", // Optional
  description: "For church renovation", // Optional
  purpose: "Church Construction", // Optional
  amount: 5000, // Required
  date: "2025-01-15",
  updatedBy: "MID00230002",
  createdAt: "2025-01-15T10:30:00Z"
}
```

### **Committee Members Collection**
```javascript
{
  memberID: "MID00230001",
  name: "John Doe",
  committeeType: "Pastorate", // LCF, Pastorate
  position: "DC", // DC, Secretary, Treasurer, Member
  year: 2025,
  age: 45, // Required for Pastorate
  gender: "male", // Required for Pastorate
  memberCategory: "DC", // DC, Secretary, Treasurer, Under35, Women, CC, Regular
  phone: "9876543210",
  email: "john@example.com",
  photo: "photo_url",
  hierarchy: 1,
  updatedBy: "MID00230002"
}
```

### **Reverends Collection**
```javascript
{
  name: "Rev. John Smith",
  position: "Council Chairman", // Council Chairman, Pastorate Chairman, Madathuvilai Church Presbyter
  year: 2025,
  phone: "9876543210",
  email: "rev.john@example.com",
  photo: "photo_url",
  hierarchy: 1, // 1, 2, 3
  updatedBy: "MID00230002"
}
```

### **Announcements Collection**
```javascript
{
  title: "Sunday Service",
  content: "Service starts at 9 AM",
  type: "announcement", // announcement, event
  eventDate: "2025-12-25", // For events only
  priority: "high", // low, medium, high
  status: "active", // active, inactive
  createdBy: "MID00230002",
  createdAt: "2025-01-15T10:30:00Z"
}
```

---

## 🔄 **BUSINESS WORKFLOWS**

### **New Member Registration**
1. Admin creates member account
2. System generates unique Member ID
3. Welcome email sent with Member ID
4. Member can login with Member ID + password
5. Member appears in family's hometaxno group

### **Tax Collection Process**
1. Admin sets tax amount for year (e.g., Rice Tax 2025 = ₹600)
2. All families see pending tax in dashboard
3. Family pays tax at church
4. Admin records payment with details
5. Family status updates to paid
6. Admin can view collection statistics

### **Monthly Offering Process**
1. Each month, families can give offerings
2. Admin records offering when received
3. System prevents duplicate entries for same month
4. Admin can view monthly collection overview
5. Statistics show paid vs pending families

### **Committee Formation**
1. Admin adds committee members with validation
2. System enforces member limits and positions
3. Hierarchy auto-assigned based on rules
4. Members appear in committee lists
5. Public can view committee structure

### **Announcement Distribution**
1. Admin creates announcement or event
2. Content appears in all user dashboards
3. Events show with dates
4. Priority determines display order
5. Admin can update or deactivate

---

## 🔍 **SEARCH & FILTER CAPABILITIES**

### **Member Search**
- Search by: Member ID, name, hometaxno, email, phone
- Filter by: role, registration date, family
- Sort by: name, Member ID, registration date

### **Financial Data Filtering**
- **Tax reports**: By type, year, payment status, date range
- **Offering reports**: By type, month, year, amount range
- **Family filtering**: By payment status, hometaxno, amount
- **Date range selection**: Custom date ranges for all reports

### **Committee Filtering**
- Filter by: committee type, year, position, hierarchy
- Search by: member name, Member ID, position
- Sort by: hierarchy, name, age (for Pastorate)

### **Export Capabilities**
- **PDF reports**: Tax collection, offering summaries
- **Excel exports**: Member lists, financial data
- **Print views**: Committee lists, announcements
- **Email reports**: Send summaries to church leadership

## 📊 **REPORTING SYSTEM**

### **Financial Reports**
- **Tax collection summary**: By type, year, collection percentage
- **Monthly offering reports**: Both types with family participation
- **Special offering summaries**: Total donations, donor information
- **Outstanding payments**: Families with pending taxes/offerings
- **Payment history**: Complete audit trail with admin details

### **Member Reports**
- **Family directory**: All families with contact information
- **Member statistics**: By role, registration date, activity
- **Committee membership**: Current and historical committee lists
- **Active vs inactive**: Member engagement tracking

### **Administrative Reports**
- **System usage**: Login frequency, feature usage
- **Admin activity**: Who did what when (audit trail)
- **Data integrity**: Validation reports, error summaries
- **Performance metrics**: System health, response times

## 📱 **FRONTEND REQUIREMENTS**

### **Design Guidelines**
- **Color scheme**: White background, red accents
- **Typography**: Clean, readable fonts
- **Layout**: Responsive grid system
- **Navigation**: Role-based menu structure
- **Forms**: Validation with clear error messages

### **Key Pages Needed**

#### **Authentication**
- Login page (Member ID + Password)
- Forgot password functionality
- Role-based redirects after login

#### **User Dashboard**
- Personal information display
- Pending taxes with due dates
- Paid taxes history
- Monthly offering status
- Recent announcements
- Upcoming events

#### **Admin Dashboard**
- System overview statistics
- Quick action buttons
- Recent activities
- Member management shortcuts

#### **Tax Management (Admin)**
- Set tax amounts form
- Record tax payments form
- Tax overview with statistics
- Family payment status lists
- Update/delete payment options

#### **Offering Management (Admin)**
- Record monthly offerings form
- Record special offerings form
- Monthly offering overview
- Special offerings list
- Update/delete options

#### **Committee Management (Admin)**
- Add committee members form
- Committee member lists (LCF/Pastorate)
- Reverend management
- Update/delete members
- Hierarchy display

#### **Announcement Management (Admin)**
- Create announcement/event form
- Announcements list with filters
- Update/delete announcements
- Priority and status management

#### **Member Management (Admin/Super Admin)**
- Add new members form
- Member list with search/filter
- Update member details
- Role management (Super Admin only)

#### **Public Views**
- Committee members display
- Announcements and events list
- Church information pages

### **Form Validations**
- Required field indicators
- Real-time validation feedback
- Error message display
- Success confirmations
- Loading states during API calls

### **Data Display**
- Sortable tables
- Pagination for large lists
- Search and filter functionality
- Export options for reports
- Print-friendly views

---

## 🌐 **API INTEGRATION**

### **Base URL**
```
http://localhost:1212/api
```

### **Authentication Header**
```
Authorization: Bearer <jwt_token>
```

### **Key API Endpoints**

#### **Authentication**
- `POST /auth/new-member` - Register member
- `POST /auth/login-member` - Login
- `PUT /auth/update-member/:memberID` - Update member

#### **Tax Management**
- `POST /tax/set-amount` - Set tax amount
- `POST /tax/record-payment` - Record payment
- `GET /tax/status/:hometaxno` - Get tax status
- `GET /tax/overview-by-id/:taxID` - Tax overview

#### **Offering Management**
- `POST /offering/monthly` - Record monthly offering
- `POST /offering/special` - Record special offering
- `GET /offering/all-monthly` - Monthly overview
- `GET /offering/all-special` - Special offerings list

#### **Committee Management**
- `POST /committee/add` - Add committee member
- `GET /committee/members` - Get committee members
- `POST /committee/add-reverend` - Add reverend
- `GET /committee/reverends` - Get reverends

#### **Announcements**
- `POST /announcement/create` - Create announcement
- `GET /announcement/list` - Get announcements
- `PUT /announcement/update/:id` - Update announcement

#### **Dashboard**
- `GET /dashboard/` - Get user dashboard data

#### **Super Admin**
- `PUT /super-admin/change-role` - Change user role
- `GET /super-admin/members-by-role/:role` - Get members by role

---

## 🎯 **SUCCESS METRICS**

### **System Goals**
- Manage 250+ church families efficiently
- Track all financial transactions accurately
- Maintain committee structure properly
- Communicate effectively with members
- Provide transparency in church operations

### **Key Features**
- **Family-based management**: One system for entire families
- **Financial tracking**: Complete audit trail for all money
- **Committee governance**: Proper structure with rules
- **Communication**: Announcements and events
- **Role-based access**: Security and permissions
- **Mobile-friendly**: Access from any device

---

## 🚀 **DEPLOYMENT NOTES**

### **Environment Variables**
```
PORT=1212
MONGO_URI=mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_USER=your_email@gmail.com
```

### **Production Considerations**
- HTTPS required for security
- Database backups essential
- Email service reliability
- Mobile responsiveness
- Performance optimization
- Error logging and monitoring

---

## 📞 **SUPPORT & MAINTENANCE**

### **Admin Training Required**
- How to set tax amounts
- Recording payments and offerings
- Managing committee members
- Creating announcements
- Understanding reports and statistics

### **User Training Required**
- **Login process**: Using Member ID instead of email
- **Dashboard navigation**: Understanding personal vs family data
- **Tax status checking**: Viewing pending and paid taxes
- **Offering status**: Understanding monthly offering requirements
- **Committee information**: Viewing current committee members
- **Announcements**: Staying updated with church news
- **Mobile usage**: Accessing system from phones/tablets
- **Troubleshooting**: Common issues and solutions

### **System Limitations & Boundaries**
- **Family-based**: Individual member actions limited to family data
- **Admin dependency**: All modifications require admin intervention
- **Annual cycles**: Tax and committee systems work on yearly basis
- **Monthly restrictions**: Offerings limited to one per month per type
- **Committee limits**: Strict member quotas enforced
- **Role restrictions**: Users cannot elevate their own permissions
- **Data immutability**: Historical records preserved for audit
- **Offline limitations**: Requires internet connection for all operations

---

## 🎯 **IMPLEMENTATION PRIORITIES**

### **Phase 1: Core Functionality**
1. Authentication system (login/logout)
2. User dashboard with personal data
3. Basic member management (admin)
4. Tax status viewing (users)

### **Phase 2: Financial Management**
1. Tax payment recording (admin)
2. Monthly offering management
3. Financial reports and statistics
4. Payment history tracking

### **Phase 3: Advanced Features**
1. Committee management system
2. Announcement and event system
3. Advanced reporting
4. Email notifications

### **Phase 4: Polish & Optimization**
1. Mobile optimization
2. Performance improvements
3. Advanced search and filters
4. Export capabilities

## 🔧 **TECHNICAL CONSIDERATIONS**

### **API Response Formats**
- **Success responses**: Consistent JSON structure with data and messages
- **Error responses**: Standardized error codes and user-friendly messages
- **Pagination**: For large data sets (member lists, payment history)
- **Caching**: Client-side caching for static data (committee lists, announcements)

### **State Management**
- **User session**: Login state, role, permissions
- **Dashboard data**: Personal information, pending items
- **Form states**: Validation, loading, error states
- **Navigation**: Role-based menu visibility

### **Performance Optimization**
- **Lazy loading**: Load data as needed
- **Debounced search**: Efficient search implementation
- **Optimistic updates**: Immediate UI feedback
- **Error boundaries**: Graceful error handling

---

This specification provides **COMPLETE** details for building the frontend application that integrates with the St. John's Church Management System backend. Every feature, workflow, edge case, and technical consideration has been documented to ensure successful implementation. The system is designed to be user-friendly, secure, and efficient for managing all aspects of church administration and member communication.