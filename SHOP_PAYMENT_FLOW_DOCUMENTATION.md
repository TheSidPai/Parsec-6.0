# Parsec 6.0 Shop & Payment Flow - Complete Documentation

## 🎯 Overview

This document provides a comprehensive overview of the **Shop, Payment, and Admin Management System** for Parsec 6.0. It covers:
- Complete user purchase flow
- Payment submission process
- Admin verification workflow
- API endpoints required
- Backend changes needed

---

## 📋 Table of Contents

1. [User Flow: Shopping & Payment](#user-flow-shopping--payment)
2. [Admin Flow: Managing Shop & Payments](#admin-flow-managing-shop--payments)
3. [API Endpoints & Backend Requirements](#api-endpoints--backend-requirements)
4. [Payment Information Collected](#payment-information-collected)
5. [Status Management](#status-management)
6. [Points System Update](#points-system-update)

---

## 🛒 User Flow: Shopping & Payment

### Step 1: Browse Shop
**Location:** `/dashboard/shop`  
**Component:** `src/pages/dashboard/Shop.jsx`

**What Happens:**
- User views all available merchandise and event passes
- Items are fetched from backend API: `GET /api/parsec/v1/merch`
- Filter by category: All, Wearables, Accessories, Event Passes
- Each item shows: name, description, price, stock quantity, sizes (if applicable)

**Add to Cart:**
- User clicks "Add to Cart" on any item
- Item is saved to localStorage: `parsec_cart`
- Cart counter updates in real-time

---

### Step 2: Review Cart
**Location:** `/dashboard/cart`  
**Component:** `src/pages/dashboard/Cart.jsx`

**What Happens:**
- User sees all items in cart
- Can adjust quantities, change sizes, or remove items
- Cart data is stored locally (localStorage)
- "Proceed to Checkout" button navigates to checkout

---

### Step 3: Checkout - Review Order
**Location:** `/dashboard/checkout` (Step 1)  
**Component:** `src/pages/dashboard/Checkout.jsx`

**What Happens:**
- User reviews all cart items
- Optional: Add shipping address (or venue pickup)
- Shows total amount and item count
- "Continue to Order Confirmation" proceeds to next step

---

### Step 4: Checkout - Create Order
**Location:** `/dashboard/checkout` (Step 2)

**What Happens:**
- User confirms order details
- Click "Create Order" button
- **API Call:** `POST /api/parsec/v1/orders`

**Request Body:**
```json
{
  "items": [
    {
      "merchId": "67a1111111111111111111",
      "quantity": 2,
      "size": "M"
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "67a3333333333333333333",
      "userId": "67a1234567890abcdef12345",
      "totalAmount": 1297,
      "orderStatus": "pending",
      "paymentStatus": "unpaid"
    }
  }
}
```

**Success Actions:**
- Order ID is generated and stored
- Cart is cleared from localStorage
- User proceeds to payment step

---

### Step 5: Checkout - Payment Submission
**Location:** `/dashboard/checkout` (Step 3)

**What User Sees:**
1. **Payment QR Code Scanner** (NEW!)
   - QR code image displayed: `src/assets/images/payment_scanner.jpeg`
   - UPI ID shown: `parsec@iitdh`
   - User scans and pays the total amount

2. **Payment Screenshot Upload** (NEW!)
   - File input for uploading payment screenshot
   - Accepts: image files (JPG, PNG, etc.)
   - Max size: 5MB
   - Preview shown after upload
   - Optional but recommended for faster verification

3. **Payment UTR Input**
   - Text field for entering UTR/Transaction ID
   - Usually 12 digits
   - Required field

4. **Payment Status Badge**
   - Shows "⏳ Pending Verification"
   - Explains what happens next

**What Happens:**
- User fills in UTR and optionally uploads screenshot
- Click "Submit Payment Proof ✓"
- **API Call:** `POST /api/parsec/v1/payments`

**Request Body (UPDATED):**
```json
{
  "orderId": "67a3333333333333333333",
  "amount": 1297,
  "paymentUTR": "UTR202601041234567890",
  "paymentScreenshot": "data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Optional base64 string
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "payment": {
      "_id": "67a5555555555555555555",
      "userId": "67a1234567890abcdef12345",
      "referenceType": "Order",
      "referenceId": "67a3333333333333333333",
      "amount": 1297,
      "paymentUTR": "UTR202601041234567890",
      "paymentScreenshot": "data:image/jpeg;base64,...",
      "status": "pending",
      "createdAt": "2026-01-04T..."
    }
  }
}
```

**Success Actions:**
- Payment record created with status: `pending`
- User receives confirmation message
- Redirected to orders page: `/dashboard/orders`

---

## 👨‍💼 Admin Flow: Managing Shop & Payments

### Admin Panel Access
**Location:** `/admin`  
**Component:** `src/components/admin/AdminDashboard.jsx`

**Authentication:**
- Admin logs in with admin key
- Token stored in sessionStorage: `admin_token`
- All admin API calls use header: `Authorization: Bearer <admin_token>`

---

### 1. Store Management Tab
**Component:** `src/components/admin/AdminPurchase.jsx`

**What Admin Can Do:**
- Add new items (passes, merch, etc.)
- Edit existing items (name, price, description, image)
- Toggle availability (make available/unavailable)
- Delete items
- Items stored locally (localStorage: `admin_store_items`)

**Current Implementation:**
- ✅ Fully functional locally
- ⚠️ **Backend Integration Needed:** Sync items with backend merch API

**Expected API Endpoints:**
- `POST /api/parsec/v1/paneermoms/merch` - Add new item
- `PATCH /api/parsec/v1/paneermoms/merch/:id` - Update item
- `DELETE /api/parsec/v1/paneermoms/merch/:id` - Delete item

---

### 2. Pass Management Tab
**Component:** `src/components/admin/PassManagement.jsx`

**What Admin Can Do:**
- View default event passes (Day 1, Day 2, Stay Pass Basic, Stay Pass Premium)
- Toggle pass availability (make available/sold out)
- Update pass prices
- Save changes to backend

**Current Implementation:**
- ✅ Fetches from backend: `GET /api/admin/passes`
- ✅ Saves to backend: `POST /api/admin/passes/update`
- ⚠️ Falls back to localStorage if API unavailable

---

### 3. Payment Management (Orders Tab)
**Component:** `src/components/admin/OrderManagement.jsx`

**What Admin Sees:**
- List of all payment submissions
- Each payment card shows:
  - Payment ID (last 8 characters)
  - User name, email, phone
  - Payment UTR
  - **Payment Screenshot** (NEW!) - if user uploaded one
  - Amount
  - Status badge (Pending/Verified/Rejected)
  - Created date

**Actions Available:**
- Search/filter payments by status
- Click "View Details" to see full payment info
- For pending payments:
  - ✅ **Verify Payment** - Approves payment
  - ❌ **Reject Payment** - Rejects payment

**API Calls:**
- `GET /api/parsec/v1/paneermoms/payments` - Get all payments
- `PATCH /api/parsec/v1/paneermoms/payments/:id/verify` - Verify payment
- `PATCH /api/parsec/v1/paneermoms/payments/:id/reject` - Reject payment

**Payment Detail Modal:**
- Shows all payment information
- **Displays payment screenshot** (NEW!) - Full size, clickable
- Shows user information
- Verify/Reject buttons for pending payments

---

### 4. Points Management (Users Tab)
**Component:** `src/components/admin/UserManagement.jsx`

**UPDATED - Now Uses Email Instead of MongoDB ID!**

**What Admin Can Do:**
- Enter user **email address** (not MongoDB ID anymore!)
- Enter points amount
- Add points to user and their house
- Subtract points from user and their house

**API Calls (UPDATED REQUEST BODY):**

**Add Points:**
```http
POST /api/parsec/v1/paneermoms/points/add
Authorization: Bearer <admin_token>

{
  "email": "student@example.com",
  "points": 50
}
```

**Subtract Points:**
```http
POST /api/parsec/v1/paneermoms/points/subtract
Authorization: Bearer <admin_token>

{
  "email": "student@example.com",
  "points": 20
}
```

**⚠️ BACKEND CHANGE REQUIRED:**
The backend API currently expects:
```json
{
  "userId": "67a1234567890abcdef12345",
  "pointsToAdd": 50
}
```

**Must be changed to:**
```json
{
  "email": "student@example.com",
  "points": 50
}
```

Backend should:
1. Look up user by email
2. Add/subtract points from user
3. Add/subtract points from user's house
4. Return updated user data

---

## 🔌 API Endpoints & Backend Requirements

### User-Facing Endpoints (Already Working)

#### 1. Get All Merch/Passes
```
GET /api/parsec/v1/merch
```
- Returns all available items (merch + event passes)
- Each item should have: `_id`, `type`, `name`, `description`, `price`, `stockQuantity`, `sizesAvailable` (if applicable)

#### 2. Create Order
```
POST /api/parsec/v1/orders
Authorization: Bearer <user_jwt>

Body:
{
  "items": [
    { "merchId": "...", "quantity": 2, "size": "M" }
  ]
}
```
- Creates order with status: "pending"
- Returns order with `_id`

#### 3. Submit Payment (UPDATED)
```
POST /api/parsec/v1/payments
Authorization: Bearer <user_jwt>

Body:
{
  "orderId": "...",
  "amount": 1297,
  "paymentUTR": "UTR202601041234567890",
  "paymentScreenshot": "data:image/jpeg;base64,..." // NEW - Optional
}
```

**⚠️ BACKEND CHANGE REQUIRED:**
Backend must now accept and store `paymentScreenshot` field (optional string, can be base64 or URL)

---

### Admin Endpoints

#### 1. Get All Payments
```
GET /api/parsec/v1/paneermoms/payments
Authorization: Bearer <admin_token>
```
- Returns all payment records
- Each record must include: `paymentScreenshot` field (NEW)

**⚠️ BACKEND CHANGE REQUIRED:**
Include `paymentScreenshot` in response if it exists

#### 2. Verify Payment
```
PATCH /api/parsec/v1/paneermoms/payments/:id/verify
Authorization: Bearer <admin_token>
```
- Updates payment status to "verified"
- Updates order status to "confirmed"
- Sends confirmation email to user

#### 3. Reject Payment
```
PATCH /api/parsec/v1/paneermoms/payments/:id/reject
Authorization: Bearer <admin_token>
```
- Updates payment status to "rejected"
- Notifies user

#### 4. Add Points by Email (UPDATED)
```
POST /api/parsec/v1/paneermoms/points/add
Authorization: Bearer <admin_token>

Body:
{
  "email": "student@example.com",
  "points": 50
}
```

**⚠️ BACKEND CHANGE REQUIRED:**
- Changed from `userId` + `pointsToAdd` to `email` + `points`
- Backend must look up user by email first
- Add points to both user and house

#### 5. Subtract Points by Email (UPDATED)
```
POST /api/parsec/v1/paneermoms/points/subtract
Authorization: Bearer <admin_token>

Body:
{
  "email": "student@example.com",
  "points": 20
}
```

**⚠️ BACKEND CHANGE REQUIRED:**
- Same as above - use email instead of userId
- Backend must look up user by email first
- Subtract points from both user and house

---

## 💳 Payment Information Collected

### What User Submits:
1. ✅ **Payment UTR/Transaction ID** (Required)
   - 12-digit transaction reference
   - Provided by payment gateway after UPI payment

2. ✅ **Payment Screenshot** (NEW - Optional but Recommended)
   - Image file uploaded by user
   - Shows payment confirmation screen
   - Stored as base64 string or image URL
   - Helps admin verify payment quickly

3. ✅ **Order ID** (Auto-generated)
   - Links payment to specific order

4. ✅ **Amount** (Auto-calculated)
   - Total order amount

### What Admin Sees for Verification:
1. User details (name, email, phone)
2. Payment UTR
3. **Payment Screenshot** (if uploaded) - Can view full size
4. Amount paid
5. Order details (what was purchased)
6. Timestamp

---

## 📊 Status Management

### Payment Status Flow:

```
Pending → Verified
   ↓
Rejected
```

#### 1. **Pending** (Initial State)
- User has submitted payment proof
- Awaiting admin verification
- Badge color: Yellow (⏳)
- User notification: "Payment under review - will be verified within 24 hours"

#### 2. **Verified** (Admin Approved)
- Admin confirms payment is valid
- Order status changes to "confirmed"
- User receives confirmation email
- If event pass: QR code generated and emailed
- Badge color: Green (✅)

#### 3. **Rejected** (Admin Declined)
- Admin found issue with payment
- User is notified
- Badge color: Red (❌)
- User can re-submit with correct details

### Where Status is Displayed:

**User Side:**
- Checkout page (step 3) - shows initial "Pending" status
- Orders page (when implemented) - shows current status
- Email notifications

**Admin Side:**
- Payment list - status badge on each card
- Payment detail modal - full status info
- Can filter by status (All, Pending, Verified, Rejected)

---

## 🏆 Points System Update

### Changed from MongoDB ID to Email

**Why?**
- Easier for admins (no need to look up complex ObjectIds)
- More user-friendly
- Reduces errors

**What Changed:**

**Before:**
```jsx
// Admin entered MongoDB ObjectId
userId: "673c3e6912abd5e72d56f9cb"

// API request
{
  "userId": "673c3e6912abd5e72d56f9cb",
  "pointsToAdd": 50
}
```

**After:**
```jsx
// Admin enters email
email: "student@example.com"

// API request
{
  "email": "student@example.com",
  "points": 50
}
```

**Backend Must:**
1. Accept `email` instead of `userId`
2. Look up user by email: `User.findOne({ email })`
3. If user not found, return error
4. Update user points
5. Update house points (user's house)
6. Return success response

---

## 🔧 Backend Changes Summary

### Required Changes:

1. **Payment Schema Update**
   - Add `paymentScreenshot` field (String, optional)
   - Store base64 image or image URL

2. **Payment Submission API**
   - Accept `paymentScreenshot` in request body
   - Store it in database

3. **Get Payments API**
   - Include `paymentScreenshot` in response

4. **Points Management API**
   - Change from accepting `userId` to `email`
   - Change `pointsToAdd`/`pointsToSubtract` to just `points`
   - Look up user by email before updating points

### Optional Enhancements:

1. **Image Storage**
   - Current: Base64 in database (works but increases size)
   - Better: Upload to cloud storage (S3, Cloudinary) and store URL
   - Implement in backend payment submission handler

2. **Email Notifications**
   - Send email when payment status changes
   - Include payment details and next steps

3. **Pass Management Sync**
   - Ensure AdminPurchase changes sync with backend merch API
   - Real-time updates when admin adds/edits items

---

## ✅ What's Working Now

### Frontend (100% Complete):
✅ Shop page with filtering  
✅ Cart management  
✅ Checkout flow (3 steps)  
✅ Payment scanner QR code display  
✅ Screenshot upload with preview  
✅ Payment submission  
✅ Admin dashboard  
✅ Payment management with screenshot display  
✅ Points management with email input  

### Backend (Needs Updates):
⚠️ Payment screenshot storage  
⚠️ Points API email parameter  
⚠️ Store management sync  

---

## 🎯 Testing Checklist

### User Flow:
- [ ] User can browse shop
- [ ] User can add items to cart
- [ ] User can proceed to checkout
- [ ] User can create order
- [ ] User sees payment QR code
- [ ] User can upload payment screenshot
- [ ] User can submit payment with UTR
- [ ] User receives confirmation

### Admin Flow:
- [ ] Admin can view all payments
- [ ] Admin can see payment screenshots
- [ ] Admin can verify/reject payments
- [ ] Admin can add points by email
- [ ] Admin can subtract points by email

---

## 📝 Notes for Backend Developer

**Dear Backend Friend,**

Please update these endpoints:

1. **POST /api/parsec/v1/payments**
   - Add `paymentScreenshot` field (optional string) to request body schema
   - Store in Payment model

2. **GET /api/parsec/v1/paneermoms/payments**
   - Include `paymentScreenshot` in response

3. **POST /api/parsec/v1/paneermoms/points/add**
   - Change from `{ userId, pointsToAdd }` to `{ email, points }`
   - Look up user by email: `const user = await User.findOne({ email })`
   - If not found: return `{ status: "error", message: "User not found with this email" }`

4. **POST /api/parsec/v1/paneermoms/points/subtract**
   - Same changes as above for subtract

**Response format should be:**
```json
{
  "status": "success",
  "message": "Points added successfully",
  "data": {
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "house": "Gryffindor",
      "points": 200
    }
  }
}
```

---

## 🚀 Deployment Notes

1. Ensure payment scanner image is deployed: `src/assets/images/payment_scanner.jpeg`
2. Test payment screenshot upload with actual backend
3. Verify email-based points API works
4. Test full flow end-to-end

---

**Last Updated:** January 7, 2026  
**Version:** 6.0  
**Status:** Frontend Complete, Backend Updates Required
