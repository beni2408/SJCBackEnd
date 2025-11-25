# St. John's Church Management System - API Documentation

## Base URL: `http://localhost:1212/api`

## Authentication

- Include `Authorization: Bearer <token>` header for protected routes
- Get token from login response

---

## 1. MEMBER MANAGEMENT

### Register New Member

**POST** `/auth/new-member`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "hometaxno": "123",
  "gender": "male",
  "dateOfBirth": "1990-01-01",
  "age": 34,
  "phone": "9876543210",
  "address": "123 Main St",
  "role": "user"
}
```

### Login

**POST** `/auth/login-member`

```json
{
  "memberID": "MID01230001",
  "password": "password123"
}
```

### Update Member (Admin Only)

**PUT** `/auth/update-member/MID01230001`

```json
{
  "name": "Updated Name",
  "phone": "9876543211"
}
```

---

## 2. TAX MANAGEMENT

### Set Tax Amount (Admin Only - Create New)

**POST** `/tax/set-amount`

```json
{
  "taxType": "Rice Tax",
  "taxYear": 2025,
  "taxAmount": 600
}
```

- Creates new tax with auto-generated Tax ID (TID20250002)
- Fails if already exists

### Update Tax Amount (Admin Only)

**PUT** `/tax/update-amount`

```json
{
  "taxType": "Rice Tax",
  "taxYear": 2025,
  "taxAmount": 700
}
```

- Updates existing tax amount
- Changes apply to all families automatically

### Delete Tax (Admin Only)

**DELETE** `/tax/delete`

```json
{
  "taxType": "Rice Tax",
  "taxYear": 2025
}
```

### Get All Taxes (Admin Only)

**GET** `/tax/all?year=2025`

- Query param: `year` (optional)

### Get Tax Overview by Tax ID (Admin Only)

**GET** `/tax/overview-by-id/TID20250002`

- Shows payment statistics using Tax ID
- Replace `TID20250002` with actual Tax ID
- Returns same format as tax status with payment details

### Record Tax Payment (Admin Only)

**POST** `/tax/record-payment`

```json
{
  "hometaxno": "123",
  "taxType": "Rice Tax",
  "taxYear": 2025,
  "amountPaid": 600,
  "paidBy": "MID01230001",
  "paidDate": "2025-01-15"
}
```

### Update Tax Payment (Admin Only)

**PUT** `/tax/update-payment`

```json
{
  "hometaxno": "123",
  "taxType": "Rice Tax",
  "taxYear": 2025,
  "amountPaid": 700,
  "paidBy": "MID01230002",
  "paidDate": "2025-01-20"
}
```

### Delete Tax Payment (Admin Only)

**DELETE** `/tax/delete-payment`

```json
{
  "hometaxno": "123",
  "taxType": "Rice Tax",
  "taxYear": 2025
}
```

### Get Tax Status (Own Family Only)

**GET** `/tax/status/123`

- Replace `123` with your own hometaxno
- Users can only check their own family's tax status
- Admins can check any family's status
- Returns pending taxes and paid taxes with details

**Response:**
```json
{
  "hometaxno": "123",
  "year": 2025,
  "pendingTaxes": [
    {
      "taxID": "TID20250002",
      "taxType": "Rice Tax",
      "taxAmount": 600,
      "taxYear": 2025,
      "status": "pending",
      "dueDate": "December 31, 2025"
    }
  ],
  "paidTaxes": [
    {
      "taxID": "TID20250001",
      "taxType": "Yearly Tax",
      "taxAmount": 1000,
      "taxYear": 2025,
      "paidAmount": 1000,
      "paidBy": "MID01230001",
      "paidDate": "2025-01-15",
      "paymentDate": "2025-01-15T10:30:00Z",
      "recordedBy": "MID00230002",
      "recordedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "summary": {
    "totalTaxes": 4,
    "paidCount": 1,
    "pendingCount": 3
  }
}
```

---

## 3. OFFERING MANAGEMENT

### Record Monthly Offering (Admin Only)

**POST** `/offering/monthly`

```json
{
  "hometaxno": "123",
  "offeringType": "Paribalana Committee",
  "month": 1,
  "year": 2025,
  "amount": 100
}
```

- Fails if offering already exists for that month

### Update Monthly Offering (Admin Only)

**PUT** `/offering/update-monthly`

```json
{
  "hometaxno": "123",
  "offeringType": "Paribalana Committee",
  "month": 1,
  "year": 2025,
  "amount": 150
}
```

### Delete Monthly Offering (Admin Only)

**DELETE** `/offering/delete-monthly`

```json
{
  "hometaxno": "123",
  "offeringType": "Paribalana Committee",
  "month": 1,
  "year": 2025
}
```

### Record Special Offering (Admin Only)

**POST** `/offering/special`

```json
{
  "donorName": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "address": "123 Main St",
  "description": "For church renovation",
  "purpose": "Church Construction",
  "amount": 5000,
  "date": "2025-01-15"
}
```

- Only `amount` is required, all other fields are optional
- For urgent situations when donor details are not available

### Update Special Offering (Admin Only)

**PUT** `/offering/update-special/OFFERING_ID`

```json
{
  "donorName": "Updated Name",
  "amount": 6000,
  "date": "2025-01-16"
}
```

### Delete Special Offering (Admin Only)

**DELETE** `/offering/delete-special/OFFERING_ID`

### Get All Special Offerings (Admin Only)

**GET** `/offering/all-special?year=2025&month=1`

- Query params: `year`, `month` (both optional)
- Returns count, total amount, and list of all special offerings

### Get All Monthly Offerings Overview (Admin Only)

**GET** `/offering/all-monthly?offeringType=Paribalana Committee&month=1&year=2025`

- Query params: `offeringType`, `month`, `year` (all optional)
- Shows all families with paid/pending status
- Defaults to current month and Paribalana Committee
- **Offering Types**: "Paribalana Committee" or "Church Construction"

**Examples:**
- `/offering/all-monthly?offeringType=Paribalana Committee&month=1&year=2025` (specific type)
- `/offering/all-monthly?offeringType=Church Construction&month=2&year=2025` (specific type)
- `/offering/all-monthly` (shows BOTH offering types for current month)

**Response for specific offering type:** (same as before)

**Response for all offering types:**
```json
{
  "offeringInfo": {
    "month": 1,
    "year": 2025,
    "showingAllTypes": true
  },
  "offerings": {
    "Paribalana Committee": {
      "statistics": {
        "totalFamilies": 250,
        "paidFamilies": 45,
        "pendingFamilies": 205,
        "paidPercentage": 18,
        "totalPaidAmount": 4500
      },
      "paidFamilies": [...],
      "pendingFamilies": [...]
    },
    "Church Construction": {
      "statistics": {
        "totalFamilies": 250,
        "paidFamilies": 32,
        "pendingFamilies": 218,
        "paidPercentage": 13,
        "totalPaidAmount": 6400
      },
      "paidFamilies": [...],
      "pendingFamilies": [...]
    }
  }
}
```

**Response:**
```json
{
  "offeringInfo": {
    "offeringType": "Paribalana Committee",
    "month": 1,
    "year": 2025
  },
  "statistics": {
    "totalFamilies": 250,
    "paidFamilies": 45,
    "pendingFamilies": 205,
    "paidPercentage": 18,
    "totalPaidAmount": 4500
  },
  "paidFamilies": [
    {
      "hometaxno": "123",
      "amount": 100,
      "recordedBy": "MID00230002",
      "recordedAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pendingFamilies": [
    {
      "hometaxno": "124",
      "status": "pending"
    }
  ]
}
```

### Get Monthly Offering Status (Own Family Only)

**GET** `/offering/monthly-status/123`

- Replace `123` with your own hometaxno
- Users can only check their own family's offering status
- Admins can check any family's status

---

## 4. COMMITTEE MANAGEMENT

### Add Committee Member (Admin Only)

**POST** `/committee/add`

**For LCF Committee:**
```json
{
  "memberID": "MID01230001",
  "name": "John Doe",
  "committeeType": "LCF",
  "position": "Secretary",
  "year": 2025,
  "phone": "9876543210",
  "email": "john@example.com",
  "photo": "photo_url"
}
```

- **Valid LCF Positions**: Secretary, Treasurer, Member
- **Restrictions**: Only 1 Secretary and 1 Treasurer per year

**For Pastorate Committee:**
```json
{
  "memberID": "MID01230001",
  "name": "John Doe",
  "committeeType": "Pastorate",
  "position": "DC",
  "year": 2025,
  "age": 45,
  "gender": "male",
  "memberCategory": "DC",
  "phone": "9876543210",
  "email": "john@example.com",
  "photo": "photo_url"
}
```

- **Valid Pastorate Positions**: DC, Secretary, Treasurer, Member
- **Required Fields for Pastorate**: age, gender, memberCategory

**LCF Committee Rules:**
- **Unlimited members** allowed
- **Only 1 Secretary** per year (hierarchy 1)
- **Only 1 Treasurer** per year (hierarchy 2)
- **Unlimited Members** (hierarchy 3)
- **Valid Positions**: Secretary, Treasurer, Member

**Pastorate Committee Rules:**
- **Maximum 18 members** total
- **Only 2 DC members** (hierarchy 1-2, older person gets hierarchy 1)
- **Only 1 Secretary** (hierarchy 3)
- **Only 1 Treasurer** (hierarchy 4)
- **Maximum 2 Under35** members
- **Maximum 2 Women** members
- **Maximum 3 CC** members
- **Rest ordered by age** (older gets lower hierarchy)
- **Valid Positions**: DC, Secretary, Treasurer, Member
- **Required Fields**: age, gender, memberCategory

**Member Categories for Pastorate:** DC, Secretary, Treasurer, Under35, Women, CC, Regular
**Gender Options:** male, female

### Update Committee Member (Admin Only)

**PUT** `/committee/update/COMMITTEE_ID`

```json
{
  "position": "Vice President",
  "hierarchy": 2
}
```

### Get Committee Members

**GET** `/committee/members?type=LCF&year=2025`

- Query params: `type` (LCF/Pastorate), `year`

### Delete Committee Member (Admin Only)

**DELETE** `/committee/delete/COMMITTEE_ID`

### Add Reverend (Admin Only)

**POST** `/committee/add-reverend`

```json
{
  "name": "Rev. John Smith",
  "position": "Council Chairman",
  "year": 2025,
  "phone": "9876543210",
  "email": "rev.john@example.com",
  "photo": "photo_url"
}
```

**Reverend Positions:**
- "Council Chairman" (hierarchy 1)
- "Pastorate Chairman" (hierarchy 2)
- "Madathuvilai Church Presbyter" (hierarchy 3)

### Get Reverends

**GET** `/committee/reverends?year=2025`

- Query param: `year` (optional, defaults to current year)
- Returns reverends ordered by hierarchy

---

## 5. ANNOUNCEMENT MANAGEMENT

### Create Announcement (Admin Only)

**POST** `/announcement/create`

```json
{
  "title": "Sunday Service",
  "content": "Service starts at 9 AM",
  "type": "announcement",
  "priority": "high"
}
```

### Create Event (Admin Only)

**POST** `/announcement/create`

```json
{
  "title": "Christmas Celebration",
  "content": "Join us for Christmas celebration",
  "type": "event",
  "eventDate": "2025-12-25",
  "priority": "high"
}
```

### Update Announcement (Admin Only)

**PUT** `/announcement/update/ANNOUNCEMENT_ID`

```json
{
  "title": "Updated Title",
  "status": "inactive"
}
```

### Get Announcements

**GET** `/announcement/list?type=announcement`

- Query params: `type` (announcement/event)

### Delete Announcement (Admin Only)

**DELETE** `/announcement/delete/ANNOUNCEMENT_ID`

---

## 6. DASHBOARD

### Get Dashboard Data

**GET** `/dashboard/`

- Returns user-specific dashboard with taxes, offerings, announcements

---

## 7. SUPER ADMIN ONLY

### Change User Role (Super Admin Only)

**PUT** `/super-admin/change-role`

```json
{
  "memberID": "MID01230001",
  "newRole": "admin"
}
```

### Get All Members (Super Admin Only)

**GET** `/super-admin/all-members`

### Get Members by Role (Super Admin Only)

**GET** `/super-admin/members-by-role/admin`

- Replace `admin` with desired role: `admin`, `user`, or `super_admin`
- Returns count and list of members with that role

**Examples:**
- `/super-admin/members-by-role/admin` - Get all admins
- `/super-admin/members-by-role/user` - Get all users
- `/super-admin/members-by-role/super_admin` - Get all super admins

---

## Tax Types & Tax IDs

- "Yearly Tax" → TID{YEAR}0001 (e.g., TID20250001)
- "Rice Tax" → TID{YEAR}0002 (e.g., TID20250002)
- "Asanam Tax" → TID{YEAR}0003 (e.g., TID20250003)
- "Christmas Tax" → TID{YEAR}0004 (e.g., TID20250004)

## Offering Types

### Monthly Offerings (Family-based, no MID needed):
- "Paribalana Committee" - Monthly offering by each family
- "Church Construction" - Monthly church building construction offering
- One offering per family per month per type
- Uses only hometaxno + admin who recorded

### Special Offerings (Individual donations):
- No restrictions, can be multiple per day
- All fields optional except amount
- For urgent prayer offerings or anonymous donations

## Committee Types

- "LCF"
- "Pastorate"

## User Roles

- "super_admin" (You - MID00230002)
- "admin"
- "user"

## Priority Levels

- "low"
- "medium"
- "high"

---

## Your Super Admin Credentials

- **Member ID**: MID00230002
- **Password**: [Your registered password]
- **Role**: super_admin

Use these credentials to login and manage the entire system.
