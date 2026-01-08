# 🛍️ Parsec Backend - Merch, Order, Payment & QR API Documentation

Complete API documentation for merchandise management, order processing, payment verification, and event pass QR system.

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Merch Endpoints](#merch-endpoints)
3. [Order Endpoints](#order-endpoints)
4. [Payment Endpoints](#payment-endpoints)
5. [Admin Payment Management](#admin-payment-management)
6. [Admin QR Management](#admin-qr-management)
7. [Error Handling](#error-handling)
8. [Complete Workflow](#complete-workflow)

---

## 🔐 Authentication

### User Authentication
All user endpoints require JWT authentication:
```
Authorization: Bearer <your_jwt_token>
```

### Admin Authentication
Admin endpoints require admin token:
```
Authorization: Bearer <admin_jwt_token>
```

**Get Admin Token:**
```http
POST /api/parsec/v1/paneermoms/login
Content-Type: application/json

{
  "adminKey": "your-secret-admin-key"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🛍️ Merch Endpoints

### 1. Get All Merchandise

**Endpoint:** `GET /api/parsec/v1/merch`  
**Access:** Public  
**Description:** Retrieve all merchandise items

**Request:**
```http
GET /api/parsec/v1/merch
```

**Response:**
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "merch": [
      {
        "_id": "6507f191e110b4f7fcb5f7e9",
        "name": "Parsec T-Shirt",
        "description": "Official Parsec event T-shirt",
        "price": 299,
        "type": "wearable",
        "sizesAvailable": ["S", "M", "L", "XL", "XXL"],
        "stockQuantity": 50,
        "imageUrl": "https://example.com/tshirt.jpg",
        "createdAt": "2026-01-01T10:00:00.000Z"
      },
      {
        "_id": "6507f191e110b4f7fcb5f7ea",
        "name": "Event Pass 1",
        "description": "Access to Day 1 events (24 Jan)",
        "price": 300,
        "type": "event-pass1",
        "stockQuantity": 100,
        "createdAt": "2026-01-01T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 2. Get Merchandise by ID

**Endpoint:** `GET /api/parsec/v1/merch/:id`  
**Access:** Public  
**Description:** Get detailed information about a specific merch item

**Request:**
```http
GET /api/parsec/v1/merch/6507f191e110b4f7fcb5f7e9
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "merch": {
      "_id": "6507f191e110b4f7fcb5f7e9",
      "name": "Parsec T-Shirt",
      "description": "Official Parsec event T-shirt",
      "price": 299,
      "type": "wearable",
      "sizesAvailable": ["S", "M", "L", "XL", "XXL"],
      "stockQuantity": 50,
      "imageUrl": "https://example.com/tshirt.jpg"
    }
  }
}
```

---

### 3. Add Merchandise (Admin Only)

**Endpoint:** `POST /api/parsec/v1/merch`  
**Access:** Private (Admin)  
**Description:** Add new merchandise item

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Parsec Hoodie",
  "description": "Premium quality hoodie",
  "price": 799,
  "type": "wearable",
  "sizesAvailable": ["M", "L", "XL"],
  "stockQuantity": 30,
  "imageUrl": "https://example.com/hoodie.jpg"
}
```

**Merch Types:**
- `wearable` - T-shirts, hoodies (requires `sizesAvailable`)
- `non-wearable` - Stickers, bottles, etc.
- `event-pass1` - Day 1 event pass (24 Jan)
- `event-pass2` - Day 2 event pass (26 Jan)

**Response:**
```json
{
  "status": "success",
  "data": {
    "merch": {
      "_id": "6507f191e110b4f7fcb5f7eb",
      "name": "Parsec Hoodie",
      "price": 799,
      "type": "wearable",
      "stockQuantity": 30
    }
  }
}
```

---

### 4. Update Merch Stock (Admin Only)

**Endpoint:** `PATCH /api/parsec/v1/merch/:id/stock`  
**Access:** Private (Admin)  
**Description:** Update stock quantity for a merch item

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request:**
```json
{
  "stockQuantity": 100
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "merch": {
      "_id": "6507f191e110b4f7fcb5f7e9",
      "name": "Parsec T-Shirt",
      "stockQuantity": 100
    }
  }
}
```

---

### 5. Delete Merchandise (Admin Only)

**Endpoint:** `DELETE /api/parsec/v1/merch/:id`  
**Access:** Private (Admin)  
**Description:** Delete a merch item

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```http
DELETE /api/parsec/v1/merch/6507f191e110b4f7fcb5f7e9
```

**Response:**
```json
{
  "status": "success",
  "message": "Merch item deleted successfully"
}
```

---

## 📦 Order Endpoints

### 1. Create Order

**Endpoint:** `POST /api/parsec/v1/orders`  
**Access:** Private (User)  
**Description:** Create a new order with atomic stock management

**Headers:**
```
Authorization: Bearer <user_jwt_token>
Content-Type: application/json
```

**Request:**
```json
{
  "items": [
    {
      "merchId": "6507f191e110b4f7fcb5f7e9",
      "quantity": 2,
      "size": "L"
    },
    {
      "merchId": "6507f191e110b4f7fcb5f7ea",
      "quantity": 1
    }
  ],
  "shippingAddress": "Room 301, Hostel A, College Campus"
}
```

**Field Requirements:**
- `merchId` - Required for all items
- `quantity` - Required for all items
- `size` - Required ONLY for wearable items
- `shippingAddress` - Optional

**Response:**
```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "6507f191e110b4f7fcb5f7ec",
      "userId": "6507f191e110b4f7fcb5f7e8",
      "items": [
        {
          "merchId": "6507f191e110b4f7fcb5f7e9",
          "name": "Parsec T-Shirt",
          "size": "L",
          "quantity": 2,
          "pricePerItem": 299
        },
        {
          "merchId": "6507f191e110b4f7fcb5f7ea",
          "name": "Event Pass 1",
          "size": "N/A",
          "quantity": 1,
          "pricePerItem": 300
        }
      ],
      "totalAmount": 898,
      "shippingAddress": "Room 301, Hostel A, College Campus",
      "createdAt": "2026-01-04T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**

*Insufficient Stock:*
```json
{
  "status": "fail",
  "message": "Insufficient stock for Parsec T-Shirt. Available: 1, Requested: 2"
}
```

*Size Required:*
```json
{
  "status": "fail",
  "message": "Size is required for wearable item: Parsec T-Shirt"
}
```

*Invalid Size:*
```json
{
  "status": "fail",
  "message": "Size XS is not available for Parsec T-Shirt"
}
```

---

### 2. Get My Orders

**Endpoint:** `GET /api/parsec/v1/orders/me`  
**Access:** Private (User)  
**Description:** Get order history for logged-in user

**Headers:**
```
Authorization: Bearer <user_jwt_token>
```

**Request:**
```http
GET /api/parsec/v1/orders/me
```

**Response:**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "orders": [
      {
        "_id": "6507f191e110b4f7fcb5f7ec",
        "items": [
          {
            "merchId": "6507f191e110b4f7fcb5f7e9",
            "name": "Parsec T-Shirt",
            "size": "L",
            "quantity": 2,
            "pricePerItem": 299
          }
        ],
        "totalAmount": 598,
        "createdAt": "2026-01-04T10:30:00.000Z"
      }
    ]
  }
}
```

---

## 💳 Payment Endpoints

### 1. Record Payment

**Endpoint:** `POST /api/parsec/v1/payments`  
**Access:** Private (User)  
**Description:** Submit payment proof for an order

**Headers:**
```
Authorization: Bearer <user_jwt_token>
Content-Type: application/json
```

**Request:**
```json
{
  "orderId": "6507f191e110b4f7fcb5f7ec",
  "amount": 598,
  "paymentUTR": "UTR123456789012"
}
```

**Field Requirements:**
- `orderId` - Order ID from created order
- `amount` - Payment amount (should match order total)
- `paymentUTR` - Unique Transaction Reference from payment gateway

**Response:**
```json
{
  "status": "success",
  "data": {
    "paymentHistory": {
      "_id": "6507f191e110b4f7fcb5f7ed",
      "userId": "6507f191e110b4f7fcb5f7e8",
      "orderId": "6507f191e110b4f7fcb5f7ec",
      "name": "John Doe",
      "email": "john@example.com",
      "contactNumber": "9876543210",
      "amount": 598,
      "paymentUTR": "UTR123456789012",
      "status": "pending",
      "createdAt": "2026-01-04T11:00:00.000Z"
    }
  }
}
```

**Automatic Email:** User receives "Order Under Review" email

**Error Responses:**

*Order Already Has Payment:*
```json
{
  "status": "fail",
  "message": "Payment already recorded for this order."
}
```

*Duplicate UTR:*
```json
{
  "status": "fail",
  "message": "Payment UTR already exists."
}
```

*Order Not Found:*
```json
{
  "status": "fail",
  "message": "Order not found or does not belong to you."
}
```

---

### 2. Get My Payment History

**Endpoint:** `GET /api/parsec/v1/payments/me`  
**Access:** Private (User)  
**Description:** Get payment history for logged-in user

**Headers:**
```
Authorization: Bearer <user_jwt_token>
```

**Request:**
```http
GET /api/parsec/v1/payments/me
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "paymentHistory": [
      {
        "_id": "6507f191e110b4f7fcb5f7ed",
        "orderId": "6507f191e110b4f7fcb5f7ec",
        "amount": 598,
        "paymentUTR": "UTR123456789012",
        "status": "pending",
        "createdAt": "2026-01-04T11:00:00.000Z"
      },
      {
        "_id": "6507f191e110b4f7fcb5f7ee",
        "orderId": "6507f191e110b4f7fcb5f7ef",
        "amount": 300,
        "paymentUTR": "UTR123456789013",
        "status": "verified",
        "verifiedAt": "2026-01-03T15:30:00.000Z",
        "createdAt": "2026-01-03T14:00:00.000Z"
      }
    ]
  }
}
```

---

## 👨‍💼 Admin Payment Management

### 1. Get All Payment Histories

**Endpoint:** `GET /api/parsec/v1/paneermoms/payments`  
**Access:** Private (Admin)  
**Description:** View all payment records

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```http
GET /api/parsec/v1/paneermoms/payments
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "paymentHistories": [
      {
        "_id": "6507f191e110b4f7fcb5f7ed",
        "userId": {
          "_id": "6507f191e110b4f7fcb5f7e8",
          "name": "John Doe",
          "email": "john@example.com",
          "contactNumber": "9876543210"
        },
        "orderId": "6507f191e110b4f7fcb5f7ec",
        "amount": 598,
        "paymentUTR": "UTR123456789012",
        "status": "pending",
        "createdAt": "2026-01-04T11:00:00.000Z"
      }
    ]
  }
}
```

---

### 2. Verify Payment

**Endpoint:** `PATCH /api/parsec/v1/paneermoms/payments/:id/verify`  
**Access:** Private (Admin)  
**Description:** Verify a payment (sends confirmation email + QR for event passes)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```http
PATCH /api/parsec/v1/paneermoms/payments/6507f191e110b4f7fcb5f7ed/verify
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "payment": {
      "_id": "6507f191e110b4f7fcb5f7ed",
      "status": "verified",
      "verifiedAt": "2026-01-04T12:00:00.000Z"
    }
  }
}
```

**Automatic Actions:**
1. ✅ Payment status updated to "verified"
2. ✅ If order contains event pass:
   - Generates QR code with attendee details
   - Saves QR record in database
   - Sends email with QR code attachment
3. ✅ If regular merch:
   - Sends payment verification email

**Email for Event Pass:**
```
Subject: Your Parsec Event Pass 1 is Verified

Body:
- Order ID
- Payment UTR
- Pass Type (Event Pass 1 or 2)
- Pass Price
- QR Code Image (embedded)
- Instructions to show at venue
```

**QR Code Contains:**
```json
{
  "orderId": "6507f191e110b4f7fcb5f7ec",
  "attendeeName": "John Doe",
  "attendeeEmail": "john@example.com",
  "passType": "event-pass1",
  "passPrice": 300,
  "collegeName": "ABC College",
  "gender": "male",
  "isUsed": false
}
```

---

### 3. Reject Payment

**Endpoint:** `PATCH /api/parsec/v1/paneermoms/payments/:id/reject`  
**Access:** Private (Admin)  
**Description:** Reject a payment

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```http
PATCH /api/parsec/v1/paneermoms/payments/6507f191e110b4f7fcb5f7ed/reject
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "payment": {
      "_id": "6507f191e110b4f7fcb5f7ed",
      "status": "rejected"
    }
  }
}
```

---

### 4. Get Payment Statistics

**Endpoint:** `GET /api/parsec/v1/paneermoms/payments/stats`  
**Access:** Private (Admin)  
**Description:** Get payment statistics dashboard

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```http
GET /api/parsec/v1/paneermoms/payments/stats
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalPayments": 150,
    "verifiedPayments": 120,
    "rejectedPayments": 10,
    "pendingPayments": 20
  }
}
```

---

## 🎫 Admin QR Management

### 1. Verify Event Pass QR Code

**Endpoint:** `POST /api/parsec/v1/paneermoms/qr/verify`  
**Access:** Private (Admin)  
**Description:** Scan and verify QR code at event venue

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request:**
```json
{
  "qrData": "{\"orderId\":\"6507f191e110b4f7fcb5f7ec\",\"attendeeName\":\"John Doe\",\"attendeeEmail\":\"john@example.com\",\"passType\":\"event-pass1\",\"passPrice\":300,\"collegeName\":\"ABC College\",\"gender\":\"male\",\"isUsed\":false}"
}
```

**Response (First Scan - Success):**
```json
{
  "status": "success",
  "message": "QR code verified successfully",
  "data": {
    "attendeeName": "John Doe",
    "attendeeEmail": "john@example.com",
    "passType": "event-pass1",
    "collegeName": "ABC College",
    "verifiedAt": "2026-01-24T09:30:00.000Z"
  }
}
```

**Response (Already Used):**
```json
{
  "status": "fail",
  "message": "QR code has already been used",
  "usedAt": "2026-01-24T09:30:00.000Z"
}
```

**Response (Invalid QR):**
```json
{
  "status": "fail",
  "message": "Invalid QR code"
}
```

---

## ⚠️ Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "status": "fail",
  "message": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "status": "fail",
  "message": "Please log in to access this resource"
}
```

**403 Forbidden:**
```json
{
  "status": "fail",
  "message": "You do not have permission to perform this action"
}
```

**404 Not Found:**
```json
{
  "status": "fail",
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "message": "Something went wrong!"
}
```

---

## 🔄 Complete Workflow

### User Flow: Buying Event Pass

```
1. Browse Merch
   GET /api/parsec/v1/merch
   ↓
   
2. Create Order
   POST /api/parsec/v1/orders
   Body: { items: [{ merchId, quantity }] }
   ↓
   
3. Record Payment
   POST /api/parsec/v1/payments
   Body: { orderId, amount, paymentUTR }
   ↓
   Email: "Order Under Review"
   ↓
   
4. Admin Verifies Payment
   PATCH /api/parsec/v1/paneermoms/payments/:id/verify
   ↓
   Email: "Payment Verified" + QR Code
   ↓
   
5. User Shows QR at Event
   QR Code Scanned
   ↓
   
6. Admin Verifies QR
   POST /api/parsec/v1/paneermoms/qr/verify
   ↓
   Entry Granted ✅
```

### Admin Flow: Payment Management

```
1. View All Payments
   GET /api/parsec/v1/paneermoms/payments
   ↓
   
2. Check Payment Stats
   GET /api/parsec/v1/paneermoms/payments/stats
   ↓
   
3. Verify Payment
   PATCH /api/parsec/v1/paneermoms/payments/:id/verify
   (Sends email + generates QR for event passes)
   ↓
   
4. Or Reject Payment
   PATCH /api/parsec/v1/paneermoms/payments/:id/reject
```

### Admin Flow: Event Day QR Verification

```
1. User Shows QR Code
   ↓
   
2. Admin Scans QR
   ↓
   
3. Send QR Data to API
   POST /api/parsec/v1/paneermoms/qr/verify
   Body: { qrData: "JSON string from QR" }
   ↓
   
4. Check Response
   - Success ✅ → Allow Entry
   - Already Used ❌ → Deny Entry
   - Invalid ❌ → Deny Entry
```

---

## 🔒 Security Features

### Atomic Transactions
- ✅ Race condition prevention in stock management
- ✅ MongoDB sessions ensure all-or-nothing operations
- ✅ Prevents overselling during concurrent orders

### Unique Constraints
- ✅ One payment per order (orderId unique)
- ✅ Unique payment UTR (no duplicate transactions)
- ✅ QR codes tied to specific orders

### Validation
- ✅ Size validation for wearable items
- ✅ Stock availability checks before order creation
- ✅ Order ownership verification
- ✅ QR code authenticity verification

---

## 📊 Data Models

### Merch Model
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  type: Enum ['wearable', 'non-wearable', 'event-pass1', 'event-pass2'],
  sizesAvailable: [String], // Only for wearable
  stockQuantity: Number (required),
  imageUrl: String
}
```

### Order Model
```javascript
{
  userId: ObjectId (User),
  items: [{
    merchId: ObjectId (Merch),
    name: String,
    size: String,
    quantity: Number,
    pricePerItem: Number
  }],
  totalAmount: Number,
  shippingAddress: String,
  createdAt: Date
}
```

### Payment Model
```javascript
{
  userId: ObjectId (User),
  orderId: ObjectId (Order) [unique],
  name: String,
  email: String,
  contactNumber: String,
  amount: Number,
  paymentUTR: String [unique],
  status: Enum ['pending', 'verified', 'rejected'],
  verifiedAt: Date
}
```

### QR Model
```javascript
{
  userId: ObjectId (User),
  orderId: ObjectId (Order),
  passType: Enum ['event-pass1', 'event-pass2'],
  qrCodeData: String (JSON),
  isUsed: Boolean,
  usedAt: Date
}
```

---

## 🚀 Quick Start Examples

### Example 1: Order Regular Merch

```bash
# 1. Get merch list
curl -X GET http://localhost:3000/api/parsec/v1/merch

# 2. Create order
curl -X POST http://localhost:3000/api/parsec/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "merchId": "6507f191e110b4f7fcb5f7e9",
        "quantity": 1,
        "size": "L"
      }
    ]
  }'

# 3. Record payment
curl -X POST http://localhost:3000/api/parsec/v1/payments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "6507f191e110b4f7fcb5f7ec",
    "amount": 299,
    "paymentUTR": "UTR123456789012"
  }'
```

### Example 2: Order Event Pass

```bash
# 1. Create order for event pass
curl -X POST http://localhost:3000/api/parsec/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "merchId": "EVENT_PASS_ID",
        "quantity": 1
      }
    ]
  }'

# 2. Record payment
curl -X POST http://localhost:3000/api/parsec/v1/payments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER_ID",
    "amount": 300,
    "paymentUTR": "UTR123456789013"
  }'

# 3. Admin verifies (sends email with QR)
curl -X PATCH http://localhost:3000/api/parsec/v1/paneermoms/payments/PAYMENT_ID/verify \
  -H "Authorization: Bearer ADMIN_TOKEN"

# 4. At event, verify QR
curl -X POST http://localhost:3000/api/parsec/v1/paneermoms/qr/verify \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "qrData": "QR_JSON_STRING"
  }'
```

---

**Last Updated:** January 4, 2026  
**API Version:** v1  
**Base URL:** `/api/parsec/v1`

For issues or questions, contact the Parsec Backend Team.
