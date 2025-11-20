import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  
  // Get token passed from Auth page via navigate state
  const token = location.state?.token;
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

      // Prepare the request body (convert batch to number)
      const requestBody = {
        ...formData,
        batch: parseInt(formData.batch),
      };

      // Make the POST request
      const response = await fetch("/api/parsec/v1/onboarding", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include', // include httpOnly cookie as well
        body: JSON.stringify(requestBody),
      });

      // Parse the JSON response
      const data = await response.json();

      // Check if request was successful
      if (!response.ok) {
        // Handle HTTP errors (4xx, 5xx)
        throw new Error(data.message || "Onboarding failed. Please try again.");
      }

      // ========== SUCCESS ==========
      setSuccess(true);
      console.log("Onboarding successful:", data);

      // Redirect to dashboard after brief delay
      setTimeout(() => {
        navigate('/dashboard');
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
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <h2 style={{ color: "#28a745", marginBottom: "12px" }}>
          ✅ Onboarding Complete!
        </h2>
        <p>Your profile has been successfully set up.</p>
      </div>
    );
  }

  // ========== FORM VIEW ==========
  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "24px" }}>Complete Your Profile</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* College Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="college" style={{ fontWeight: 500 }}>
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
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: loading ? "#f5f5f5" : "white",
              cursor: loading ? "not-allowed" : "text",
            }}
          />
        </div>

        {/* Batch Year */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="batch" style={{ fontWeight: 500 }}>
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
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: loading ? "#f5f5f5" : "white",
              cursor: loading ? "not-allowed" : "text",
            }}
          />
        </div>

        {/* Gender */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="gender" style={{ fontWeight: 500 }}>
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={loading}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: loading ? "#f5f5f5" : "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Contact Number */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="contactNumber" style={{ fontWeight: 500 }}>
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
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: loading ? "#f5f5f5" : "white",
              cursor: loading ? "not-allowed" : "text",
            }}
          />
        </div>

        {/* Aadhar or College ID */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="aadharOrCollegeId" style={{ fontWeight: 500 }}>
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
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: loading ? "#f5f5f5" : "white",
              cursor: loading ? "not-allowed" : "text",
            }}
          />
        </div>

        {/* Merch Size */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="merchSize" style={{ fontWeight: 500 }}>
            Merch Size *
          </label>
          <select
            id="merchSize"
            name="merchSize"
            value={formData.merchSize}
            onChange={handleChange}
            disabled={loading}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: loading ? "#f5f5f5" : "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
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
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fee",
              color: "#c00",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "12px 24px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "8px",
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.backgroundColor = "#0056b3";
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.backgroundColor = "#007bff";
          }}
        >
          {loading ? "Submitting..." : "Complete Onboarding"}
        </button>
      </div>
    </div>
  );
};

export default OnboardingForm;
