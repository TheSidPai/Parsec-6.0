# Parsec Backend API Documentation for Frontend Developers

> **Made by:** Ayush Raj

---

## 📋 Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [User Routes](#user-routes)
  - [Authentication & Profile](#authentication--profile)
  - [Onboarding](#onboarding)
  - [Sorting Hat](#sorting-hat)
  - [Payments](#payments)
  - [Points](#points)
  - [Orders (Merchandise)](#orders-merchandise)
- [Admin Routes](#admin-routes)
  - [Admin Authentication](#admin-authentication)
  - [Admin Payments](#admin-payments)
  - [Admin Points](#admin-points)
- [Error Handling](#error-handling)
- [HTTP Status Codes](#http-status-codes)

---

## 🌐 Base URL

**Development:**
```
http://localhost:3000/api/parsec/v1
```

**Production:**
```
https://parsec.iitdh.ac.in/api/parsec/v1
```

---

## 🔐 Authentication

All protected routes require a JWT token in the request header:

```javascript
Headers: {
    "Authorization": "Bearer <your_jwt_token>"
}
```

The token is obtained after successful Google OAuth login.

---

## 👤 User Routes

### Authentication & Profile

#### 1. Initiate Google OAuth Login

**Endpoint:** `GET /auth/google`

**Description:** Redirects user to Google OAuth consent screen

**Access:** Public

**Request:**
```javascript
// No body required - just redirect user to this URL
window.location.href = 'https://parsec.iitdh.ac.in/api/parsec/v1/auth/google';
```

**Response:**
- Redirects to Google OAuth page
- After successful authentication, redirects to `/auth/google/callback`
- Finally redirects to frontend with JWT token in cookie

---

#### 2. Google OAuth Callback

**Endpoint:** `GET /auth/google/callback`

**Description:** Handles Google OAuth callback (automatic)

**Access:** Public

**Response:**
- Sets JWT token in httpOnly cookie
- Redirects to frontend dashboard

---

#### 3. Get Current User

**Endpoint:** `GET /auth/me`

**Description:** Get current logged-in user's information

**Access:** Private (requires JWT)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

**Request:** No body required

**Response:**
```json
{
    "status": "success",
    "data": {
        "user": {
            "_id": "673c3e6912abd5e72d56f9cb",
            "googleId": "112345678901234567890",
            "name": "Ayush Raj",
            "email": "ayush@example.com",
            "profilePicture": "https://lh3.googleusercontent.com/...",
            "college": "IIT Delhi",
            "batch": "2024",
            "gender": "Male",
            "contactNumber": "9876543210",
            "aadharOrCollegeId": "1234-5678-9012",
            "merchSize": "L",
            "house": "Gryffindor",
            "points": 150,
            "createdAt": "2024-11-19T10:30:00.000Z",
            "updatedAt": "2024-11-19T12:00:00.000Z"
        },
        "isOnboardingComplete": true
    }
}
```

**Field Descriptions:**
- `isOnboardingComplete`: `true` if all onboarding fields are filled, `false` otherwise

---

#### 4. Logout

**Endpoint:** `POST /auth/logout`

**Description:** Logout user and clear JWT cookie

**Access:** Private (requires JWT)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

**Request:** No body required

**Response:**
```json
{
    "status": "success",
    "message": "Logged out successfully"
}
```

---

### Onboarding

#### 5. Complete User Onboarding

**Endpoint:** `POST /onboarding`

**Description:** Complete user profile with required information

**Access:** Private (requires JWT)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>",
    "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
    "college": "IIT Delhi",
    "batch": "2024",
    "gender": "Male",
    "contactNumber": "9876543210",
    "aadharOrCollegeId": "1234-5678-9012",
    "merchSize": "L"
}
```

**Field Validations:**
- `college`: String, required
- `batch`: String, required (e.g., "2024", "2025")
- `gender`: String, required, enum: `["Male", "Female", "Other"]`
- `contactNumber`: String, required (10 digits)
- `aadharOrCollegeId`: String, required
- `merchSize`: String, required, enum: `["XS", "S", "M", "L", "XL", "XXL", "XXXL"]`

**Response:**
```json
{
    "status": "success",
    "message": "Onboarding completed successfully",
    "data": {
        "user": {
            "_id": "673c3e6912abd5e72d56f9cb",
            "name": "Ayush Raj",
            "email": "ayush@example.com",
            "college": "IIT Delhi",
            "batch": "2024",
            "gender": "Male",
            "contactNumber": "9876543210",
            "aadharOrCollegeId": "1234-5678-9012",
            "merchSize": "L",
            "house": null,
            "points": 0
        }
    }
}
```

---

### Sorting Hat

#### 6. Get House Statistics (Public)

**Endpoint:** `GET /sorting-hat/stats`

**Description:** Get statistics of all houses (public leaderboard)

**Access:** Public (no authentication required)

**Request:** No body or headers required

**Response:**
```json
{
    "status": "success",
    "data": {
        "houses": [
            {
                "_id": "673c3f1a12abd5e72d56f9d1",
                "name": "Gryffindor",
                "count": 25,
                "points": 1500
            },
            {
                "_id": "673c3f1a12abd5e72d56f9d2",
                "name": "Hufflepuff",
                "count": 23,
                "points": 1450
            },
            {
                "_id": "673c3f1a12abd5e72d56f9d3",
                "name": "Ravenclaw",
                "count": 24,
                "points": 1480
            },
            {
                "_id": "673c3f1a12abd5e72d56f9d4",
                "name": "Slytherin",
                "count": 22,
                "points": 1420
            }
        ]
    }
}
```

---

#### 7. Get My House

**Endpoint:** `GET /sorting-hat/my-house`

**Description:** Get current user's house information

**Access:** Private (requires JWT + completed onboarding)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

**Request:** No body required

**Response (If sorted):**
```json
{
    "status": "success",
    "data": {
        "house": {
            "_id": "673c3f1a12abd5e72d56f9d1",
            "name": "Gryffindor",
            "count": 25,
            "points": 1500
        }
    }
}
```

**Response (If not sorted yet):**
```json
{
    "status": "fail",
    "message": "User has not been sorted into a house yet."
}
```

---

#### 8. Sort User into House

**Endpoint:** `POST /sorting-hat/sort`

**Description:** Assign user to a house using sorting algorithm

**Access:** Private (requires JWT + completed onboarding)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

**Request:** No body required

**Response:**
```json
{
    "status": "success",
    "message": "You have been sorted into Gryffindor! 🦁",
    "data": {
        "user": {
            "_id": "673c3e6912abd5e72d56f9cb",
            "name": "Ayush Raj",
            "house": "Gryffindor"
        },
        "house": {
            "_id": "673c3f1a12abd5e72d56f9d1",
            "name": "Gryffindor",
            "count": 26,
            "points": 1500
        }
    }
}
```

**Error (Already sorted):**
```json
{
    "status": "fail",
    "message": "User has already been sorted."
}
```

---

### Payments

#### 9. Record Payment

**Endpoint:** `POST /payments`

**Description:** Submit a payment for verification

**Access:** Private (requires JWT + completed onboarding)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>",
    "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
    "amount": 999,
    "paymentUTR": "423456789012"
}
```

**Field Validations:**
- `amount`: Number, required, must be positive
- `paymentUTR`: String, required, unique (UTR/Transaction Reference Number)

**Response:**
```json
{
    "status": "success",
    "data": {
        "paymentHistory": {
            "_id": "673c40a512abd5e72d56f9d8",
            "userId": "673c3e6912abd5e72d56f9cb",
            "name": "Ayush Raj",
            "email": "ayush@example.com",
            "contactNumber": "9876543210",
            "amount": 999,
            "paymentUTR": "423456789012",
            "status": "pending",
            "createdAt": "2024-11-19T14:30:00.000Z",
            "updatedAt": "2024-11-19T14:30:00.000Z"
        }
    }
}
```

**Error (Duplicate UTR):**
```json
{
    "status": "fail",
    "message": "Payment with this UTR already exists."
}
```

---

#### 10. Get My Payment History

**Endpoint:** `GET /payments/me`

**Description:** Get all payments made by the logged-in user

**Access:** Private (requires JWT + completed onboarding)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

**Request:** No body required

**Response:**
```json
{
    "status": "success",
    "data": {
        "paymentHistory": [
            {
                "_id": "673c40a512abd5e72d56f9d8",
                "userId": "673c3e6912abd5e72d56f9cb",
                "name": "Ayush Raj",
                "email": "ayush@example.com",
                "contactNumber": "9876543210",
                "amount": 999,
                "paymentUTR": "423456789012",
                "status": "verified",
                "createdAt": "2024-11-19T14:30:00.000Z",
                "updatedAt": "2024-11-19T15:00:00.000Z"
            },
            {
                "_id": "673c41b612abd5e72d56f9da",
                "userId": "673c3e6912abd5e72d56f9cb",
                "name": "Ayush Raj",
                "email": "ayush@example.com",
                "contactNumber": "9876543210",
                "amount": 699,
                "paymentUTR": "523456789013",
                "status": "pending",
                "createdAt": "2024-11-18T10:15:00.000Z",
                "updatedAt": "2024-11-18T10:15:00.000Z"
            }
        ]
    }
}
```

**Payment Status Values:**
- `pending`: Payment submitted, awaiting verification
- `verified`: Payment approved by admin
- `rejected`: Payment rejected by admin

---

### Points

#### 11. Get My Points

**Endpoint:** `GET /points`

**Description:** Get current user's points

**Access:** Private (requires JWT + completed onboarding)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

**Request:** No body required

**Response:**
```json
{
    "status": "success",
    "data": {
        "points": 150
    }
}
```

---

### Orders (Merchandise)

#### 12. Create Order

**Endpoint:** `POST /orders`

**Description:** Create a new merchandise order

**Access:** Private (requires JWT + completed onboarding)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>",
    "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
    "items": [
        {
            "merchId": "673c42c712abd5e72d56f9dc",
            "quantity": 2,
            "size": "L"
        },
        {
            "merchId": "673c42d812abd5e72d56f9dd",
            "quantity": 1
        }
    ],
    "shippingAddress": {
        "hostel": "BH3",
        "roomNumber": "201",
        "additionalInfo": "Near main entrance"
    }
}
```

**Field Validations:**
- `items`: Array, required, must not be empty
  - `merchId`: ObjectId, required (merchandise item ID)
  - `quantity`: Number, required, minimum 1
  - `size`: String, enum: `["XS", "S", "M", "L", "XL", "XXL", "XXXL", "N/A"]` (required for wearable items)
- `shippingAddress`: Object, optional
  - `hostel`: String
  - `roomNumber`: String
  - `additionalInfo`: String

**Response:**
```json
{
    "status": "success",
    "data": {
        "order": {
            "_id": "673c43e912abd5e72d56f9df",
            "userId": "673c3e6912abd5e72d56f9cb",
            "items": [
                {
                    "merchId": "673c42c712abd5e72d56f9dc",
                    "name": "Parsec T-Shirt",
                    "size": "L",
                    "quantity": 2,
                    "pricePerItem": 500,
                    "_id": "673c43e912abd5e72d56f9e0"
                },
                {
                    "merchId": "673c42d812abd5e72d56f9dd",
                    "name": "Parsec Sticker Pack",
                    "size": "N/A",
                    "quantity": 1,
                    "pricePerItem": 100,
                    "_id": "673c43e912abd5e72d56f9e1"
                }
            ],
            "totalAmount": 1100,
            "orderStatus": "pending",
            "paymentStatus": "pending",
            "shippingAddress": {
                "hostel": "BH3",
                "roomNumber": "201",
                "additionalInfo": "Near main entrance"
            },
            "createdAt": "2024-11-19T16:00:00.000Z",
            "updatedAt": "2024-11-19T16:00:00.000Z"
        }
    }
}
```

**Error Responses:**

**Insufficient Stock:**
```json
{
    "status": "fail",
    "message": "Insufficient stock for Parsec T-Shirt. Available: 5, Requested: 10"
}
```

**Size Required:**
```json
{
    "status": "fail",
    "message": "Size is required for wearable item: Parsec T-Shirt"
}
```

**Size Not Available:**
```json
{
    "status": "fail",
    "message": "Size XXL is not available for Parsec T-Shirt"
}
```

**Merchandise Not Found:**
```json
{
    "status": "fail",
    "message": "Merchandise with ID 673c42c712abd5e72d56f9dc not found."
}
```

---

#### 13. Get My Orders

**Endpoint:** `GET /orders/me`

**Description:** Get all orders placed by the logged-in user (sorted by newest first)

**Access:** Private (requires JWT + completed onboarding)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

**Request:** No body required

**Response:**
```json
{
    "status": "success",
    "results": 2,
    "data": {
        "orders": [
            {
                "_id": "673c43e912abd5e72d56f9df",
                "userId": "673c3e6912abd5e72d56f9cb",
                "items": [
                    {
                        "merchId": "673c42c712abd5e72d56f9dc",
                        "name": "Parsec T-Shirt",
                        "size": "L",
                        "quantity": 2,
                        "pricePerItem": 500
                    }
                ],
                "totalAmount": 1000,
                "orderStatus": "delivered",
                "paymentStatus": "completed",
                "shippingAddress": {
                    "hostel": "BH3",
                    "roomNumber": "201"
                },
                "deliveredAt": "2024-11-20T10:00:00.000Z",
                "createdAt": "2024-11-19T16:00:00.000Z",
                "updatedAt": "2024-11-20T10:00:00.000Z"
            },
            {
                "_id": "673c44fa12abd5e72d56f9e2",
                "userId": "673c3e6912abd5e72d56f9cb",
                "items": [
                    {
                        "merchId": "673c42d812abd5e72d56f9dd",
                        "name": "Parsec Sticker Pack",
                        "size": "N/A",
                        "quantity": 1,
                        "pricePerItem": 100
                    }
                ],
                "totalAmount": 100,
                "orderStatus": "pending",
                "paymentStatus": "pending",
                "createdAt": "2024-11-19T14:00:00.000Z",
                "updatedAt": "2024-11-19T14:00:00.000Z"
            }
        ]
    }
}
```

**Order Status Values:**
- `pending`: Order placed, awaiting confirmation
- `confirmed`: Order confirmed by admin
- `processing`: Order is being prepared
- `shipped`: Order has been shipped
- `delivered`: Order delivered to customer
- `cancelled`: Order cancelled

**Payment Status Values:**
- `pending`: Payment not completed
- `completed`: Payment successful
- `failed`: Payment failed
- `refunded`: Payment refunded

---

## 🔑 Admin Routes

All admin routes are prefixed with `/paneermoms` and require admin authentication token obtained from admin login.

### Admin Authentication

#### 14. Admin Login

**Endpoint:** `POST /paneermoms/login`

**Description:** Login as admin using secret key

**Access:** Public

**Headers:**
```javascript
{
    "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
    "adminKey": "kulhadpizza"
}
```

**Response (Success):**
```json
{
    "success": true,
    "message": "Admin authenticated successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE3MzE5OTAwMDAsImV4cCI6MTczMTk5MzYwMH0.xxxxx"
}
```

**Response (Invalid Key):**
```json
{
    "status": "fail",
    "message": "Chala ja bsdk yaha se. Chal nikal"
}
```

**Notes:**
- Admin token expires in **1 hour**
- Use this token in `Authorization` header for all admin routes

---

### Admin Payments

#### 15. Get All Payment Histories

**Endpoint:** `GET /paneermoms/payments`

**Description:** Get all payment records from all users

**Access:** Admin only

**Headers:**
```javascript
{
    "Authorization": "Bearer <admin_token>"
}
```

**Request:** No body required

**Response:**
```json
{
    "status": "success",
    "data": {
        "paymentHistories": [
            {
                "_id": "673c40a512abd5e72d56f9d8",
                "userId": {
                    "_id": "673c3e6912abd5e72d56f9cb",
                    "name": "Ayush Raj",
                    "email": "ayush@example.com",
                    "contactNumber": "9876543210"
                },
                "name": "Ayush Raj",
                "email": "ayush@example.com",
                "contactNumber": "9876543210",
                "amount": 999,
                "paymentUTR": "423456789012",
                "status": "pending",
                "createdAt": "2024-11-19T14:30:00.000Z",
                "updatedAt": "2024-11-19T14:30:00.000Z"
            },
            {
                "_id": "673c41b612abd5e72d56f9da",
                "userId": {
                    "_id": "673c3f2012abd5e72d56f9d5",
                    "name": "Priya Sharma",
                    "email": "priya@example.com",
                    "contactNumber": "9876543211"
                },
                "name": "Priya Sharma",
                "email": "priya@example.com",
                "contactNumber": "9876543211",
                "amount": 699,
                "paymentUTR": "523456789013",
                "status": "verified",
                "createdAt": "2024-11-18T10:15:00.000Z",
                "updatedAt": "2024-11-18T11:00:00.000Z"
            }
        ]
    }
}
```

---

#### 16. Verify Payment

**Endpoint:** `PATCH /paneermoms/payments/:id/verify`

**Description:** Mark a payment as verified/approved

**Access:** Admin only

**Headers:**
```javascript
{
    "Authorization": "Bearer <admin_token>"
}
```

**URL Parameters:**
- `id`: Payment ID (ObjectId)

**Request:** No body required

**Response:**
```json
{
    "status": "success",
    "data": {
        "payment": {
            "_id": "673c40a512abd5e72d56f9d8",
            "userId": "673c3e6912abd5e72d56f9cb",
            "name": "Ayush Raj",
            "email": "ayush@example.com",
            "contactNumber": "9876543210",
            "amount": 999,
            "paymentUTR": "423456789012",
            "status": "verified",
            "createdAt": "2024-11-19T14:30:00.000Z",
            "updatedAt": "2024-11-19T15:00:00.000Z"
        }
    }
}
```

**Error (Payment Not Found):**
```json
{
    "status": "fail",
    "message": "Payment not found."
}
```

---

#### 17. Reject Payment

**Endpoint:** `PATCH /paneermoms/payments/:id/reject`

**Description:** Mark a payment as rejected

**Access:** Admin only

**Headers:**
```javascript
{
    "Authorization": "Bearer <admin_token>"
}
```

**URL Parameters:**
- `id`: Payment ID (ObjectId)

**Request:** No body required

**Response:**
```json
{
    "status": "success",
    "data": {
        "payment": {
            "_id": "673c40a512abd5e72d56f9d8",
            "userId": "673c3e6912abd5e72d56f9cb",
            "name": "Ayush Raj",
            "email": "ayush@example.com",
            "contactNumber": "9876543210",
            "amount": 999,
            "paymentUTR": "423456789012",
            "status": "rejected",
            "createdAt": "2024-11-19T14:30:00.000Z",
            "updatedAt": "2024-11-19T15:05:00.000Z"
        }
    }
}
```

---

#### 18. Get Payment Statistics

**Endpoint:** `GET /paneermoms/payments/stats`

**Description:** Get overall payment statistics for admin dashboard

**Access:** Admin only

**Headers:**
```javascript
{
    "Authorization": "Bearer <admin_token>"
}
```

**Request:** No body required

**Response:**
```json
{
    "status": "success",
    "data": {
        "totalPayments": 38,
        "verifiedPayments": 25,
        "rejectedPayments": 5,
        "pendingPayments": 8
    }
}
```

---

### Admin Points

#### 19. Add Points to User

**Endpoint:** `POST /paneermoms/points/add`

**Description:** Add points to a specific user (and their house)

**Access:** Admin only

**Headers:**
```javascript
{
    "Authorization": "Bearer <admin_token>",
    "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
    "userId": "673c3e6912abd5e72d56f9cb",
    "pointsToAdd": 50
}
```

**Field Validations:**
- `userId`: String (ObjectId), required
- `pointsToAdd`: Number, required, must be positive

**Response:**
```json
{
    "status": "success",
    "message": "50 points added successfully",
    "data": {
        "user": {
            "id": "673c3e6912abd5e72d56f9cb",
            "name": "Ayush Raj",
            "points": 200,
            "house": "Gryffindor"
        },
        "house": {
            "name": "Gryffindor",
            "totalPoints": 1550
        }
    }
}
```

**Error (User Not Found):**
```json
{
    "status": "fail",
    "message": "User not found"
}
```

**Error (User Not Sorted):**
```json
{
    "status": "fail",
    "message": "User has not been sorted into a house yet"
}
```

---

#### 20. Subtract Points from User

**Endpoint:** `POST /paneermoms/points/subtract`

**Description:** Subtract points from a specific user (and their house)

**Access:** Admin only

**Headers:**
```javascript
{
    "Authorization": "Bearer <admin_token>",
    "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
    "userId": "673c3e6912abd5e72d56f9cb",
    "pointsToSubtract": 30
}
```

**Field Validations:**
- `userId`: String (ObjectId), required
- `pointsToSubtract`: Number, required, must be positive

**Response:**
```json
{
    "status": "success",
    "message": "30 points subtracted successfully",
    "data": {
        "user": {
            "id": "673c3e6912abd5e72d56f9cb",
            "name": "Ayush Raj",
            "points": 170,
            "house": "Gryffindor"
        },
        "house": {
            "name": "Gryffindor",
            "totalPoints": 1520
        }
    }
}
```

**Error (Insufficient Points):**
```json
{
    "status": "fail",
    "message": "Cannot subtract 50 points. User only has 30 points"
}
```

---

## ❌ Error Handling

### Common Error Response Format

All errors follow this structure:

```json
{
    "status": "fail",  // or "error" for server errors
    "message": "Error description here"
}
```

### Development Mode Errors (Detailed)

```json
{
    "status": "fail",
    "error": {
        "statusCode": 400,
        "status": "fail",
        "isOperational": true
    },
    "message": "Error description here",
    "stack": "Error: Error description here\n    at file:line:column..."
}
```

### Production Mode Errors (Clean)

```json
{
    "status": "fail",
    "message": "Error description here"
}
```

### Common Error Messages

**Authentication Errors:**
- `"You are not logged in. Please log in to get access."` (401)
- `"The user belonging to this token no longer exists."` (401)
- `"Invalid token. Please log in again."` (401)
- `"Your token has expired. Please log in again."` (401)

**Onboarding Errors:**
- `"Please complete your onboarding before accessing this resource."` (403)

**Validation Errors:**
- `"Amount and Payment UTR are required."` (400)
- `"User has already been sorted."` (400)
- `"Items array is required and must not be empty."` (400)
- `"Each item must have merchId and quantity."` (400)
- `"Insufficient stock for Parsec T-Shirt. Available: 5, Requested: 10"` (400)
- `"Size is required for wearable item: Parsec T-Shirt"` (400)
- `"Size XXL is not available for Parsec T-Shirt"` (400)

**Not Found Errors:**
- `"User not found."` (404)
- `"Payment not found."` (404)
- `"Merchandise with ID ... not found."` (404)

**Server Errors:**
- `"Something went wrong!"` (500)

---

## 📊 HTTP Status Codes

| Status Code | Meaning | Usage |
|------------|---------|-------|
| **200** | OK | Successful GET, PATCH requests |
| **201** | Created | Successful POST (resource created) |
| **400** | Bad Request | Validation errors, missing fields |
| **401** | Unauthorized | Authentication required or failed |
| **403** | Forbidden | User doesn't have permission (onboarding incomplete) |
| **404** | Not Found | Resource doesn't exist |
| **500** | Internal Server Error | Unexpected server error |

---

## 🎯 Important Notes for Frontend Developers

### 1. **JWT Token Storage**
- Store JWT token securely (httpOnly cookie is set automatically)
- For API calls, include token in Authorization header
- Token expires after 7 days for users, 1 hour for admins

### 2. **Onboarding Flow**
```javascript
// Step 1: User logs in with Google
GET /auth/google

// Step 2: Check if onboarding is complete
GET /auth/me
// If isOnboardingComplete === false, redirect to onboarding page

// Step 3: Complete onboarding
POST /onboarding
{
    "college": "...",
    "batch": "...",
    // ... other fields
}

// Step 4: Get sorted into a house
POST /sorting-hat/sort

// Step 5: Now user can access all features
```

### 3. **Error Handling Example**
```javascript
try {
    const response = await fetch('https://parsec.iitdh.ac.in/api/parsec/v1/payments', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: 999,
            paymentUTR: "423456789012"
        })
    });

    const data = await response.json();

    if (data.status === 'fail' || data.status === 'error') {
        // Show error message to user
        showErrorToast(data.message);
    } else {
        // Success handling
        showSuccessToast('Payment submitted successfully!');
    }
} catch (error) {
    // Network or parsing error
    showErrorToast('Something went wrong. Please try again.');
}
```

### 4. **Admin Panel Flow**
```javascript
// Step 1: Admin logs in
POST /paneermoms/login
{
    "adminKey": "kulhadpizza"
}

// Step 2: Store admin token
localStorage.setItem('adminToken', response.token);

// Step 3: Use admin token for all admin operations
fetch('https://parsec.iitdh.ac.in/api/parsec/v1/paneermoms/payments', {
    headers: {
        'Authorization': `Bearer ${adminToken}`
    }
});
```

### 5. **Order Creation Best Practices**
- Frontend should validate stock availability before submission (optional - server validates anyway)
- Show clear error messages for stock issues
- For wearable items, make size selection mandatory in UI
- Calculate total amount on frontend for preview (server will recalculate for security)
- Server automatically:
  - Validates merchandise exists
  - Checks stock availability
  - Validates size for wearables
  - Calculates correct total amount
  - Decrements stock quantity

### 6. **House Leaderboard**
- Public route `/sorting-hat/stats` doesn't require authentication
- Refresh periodically to show updated standings
- Sort by points for leaderboard display

### 7. **Order Status Tracking**
- Orders are sorted by `createdAt` in descending order (newest first)
- Display order status and payment status separately
- Show `deliveredAt` timestamp when order status is "delivered"
- Order statuses: pending → confirmed → processing → shipped → delivered
- Payment statuses: pending → completed (or failed/refunded)

---

## 🧪 Testing with Postman

### Environment Variables
Create a Postman environment with:
```
BASE_URL = https://parsec.iitdh.ac.in/api/parsec/v1
DEV_BASE_URL = http://localhost:3000/api/parsec/v1
JWT_TOKEN = <your_jwt_token>
ADMIN_TOKEN = <admin_token>
```

### Example Collection Structure
```
Parsec Backend
├── Auth
│   ├── Google Login (GET)
│   ├── Get Current User (GET)
│   └── Logout (POST)
├── Onboarding
│   └── Complete Onboarding (POST)
├── Sorting Hat
│   ├── Get House Stats (GET)
│   ├── Get My House (GET)
│   └── Sort User (POST)
├── Payments
│   ├── Record Payment (POST)
│   └── Get My Payment History (GET)
├── Points
│   └── Get My Points (GET)
├── Orders
│   ├── Create Order (POST)
│   └── Get My Orders (GET)
└── Admin
    ├── Admin Login (POST)
    ├── Get All Payments (GET)
    ├── Verify Payment (PATCH)
    ├── Reject Payment (PATCH)
    ├── Get Payment Stats (GET)
    ├── Add Points (POST)
    └── Subtract Points (POST)
```

---

## 📞 Support

For any questions or issues, please contact the backend team or create an issue in the repository.

**Happy Coding! 🚀**

---

*Last Updated: November 19, 2024*
*Made by: Ayush Raj*
