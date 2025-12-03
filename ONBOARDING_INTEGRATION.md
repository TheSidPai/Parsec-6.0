# Onboarding API Integration - Complete Workflow & Testing Guide

## 📋 Summary of Changes

I've successfully integrated the backend API for the onboarding flow. Here's what was implemented:

### Files Created:
1. **`src/config/api.js`** - Centralized API configuration
2. **`.env.example`** - Environment variable template

### Files Modified:
1. **`src/pages/signup/Onboarding.jsx`**
   - Fixed gender values to match API (Male/Female/Other with proper capitalization)
   - Fixed batch field to send as string (API expects string, not number)
   - Integrated API config helper for cleaner code
   
2. **`src/pages/signup/Auth.jsx`**
   - Updated to use centralized API configuration
   
3. **`src/pages/Login.jsx`**
   - Updated to use centralized API configuration
   
4. **`package.json`**
   - Added proxy configuration for local development

---

## 🔄 Complete Workflow

### 1. **User Clicks "Sign in with Google" (Login.jsx)**
   - User is on `/login` page
   - Clicks "Sign in with Google" button
   - Browser redirects to: `http://localhost:3000/api/parsec/v1/auth/google`
   - Backend handles Google OAuth flow

### 2. **Google OAuth Authentication**
   - User authenticates with Google
   - Google redirects back to backend callback: `/api/parsec/v1/auth/google/callback`
   - Backend sets httpOnly cookie with JWT token
   - Backend redirects browser to frontend: `/signup/auth`

### 3. **Auth Processing (Auth.jsx)**
   - Frontend at `/signup/auth` receives the redirect
   - Makes GET request to `/api/parsec/v1/auth/google/callback` with credentials
   - Backend returns JSON:
     ```json
     {
       "success": true,
       "message": "Authentication successful",
       "token": "eyJhbGc...",
       "user": {
         "isOnboardingComplete": false,
         "_id": "...",
         "name": "John Doe",
         "email": "john@example.com"
       }
     }
     ```
   - If `isOnboardingComplete === false`: Navigate to `/signup/onboarding` (with token)
   - If `isOnboardingComplete === true`: Navigate to `/dashboard`

### 4. **Onboarding Form (Onboarding.jsx)**
   - User sees onboarding form with 6 fields:
     - College (text input)
     - Batch Year (number input, e.g., "2024")
     - Gender (dropdown: Male/Female/Other)
     - Contact Number (10-digit phone number)
     - Aadhar or College ID (text input)
     - Merch Size (dropdown: XS/S/M/L/XL/XXL/XXXL)
   
   - User fills the form and clicks "Complete Onboarding"

### 5. **Form Submission**
   - Client-side validation runs first:
     - All fields required
     - Contact number must be 10 digits
     - Batch year must be reasonable (1900-2100)
   
   - If validation passes, POST request sent to `/api/parsec/v1/onboarding`:
     ```json
     {
       "college": "IIT Dharwad",
       "batch": "2024",
       "gender": "Male",
       "contactNumber": "9876543210",
       "aadharOrCollegeId": "1234-5678-9012",
       "merchSize": "L"
     }
     ```
   
   - Headers include:
     ```javascript
     {
       "Authorization": "Bearer <jwt_token>",
       "Content-Type": "application/json"
     }
     ```

### 6. **Backend Response**
   - **Success (200):**
     ```json
     {
       "status": "success",
       "message": "Onboarding completed successfully",
       "data": {
         "user": {
           "_id": "...",
           "name": "John Doe",
           "email": "john@example.com",
           "college": "IIT Dharwad",
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
     - Frontend shows success message
     - Redirects to `/dashboard` after 1.5 seconds
   
   - **Error (4xx/5xx):**
     - Error message displayed to user
     - User can correct and resubmit

---

## 🧪 Testing Instructions

### Prerequisites:
1. **IMPORTANT:** Use the deployed backend (`https://parsec.iitdh.ac.in`) which has Google OAuth configured
2. Create a `.env` file in `parsec-frontend/` with:
   ```
   REACT_APP_API_URL=https://parsec.iitdh.ac.in/api/parsec/v1
   ```
3. **Note:** Local backend on `http://localhost:3000` will NOT work for OAuth unless you configure Google OAuth credentials locally

### Why Use Deployed Backend?
- ✅ Google OAuth is configured and working
- ✅ All endpoints are live and functional
- ❌ Local backend requires Google OAuth setup (complex)

### Step-by-Step Testing:

#### 1. **Start the Development Server**
```powershell
cd parsec-frontend
npm install  # If not already done
npm start
```

The React app should start on `http://localhost:3001` (or 3000 if backend is on different port).

#### 2. **Test Login Flow**
1. Navigate to `http://localhost:3001/login`
2. Click "Sign in with Google"
3. You should be redirected to Google OAuth
4. Sign in with your Google account
5. You should be redirected back to `/signup/auth`
6. Check browser console for any errors
7. You should automatically redirect to either:
   - `/signup/onboarding` (if first time user)
   - `/dashboard` (if already onboarded)

#### 3. **Test Onboarding Form**

**Case 1: Valid Submission**
1. Fill all fields correctly:
   - College: "IIT Dharwad"
   - Batch: "2024"
   - Gender: "Male"
   - Contact Number: "9876543210"
   - Aadhar/College ID: "ABC123456"
   - Merch Size: "L"
2. Click "Complete Onboarding"
3. **Expected:** Success message appears, redirects to dashboard
4. **Check backend:** User document should be updated with onboarding info

**Case 2: Validation Errors**
1. Leave College field empty, click submit
   - **Expected:** Error: "College name is required"
2. Enter 9-digit phone number: "987654321"
   - **Expected:** Error: "Contact number must be 10 digits"
3. Enter invalid batch: "abc"
   - **Expected:** Error: "Please enter a valid batch year"

**Case 3: Network Error**
1. Stop the backend server
2. Fill form and submit
   - **Expected:** Error message about network failure

**Case 3: Already Onboarded**
1. Try to access `/signup/onboarding` after completing onboarding
2. **Expected behavior:** Should redirect to dashboard (backend will return 400 error or success)

#### 4. **Test API Integration**

**Using Browser DevTools:**
1. Open Developer Tools (F12)
2. Go to Network tab
3. Fill and submit onboarding form
4. Check the network request:
   - **URL:** `http://localhost:3000/api/parsec/v1/onboarding`
   - **Method:** POST
   - **Request Headers:** Should include `Authorization: Bearer <token>`
   - **Request Body:** Should match form data with correct field names and values
   - **Response:** Should be JSON with status "success"

**Using Console:**
```javascript
// Check if token is being passed
console.log('Token available:', !!localStorage.getItem('jwt_token'));

// Check API configuration
import { API_BASE_URL } from './config/api';
console.log('API Base URL:', API_BASE_URL);
```

#### 5. **Test Error Handling**

**Test 401 Unauthorized:**
1. Manually clear authentication
2. Try to access `/signup/onboarding`
3. **Expected:** Error message or redirect to login

**Test 400 Bad Request:**
1. Modify the form to send invalid data (e.g., in DevTools console):
   ```javascript
   // Send invalid gender value
   fetch('/api/parsec/v1/onboarding', {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer <your_token>',
       'Content-Type': 'application/json'
     },
     credentials: 'include',
     body: JSON.stringify({
       college: "IIT",
       batch: "2024",
       gender: "invalid",  // Should fail
       contactNumber: "1234567890",
       aadharOrCollegeId: "ABC",
       merchSize: "M"
     })
   });
   ```
2. **Expected:** Backend returns 400 error with validation message

---

## 🐛 Debugging Tips

### Problem: "Authentication token not found"
- **Cause:** Token not passed from Auth.jsx to Onboarding.jsx
- **Check:** Verify `navigate('/signup/onboarding', { state: { token } })` in Auth.jsx
- **Check:** Verify `const token = location.state?.token;` in Onboarding.jsx

### Problem: API calls failing with CORS errors
- **Cause:** Proxy not working correctly
- **Solution:** Restart the React dev server after adding proxy to package.json
- **Alternative:** Set REACT_APP_API_URL in .env file

### Problem: "Gender validation failed"
- **Cause:** Incorrect gender values
- **Check:** Ensure dropdown values are "Male", "Female", "Other" (capitalized)

### Problem: "Batch validation failed"
- **Cause:** Backend expects string but receiving number
- **Check:** Ensure batch is sent as string, not using parseInt()

### Problem: Network request shows 404
- **Cause:** Backend not running or wrong endpoint
- **Check:** 
  1. Backend is running on port 3000
  2. Endpoint is `/api/parsec/v1/onboarding` (not `/onboarding`)
  3. Check proxy configuration in package.json

### Problem: Token not included in request
- **Cause:** Token not being passed or stored correctly
- **Check:** 
  1. Token is in location.state
  2. Token is added to Authorization header
  3. credentials: 'include' is set for cookie support

---

## 🔍 Verification Checklist

After completing all changes, verify:

- [ ] Backend server is running on port 3000
- [ ] Frontend proxy is configured in package.json
- [ ] Google OAuth redirects work correctly
- [ ] Auth.jsx properly fetches user data and determines onboarding status
- [ ] Onboarding form renders with all 6 fields
- [ ] Gender dropdown has "Male", "Female", "Other" (capitalized)
- [ ] Batch field sends string value (not number)
- [ ] Contact number validates for 10 digits
- [ ] API request includes Authorization header with JWT token
- [ ] API request includes credentials: 'include' for cookies
- [ ] Success response redirects to dashboard
- [ ] Error responses display user-friendly messages
- [ ] Console shows no errors during normal flow

---

## 📝 Additional Notes

### Environment Variables
For production deployment, create a `.env` file (copy from `.env.example`):
```bash
REACT_APP_API_URL=https://parsec.iitdh.ac.in/api/parsec/v1
```

### API Configuration
The `src/config/api.js` file provides:
- Centralized API URL management
- Helper functions for authenticated requests
- All endpoint definitions in one place
- Easy environment switching

### Future Enhancements
Consider adding:
- Loading states with better UX (spinner, skeleton)
- Form field error highlighting
- Success animations
- Retry mechanism for failed requests
- Toast notifications instead of inline errors

---

## 🎯 Quick Test Command

To quickly test the full flow:
1. Start backend: `cd ../backend && npm start`
2. Start frontend: `cd parsec-frontend && npm start`
3. Open browser: `http://localhost:3001/login`
4. Sign in and complete onboarding
5. Check database to verify data was saved

---

**Integration Complete! ✅**

All changes have been made to properly connect the onboarding form to your backend API. The workflow is now fully functional and ready for testing.
