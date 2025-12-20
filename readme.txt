# Parsec Backend API Documentation

> **Made by:** Ayush Raj  
> **Last Updated:** November 30, 2025

---

## 📋 Table of Contents
- [Base URL](#base-url)
- [API Response Format](#api-response-format)
- [Authentication](#authentication)
- [User Endpoints](#user-endpoints)
  - [Authentication](#authentication-endpoints)
  - [Onboarding](#onboarding-endpoints)
  - [Sorting Hat](#sorting-hat-endpoints)
  - [Payments](#payment-endpoints)
  - [Points](#points-endpoints)
  - [Orders](#order-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Error Handling](#error-handling)

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

## 📊 API Response Format

All responses follow JSend specification:

**Success:**
```json
{
    "status": "success",
    "data": { /* response data */ }
}
```

**Fail (Client Error):**
```json
{
    "status": "fail",
    "message": "Error description"
}
```

**Error (Server Error):**
```json
{
    "status": "error",
    "message": "Something went wrong"
}
```

---

## 🔐 Authentication

**JWT Token in Headers:**
```javascript
{
    "Authorization": "Bearer <your_jwt_token>"
}
```

**Access Levels:**
- **Public**: No authentication required
- **Private**: Requires JWT token (`protect` middleware)
- **Onboarding Required**: Requires JWT + completed onboarding (`protect` + `requireOnboarding`)
- **Admin**: Requires admin JWT token (`verifyAdminToken`)

---

## 👤 User Endpoints

### Authentication Endpoints

#### 1. Initiate Google OAuth

```http
GET /auth/google
```

**Description:** Redirects user to Google OAuth consent screen

**Access:** Public

**Usage:**
```javascript
window.location.href = 'https://parsec.iitdh.ac.in/api/parsec/v1/auth/google';
```

**Flow:**
1. User clicks "Login with Google"
2. Backend redirects to Google
3. User approves
4. Google redirects back to `/auth/google/callback`
5. Backend processes OAuth and redirects to frontend with token

---

#### 2. Google OAuth Callback

```http
GET /auth/google/callback
```

**Description:** Handles Google OAuth callback (automatic)

**Access:** Public

**Response:** Redirects to:
```
https://parsec-6-0.vercel.app/signup/auth?token=<jwt_token>
```

**Frontend Handling:**
```javascript
// On /signup/auth page
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
    localStorage.setItem('jwt', token);
    
    // Check onboarding status
    const response = await fetch('/api/parsec/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (data.data.user.isOnboardingComplete) {
        router.push('/dashboard');
    } else {
        router.push('/onboarding');
    }
}
```

---

#### 3. Get Current User

```http
GET /auth/me
```

**Description:** Get logged-in user information

**Access:** Private (JWT required)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "user": {
            "email": "user@example.com",
            "name": "John Doe",
            "avatar": "https://lh3.googleusercontent.com/...",
            "house": "Gryffindor",
            "points": 150,
            "isOnboardingComplete": true
        }
    }
}
```

---

#### 4. Logout

```http
POST /auth/logout
```

**Description:** Logout user and clear JWT cookie

**Access:** Private (JWT required)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Logged out successfully"
}
```

---

### Onboarding Endpoints

#### 5. Submit Onboarding

```http
POST /onboarding/submit
```

**Description:** Complete user onboarding with required information

**Access:** Private (JWT required)

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
    "gender": "male",
    "contactNumber": "9876543210",
    "aadharOrCollegeId": "1234-5678-9012",
    "merchSize": "L"
}
```

**Validations:**
- `gender`: `"male"` | `"female"` | `"other"`
- `merchSize`: `"XS"` | `"S"` | `"M"` | `"L"` | `"XL"` | `"XXL"` | `"XXXL"`
- All fields are **required**

**Response:**
```json
{
    "status": "success",
    "message": "Onboarding information submitted successfully",
    "data": {
        "user": {
            "id": "673c3e6912abd5e72d56f9cb",
            "email": "user@example.com",
            "name": "John Doe",
            "college": "IIT Delhi",
            "batch": "2024",
            "gender": "male",
            "contactNumber": "9876543210",
            "aadharOrCollegeId": "1234-5678-9012",
            "merchSize": "L"
        }
    }
}
```

---

### Sorting Hat Endpoints

#### 6. Get House Statistics (Public)

```http
GET /sorting-hat/stats
```

**Description:** Get statistics of all houses (leaderboard)

**Access:** Public

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

```http
GET /sorting-hat/my-house
```

**Description:** Get current user's house information

**Access:** Private (JWT + Onboarding required)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

**Response (Sorted):**
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

**Response (Not Sorted):**
```json
{
    "status": "fail",
    "message": "User has not been sorted into a house yet."
}
```

---

#### 8. Sort User into House

```http
POST /sorting-hat/sort
```

**Description:** Assign user to a house using sorting algorithm

**Access:** Private (JWT + Onboarding required)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "You have been sorted into Gryffindor! 🦁",
    "data": {
        "user": {
            "_id": "673c3e6912abd5e72d56f9cb",
            "name": "John Doe",
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

**Error (Already Sorted):**
```json
{
    "status": "fail",
    "message": "User has already been sorted."
}
```

---

### Payment Endpoints

#### 9. Create Payment

```http
POST /payments
```

**Description:** Submit a payment for verification

**Access:** Private (JWT + Onboarding required)

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

**Response:**
```json
{
    "status": "success",
    "data": {
        "paymentHistory": {
            "_id": "673c40a512abd5e72d56f9d8",
            "userId": "673c3e6912abd5e72d56f9cb",
            "name": "John Doe",
            "email": "user@example.com",
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

**Payment Status:**
- `pending`: Awaiting admin verification
- `verified`: Approved by admin
- `rejected`: Rejected by admin

---

#### 10. Get My Payment History

```http
GET /payments/me
```

**Description:** Get all payments made by logged-in user

**Access:** Private (JWT + Onboarding required)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "paymentHistory": [
            {
                "_id": "673c40a512abd5e72d56f9d8",
                "userId": "673c3e6912abd5e72d56f9cb",
                "name": "John Doe",
                "email": "user@example.com",
                "contactNumber": "9876543210",
                "amount": 999,
                "paymentUTR": "423456789012",
                "status": "verified",
                "createdAt": "2024-11-19T14:30:00.000Z",
                "updatedAt": "2024-11-19T15:00:00.000Z"
            }
        ]
    }
}
```

---

### Points Endpoints

#### 11. Get My Points

```http
GET /points
```

**Description:** Get current user's points

**Access:** Private (JWT + Onboarding required)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

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

### Order Endpoints

#### 12. Create Order

```http
POST /orders
```

**Description:** Create a new merchandise order

**Access:** Private (JWT + Onboarding required)

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

**Notes:**
- `size` is required for wearable items
- Server validates stock availability
- Server calculates total amount (don't send it)
- Stock is automatically decremented

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
                    "pricePerItem": 500
                }
            ],
            "totalAmount": 1000,
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

**Order Status:**
- `pending` → `confirmed` → `processing` → `shipped` → `delivered`
- `cancelled`

**Payment Status:**
- `pending` → `completed`
- `failed` | `refunded`

**Common Errors:**
```json
{
    "status": "fail",
    "message": "Insufficient stock for Parsec T-Shirt. Available: 5, Requested: 10"
}
```

---

#### 13. Get My Orders

```http
GET /orders/me
```

**Description:** Get all orders (sorted by newest first)

**Access:** Private (JWT + Onboarding required)

**Headers:**
```javascript
{
    "Authorization": "Bearer <jwt_token>"
}
```

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
            }
        ]
    }
}
```

---

## 🔑 Admin Endpoints

All admin routes are under `/paneermoms` prefix and require admin authentication.

### Admin Authentication

#### 14. Admin Login

```http
POST /paneermoms/login
```

**Description:** Login as admin using secret key

**Access:** Public

**Request Body:**
```json
{
    "adminKey": "kulhadpizza"
}
```

**Response (Success):**
```json
{
    "status": "success",
    "message": "Admin authenticated successfully",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

**Response (Invalid):**
```json
{
    "status": "fail",
    "message": "Chala ja bsdk yaha se. Chal nikal"
}
```

**Notes:**
- Token expires in **1 hour**
- Use in Authorization header for all admin routes

---

### Admin Payment Management

#### 15. Get All Payments

```http
GET /paneermoms/payments
```

**Description:** Get all payment records

**Access:** Admin only

**Headers:**
```javascript
{
    "Authorization": "Bearer <admin_token>"
}
```

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
                    "name": "John Doe",
                    "email": "user@example.com"
                },
                "amount": 999,
                "paymentUTR": "423456789012",
                "status": "pending",
                "createdAt": "2024-11-19T14:30:00.000Z"
            }
        ]
    }
}
```

---

#### 16. Verify Payment

```http
PATCH /paneermoms/payments/:id/verify
```

**Description:** Approve a payment

**Access:** Admin only

**Headers:**
```javascript
{
    "Authorization": "Bearer <admin_token>"
}
```

**URL Params:**
- `id`: Payment ID (ObjectId)

**Response:**
```json
{
    "status": "success",
    "data": {
        "payment": {
            "_id": "673c40a512abd5e72d56f9d8",
            "status": "verified",
            "updatedAt": "2024-11-19T15:00:00.000Z"
        }
    }
}
```

---

#### 17. Reject Payment

```http
PATCH /paneermoms/payments/:id/reject
```

**Description:** Reject a payment

**Access:** Admin only

**Headers:**
```javascript
{
    "Authorization": "Bearer <admin_token>"
}
```

**URL Params:**
- `id`: Payment ID (ObjectId)

**Response:**
```json
{
    "status": "success",
    "data": {
        "payment": {
            "_id": "673c40a512abd5e72d56f9d8",
            "status": "rejected",
            "updatedAt": "2024-11-19T15:05:00.000Z"
        }
    }
}
```

---

#### 18. Get Payment Statistics

```http
GET /paneermoms/payments/stats
```

**Description:** Get payment statistics for dashboard

**Access:** Admin only

**Headers:**
```javascript
{
    "Authorization": "Bearer <admin_token>"
}
```

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

### Admin Points Management

#### 19. Add Points to User

```http
POST /paneermoms/points/add
```

**Description:** Add points to user and their house

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

**Response:**
```json
{
    "status": "success",
    "message": "50 points added successfully",
    "data": {
        "user": {
            "id": "673c3e6912abd5e72d56f9cb",
            "name": "John Doe",
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

---

#### 20. Subtract Points from User

```http
POST /paneermoms/points/subtract
```

**Description:** Subtract points from user and their house

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

**Response:**
```json
{
    "status": "success",
    "message": "30 points subtracted successfully",
    "data": {
        "user": {
            "id": "673c3e6912abd5e72d56f9cb",
            "name": "John Doe",
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

---

## ❌ Error Handling

### Error Response Format

```json
{
    "status": "fail",
    "message": "Error description"
}
```

### Common Error Messages

**Authentication (401):**
- `"You are not logged in. Please log in to get access."`
- `"Invalid token. Please log in again."`
- `"Your token has expired. Please log in again."`

**Authorization (403):**
- `"Please complete your onboarding before accessing this resource."`
- `"Access denied. Admin privileges required."`

**Validation (400):**
- `"All onboarding fields are required."`
- `"Items array is required and must not be empty."`
- `"Each item must have merchId and quantity."`
- `"Insufficient stock for Parsec T-Shirt. Available: 5, Requested: 10"`
- `"Size is required for wearable item: Parsec T-Shirt"`

**Not Found (404):**
- `"User not found."`
- `"Payment not found."`
- `"Merchandise with ID ... not found."`

**Server Error (500):**
- `"Something went wrong!"`

---

## 📊 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| **200** | OK | Successful GET, PATCH |
| **201** | Created | Successful POST |
| **400** | Bad Request | Validation errors |
| **401** | Unauthorized | Authentication failed |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **500** | Server Error | Unexpected error |

---

## 🎯 Frontend Integration Guide

### 1. Authentication Flow

```javascript
// Step 1: Redirect to Google OAuth
const handleLogin = () => {
    window.location.href = 'https://parsec.iitdh.ac.in/api/parsec/v1/auth/google';
};

// Step 2: Handle callback on /signup/auth page
useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
        localStorage.setItem('jwt', token);
        
        // Check onboarding
        fetch('/api/parsec/v1/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.data.user.isOnboardingComplete) {
                router.push('/dashboard');
            } else {
                router.push('/onboarding');
            }
        });
    }
}, []);
```

### 2. Axios Setup

```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://parsec.iitdh.ac.in/api/parsec/v1',
    withCredentials: true
});

// Add token to all requests
api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('jwt');
            router.push('/login');
        }
        return Promise.reject(error);
    }
);

export default api;
```

### 3. Error Handling

```javascript
try {
    const response = await api.post('/payments', {
        amount: 999,
        paymentUTR: '423456789012'
    });
    
    if (response.data.status === 'success') {
        showSuccess('Payment submitted!');
    }
} catch (error) {
    const message = error.response?.data?.message || 'Something went wrong';
    showError(message);
}
```

### 4. Admin Panel

```javascript
// Admin login
const handleAdminLogin = async (adminKey) => {
    const response = await api.post('/paneermoms/login', { adminKey });
    localStorage.setItem('adminToken', response.data.data.token);
};

// Use admin token
const getPayments = async () => {
    const adminToken = localStorage.getItem('adminToken');
    const response = await api.get('/paneermoms/payments', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    return response.data.data.paymentHistories;
};
```

---

## 📞 Support

For questions or issues, contact the backend team (Ayush Raj).

**Happy Coding! 🚀**

---

*Made by: Ayush Raj with ❤️*
