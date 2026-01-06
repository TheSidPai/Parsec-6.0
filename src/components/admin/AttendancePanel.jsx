import React, { useState, useRef, useEffect } from 'react';
import { RiRefreshLine, RiCameraLine, RiStopLine, RiCheckLine, RiCloseLine, RiQrScanLine } from '@remixicon/react';
import { BrowserMultiFormatReader } from '@zxing/library';
import axios from 'axios';
import './AdminComponents.css';

function AttendancePanel() {
  const [status, setStatus] = useState('idle'); // idle, scanning, loading, verified
  const [attendeeData, setAttendeeData] = useState(null);
  const [qrContent, setQrContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    
    // Cleanup on unmount
    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, []);

  // Start QR scanning
  const startScanning = async () => {
    try {
      setStatus('scanning');
      
      const videoInputDevices = await codeReader.current.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        alert('No camera found. Please ensure you have a camera connected.');
        setStatus('idle');
        return;
      }

      // Use the first available camera
      const selectedDeviceId = videoInputDevices[0].deviceId;
      
      const result = await codeReader.current.decodeOnceFromVideoDevice(selectedDeviceId, videoRef.current);
      
      if (result) {
        stopScanning();
        handleQRResult(result.text);
      }
    } catch (error) {
      console.error('Error starting scanner:', error);
      alert('Error accessing camera. Please check permissions.');
      setStatus('idle');
    }
  };

  // Stop QR scanning
  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    if (status === 'scanning') {
      setStatus('idle');
    }
  };

  // Handle QR scan result
  const handleQRResult = async (qrText) => {
    setStatus('loading');
    
    try {
      const response = await axios.post('https://iic.iitdh.ac.in/api/attendance/verify-qr', {
        qr_content: qrText
      });

      if (response.data.status === 'success') {
        setAttendeeData(response.data.data);
        setQrContent(qrText);
        setShowModal(true);
        setStatus('verified');
      } else {
        alert('Not a valid QR code');
        setStatus('idle');
      }
    } catch (error) {
      console.error('Error verifying QR:', error);
      alert('Not a valid QR code');
      setStatus('idle');
    }
  };

  // Mark attendance
  const handleMarkAttendance = async () => {
    setMarkingAttendance(true);
    
    try {
      const response = await axios.post('https://iic.iitdh.ac.in/api/attendance/mark', {
        qr_content: qrContent
      });

      if (response.data.status === 'success') {
        alert(`Attendance Marked Successfully!\n\nName: ${response.data.data.attendee_name}\nEmail: ${response.data.data.attendee_email}\nMarked At: ${new Date(response.data.data.attended_at).toLocaleString()}`);
        handleCloseModal();
      } else {
        alert(response.data.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert(error.response?.data?.message || 'Failed to mark attendance');
    }
    
    setMarkingAttendance(false);
  };

  // Close modal and reset
  const handleCloseModal = () => {
    setShowModal(false);
    setAttendeeData(null);
    setQrContent('');
    setStatus('idle');
  };

  // Reset panel
  const handleReset = () => {
    handleCloseModal();
    stopScanning();
  };

  return (
    <div className="admin-section-container">
      <div className="admin-section-title-wrapper">
        <div className="admin-section-icon">
          <RiQrScanLine size={32} />
        </div>
        <h2 className="admin-section-main-title">Attendance Panel</h2>
        <p className="admin-section-subtitle">Scan attendee QR codes to verify and mark their attendance</p>
      </div>

      <div className="admin-content-card admin-attendance-container">
        {/* QR Scanner */}
        {status === 'idle' && (
          <div className="admin-scanner-box">
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{ color: '#FFD700', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ready to Scan</h3>
              <p style={{ color: '#aaa' }}>Click the button below to start scanning QR codes</p>
            </div>
            <button
              onClick={startScanning}
              className="admin-btn admin-btn-primary"
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
            >
              <RiCameraLine size={24} />
              Start QR Scanner
            </button>
          </div>
        )}

        {/* Camera View */}
        {status === 'scanning' && (
          <div className="admin-scanner-box">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-yellow-400">🔍 Scanner Active</h3>
              <button
                onClick={stopScanning}
                className="admin-btn admin-btn-danger"
              >
                <RiStopLine size={16} />
                Stop Scanner
              </button>
            </div>
            <div className="admin-scanner-video-wrapper">
              <video
                ref={videoRef}
                className="admin-scanner-video"
                autoPlay
                playsInline
              />
              <div className="admin-scanner-overlay">
                <div className="admin-scanner-corner top-left"></div>
                <div className="admin-scanner-corner top-right"></div>
                <div className="admin-scanner-corner bottom-left"></div>
                <div className="admin-scanner-corner bottom-right"></div>
              </div>
            </div>
            <p style={{ textAlign: 'center', color: '#ccc', marginTop: '1.5rem', fontSize: '1rem' }}>
              📷 Position the QR code within the frame to scan
            </p>
          </div>
        )}

        {/* Loading Spinner */}
        {status === 'loading' && (
          <div className="admin-scanner-box">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400 border-opacity-50"></div>
            </div>
            <p style={{ textAlign: 'center', color: '#FFD700', fontWeight: '600', fontSize: '1.1rem', marginTop: '1rem' }}>
              ⏳ Verifying QR Code...
            </p>
          </div>
        )}

        {/* Attendance Modal */}
        {showModal && attendeeData && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="admin-attendee-modal max-w-lg w-full">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <span>👤</span> Attendee Details
              </h3>
              
              <div className="admin-attendee-details">
                <div className="admin-attendee-row">
                  <span className="admin-attendee-label">Name:</span>
                  <span className="admin-attendee-value">{attendeeData.attendee_name}</span>
                </div>
                <div className="admin-attendee-row">
                  <span className="admin-attendee-label">Email:</span>
                  <span className="admin-attendee-value">{attendeeData.attendee_email}</span>
                </div>
                <div className="admin-attendee-row">
                  <span className="admin-attendee-label">College:</span>
                  <span className="admin-attendee-value">{attendeeData.college_name}</span>
                </div>
                <div className="admin-attendee-row">
                  <span className="admin-attendee-label">Pass Type:</span>
                  <span className="admin-attendee-value">{attendeeData.pass_type}</span>
                </div>
                <div className="admin-attendee-row">
                  <span className="admin-attendee-label">Price:</span>
                  <span className="admin-attendee-value" style={{ fontSize: '1.2rem', color: '#FFD700' }}>₹{attendeeData.pass_price}</span>
                </div>
                <div className="admin-attendee-row">
                  <span className="admin-attendee-label">Status:</span>
                  <span className={`admin-attendee-value ${attendeeData.is_present ? 'text-green-400' : 'text-red-400'}`}>
                    {attendeeData.is_present ? '✅ Already Present' : '❌ Not Marked'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleMarkAttendance}
                  disabled={markingAttendance || attendeeData.is_present}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                    attendeeData.is_present 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : markingAttendance
                      ? 'bg-yellow-600 text-black cursor-not-allowed'
                      : 'admin-btn admin-btn-success'
                  }`}
                >
                  {markingAttendance ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black"></div>
                      Marking...
                    </>
                  ) : attendeeData.is_present ? (
                    <>
                      <RiCheckLine size={20} />
                      Already Present
                    </>
                  ) : (
                    <>
                      <RiCheckLine size={20} />
                      Mark Present
                    </>
                  )}
                </button>
                <button
                  onClick={handleCloseModal}
                  disabled={markingAttendance}
                  className="admin-btn admin-btn-secondary px-4 py-3"
                >
                  <RiCloseLine size={20} />
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Panel Button */}
        {status !== 'idle' && !showModal && (
          <div className="pt-6 flex justify-center">
            <button
              onClick={handleReset}
              className="admin-btn admin-btn-secondary"
            >
              <RiRefreshLine size={18} /> Reset Panel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendancePanel;
