import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, authenticatedFetch } from "../../config/api";
import "./Onboarding.css";

/**
 * ONBOARDING FORM COMPONENT
 *
 * This component handles the complete user onboarding flow:
 * 1. Collects user information through a form
 * 2. Validates the input data
 * 3. Sends a POST request to the backend API
 * 4. Handles success/error responses
 */

const OnboardingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get token from location state (passed from Auth page) or localStorage as fallback
  const token = location.state?.token || localStorage.getItem('jwt_token');
  // ========== STATE MANAGEMENT ==========

  // Form data state - holds all the user inputs
  const [formData, setFormData] = useState({
    college: "",
    batch: "",
    gender: "",
    contactNumber: "",
    aadharOrCollegeId: "",
    merchSize: "",
  });

  // UI state management
  const [loading, setLoading] = useState(false); // Shows loading spinner during API call
  const [error, setError] = useState(null); // Stores error messages
  const [success, setSuccess] = useState(false); // Tracks successful submission

  // ========== FORM HANDLERS ==========

  /**
   * Handles input changes for all form fields
   * Uses the 'name' attribute to identify which field changed
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  /**
   * Client-side validation before sending to backend
   * Returns true if all validations pass, false otherwise
   */
  const validateForm = () => {
    // Check if all fields are filled
    if (!formData.college.trim()) {
      setError("College name is required");
      return false;
    }

    if (!formData.batch) {
      setError("Batch year is required");
      return false;
    }

    // Validate batch year is a reasonable number
    const batchYear = parseInt(formData.batch);
    if (isNaN(batchYear) || batchYear < 1900 || batchYear > 2100) {
      setError("Please enter a valid batch year");
      return false;
    }

    if (!formData.gender) {
      setError("Gender is required");
      return false;
    }

    if (!formData.contactNumber.trim()) {
      setError("Contact number is required");
      return false;
    }

    // Basic phone number validation (10 digits)
    if (!/^\d{10}$/.test(formData.contactNumber)) {
      setError("Contact number must be 10 digits");
      return false;
    }

    if (!formData.aadharOrCollegeId.trim()) {
      setError("Aadhar or College ID is required");
      return false;
    }

    if (!formData.merchSize) {
      setError("Merch size is required");
      return false;
    }

    return true;
  };

  /**
   * Handles form submission
   * 1. Validates form data
   * 2. Makes API call to backend
   * 3. Handles response/errors
   */
  const handleSubmit = async () => {
    // Validate before sending
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ========== API CALL ==========

      if (!token) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      // Prepare the request body (batch should be sent as string)
      const requestBody = {
        ...formData,
      };

      // Make the POST request using authenticatedFetch helper
      const { response, data } = await authenticatedFetch(
        API_ENDPOINTS.ONBOARDING,
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        },
        token
      );

      // Check if request was successful
      if (!response.ok) {
        // Handle HTTP errors (4xx, 5xx)
        throw new Error(data?.message || "Onboarding failed. Please try again.");
      }

      // ========== SUCCESS ==========
      setSuccess(true);
      console.log("Onboarding successful:", data);

      // Redirect to sorting ceremony after brief delay
      setTimeout(() => {
        navigate('/signup/sorting');
      }, 1500);
    } catch (err) {
      // ========== ERROR HANDLING ==========
      console.error("Onboarding error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ========== SUCCESS VIEW ==========
  // Show this after successful onboarding
  if (success) {
    return (
      <div className="onboarding-container">
        <div className="onboarding-card">
          <div className="success-container">
            <h2 className="success-title">
              ✨ Onboarding Complete!
            </h2>
            <p className="success-message">
              Your profile has been successfully set up. Preparing the Sorting Hat ceremony...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========== FORM VIEW ==========
  return (
    <div className="onboarding-container">
      {/* Floating orbs */}
      <div className="floating-orb-1"></div>
      <div className="floating-orb-2"></div>
      
      {/* Shooting stars */}
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      
      {/* Magical fog */}
      <div className="fog"></div>
      
      {/* Glow rings */}
      <div className="glow-ring"></div>
      <div className="glow-ring"></div>

      <div className="onboarding-card">
        <h1 className="onboarding-title">Complete Your Profile</h1>

        <div className="onboarding-form">
          {/* College Name */}
          <div className="form-field">
            <label htmlFor="college" className="form-label">
              College *
            </label>
            <input
              type="text"
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g., IIT Dharwad"
              disabled={loading}
              className="form-input"
            />
          </div>

          {/* Batch Year */}
          <div className="form-field">
            <label htmlFor="batch" className="form-label">
              Batch Year *
            </label>
            <input
              type="number"
              id="batch"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              placeholder="e.g., 2024"
              disabled={loading}
              className="form-input"
            />
          </div>

          {/* Gender */}
          <div className="form-field">
            <label htmlFor="gender" className="form-label">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={loading}
              className="form-select"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Contact Number */}
          <div className="form-field">
            <label htmlFor="contactNumber" className="form-label">
              Contact Number *
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength="10"
              disabled={loading}
              className="form-input"
            />
          </div>

          {/* Aadhar or College ID */}
          <div className="form-field">
            <label htmlFor="aadharOrCollegeId" className="form-label">
              Aadhar or College ID *
            </label>
            <input
              type="text"
              id="aadharOrCollegeId"
              name="aadharOrCollegeId"
              value={formData.aadharOrCollegeId}
              onChange={handleChange}
              placeholder="Enter Aadhar number or College ID"
              disabled={loading}
              className="form-input"
            />
          </div>

          {/* Merch Size */}
          <div className="form-field">
            <label htmlFor="merchSize" className="form-label">
              Merch Size *
            </label>
            <select
              id="merchSize"
              name="merchSize"
              value={formData.merchSize}
              onChange={handleChange}
              disabled={loading}
              className="form-select"
            >
              <option value="">Select size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="XXXL">XXXL</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="submit-button"
          >
            {loading ? "✨ Submitting..." : "Complete Onboarding"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
