# 🔥 URGENT: Backend API Changes Required

## Quick Summary for Backend Developer

Hey! The frontend shop/payment system is **fully implemented** and ready. Just need **3 small backend changes** to make everything work perfectly.

---

## ⚠️ REQUIRED CHANGES

### 1. Payment Screenshot Support

**Change Required:** Add `paymentScreenshot` field to payments

**Endpoints to Update:**

#### POST /api/parsec/v1/payments
**Current Request:**
```json
{
  "orderId": "...",
  "amount": 1297,
  "paymentUTR": "UTR123456789"
}
```

**NEW Request (add optional field):**
```json
{
  "orderId": "...",
  "amount": 1297,
  "paymentUTR": "UTR123456789",
  "paymentScreenshot": "data:image/jpeg;base64,/9j/..." // OPTIONAL - base64 string
}
```

**What to do:**
- Add `paymentScreenshot` field to Payment schema (String, optional)
- Store the base64 string or upload to cloud storage and store URL
- No validation needed - just store if provided

#### GET /api/parsec/v1/paneermoms/payments
**Just include `paymentScreenshot` in response:**
```json
{
  "status": "success",
  "data": {
    "paymentHistories": [
      {
        "_id": "...",
        "paymentUTR": "...",
        "paymentScreenshot": "data:image/...", // ADD THIS
        "status": "pending"
      }
    ]
  }
}
```

---

### 2. Points Management - Use Email Instead of MongoDB ID

**Change Required:** Accept `email` instead of `userId` for points updates

#### POST /api/parsec/v1/paneermoms/points/add
**Current:**
```json
{
  "userId": "673c3e6912abd5e72d56f9cb",
  "pointsToAdd": 50
}
```

**NEW:**
```json
{
  "email": "student@example.com",
  "points": 50
}
```

**Implementation:**
```javascript
// Old way
const user = await User.findById(userId);

// New way - just change to this
const user = await User.findOne({ email });
if (!user) {
  return res.status(404).json({
    status: "error",
    message: "User not found with this email"
  });
}

// Rest of the logic stays the same
user.points += points;
// Update house points, etc.
```

#### POST /api/parsec/v1/paneermoms/points/subtract
**Same changes as above:**
- Accept `email` and `points` instead of `userId` and `pointsToSubtract`
- Look up user by email
- Rest stays the same

**Response format (keep the same):**
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

### 3. Pass Availability Management (Optional - Low Priority)

**Currently:** Frontend stores pass availability in localStorage
**Better:** Sync with backend

Add these endpoints if time permits:
- `GET /api/admin/passes` - get current pass availability
- `POST /api/admin/passes/update` - update pass availability

Not critical since passes can be managed as regular merch items.

---

## ✅ What's Already Working (No Changes Needed)

These endpoints are perfect as-is:
- ✅ GET /api/parsec/v1/merch
- ✅ POST /api/parsec/v1/orders
- ✅ PATCH /api/parsec/v1/paneermoms/payments/:id/verify
- ✅ PATCH /api/parsec/v1/paneermoms/payments/:id/reject
- ✅ All auth endpoints

---

## 📝 Testing After Changes

### Test Payment Screenshot:
```bash
curl -X POST http://localhost:3000/api/parsec/v1/payments \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "67a123...",
    "amount": 1297,
    "paymentUTR": "UTR123456",
    "paymentScreenshot": "data:image/jpeg;base64,iVBORw0KGgoAAAANS..."
  }'
```

### Test Points by Email:
```bash
curl -X POST http://localhost:3000/api/parsec/v1/paneermoms/points/add \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "points": 50
  }'
```

---

## 🚀 Priority

1. **HIGH:** Payment screenshot (change 1)
2. **HIGH:** Email-based points (change 2)
3. **LOW:** Pass management sync (change 3)

---

## 📞 Questions?

Check the full documentation in `SHOP_PAYMENT_FLOW_DOCUMENTATION.md` for complete details on the entire flow, all endpoints, and expected responses.

**Frontend is 100% ready** - just waiting on these 2 backend tweaks! 🎉
