import React, { useState, useRef, useEffect } from 'react';
import { RiRefreshLine, RiCameraLine, RiStopLine, RiCheckLine, RiCloseLine } from '@remixicon/react';
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
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto p-6 bg-[#232323] rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-white mb-2">Attendance Panel</h2>
        <p className="text-gray-400 mb-4">Scan attendee QR codes to verify and mark their attendance.</p>

        {/* QR Scanner */}
        {status === 'idle' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <button
                onClick={startScanning}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <RiCameraLine size={20} />
                Start QR Scanner
              </button>
            </div>
          </div>
        )}

        {/* Camera View */}
        {status === 'scanning' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-yellow-400">QR Scanner Active</h3>
                <button
                  onClick={stopScanning}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
                >
                  <RiStopLine size={16} />
                  Stop Scanner
                </button>
              </div>
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full max-w-md mx-auto rounded-lg border-2 border-yellow-400"
                  autoPlay
                  playsInline
                />
                <div className="absolute inset-0 border-4 border-yellow-400 rounded-lg pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-yellow-400"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-yellow-400"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-yellow-400"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-yellow-400"></div>
                </div>
              </div>
              <p className="text-center text-gray-300 mt-4">
                Position the QR code within the frame to scan
              </p>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {status === 'loading' && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-yellow-400 border-opacity-50"></div>
            <span className="ml-4 text-yellow-400 font-semibold">Verifying QR Code...</span>
          </div>
        )}

        {/* Attendance Modal */}
        {showModal && attendeeData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#232323] rounded-lg p-6 max-w-md w-full mx-4 border border-gray-600">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Attendee Details</h3>
              
              <div className="space-y-3 mb-6">
                <div className="text-white">
                  <span className="text-gray-400">Name: </span>
                  <span className="font-semibold">{attendeeData.attendee_name}</span>
                </div>
                <div className="text-white">
                  <span className="text-gray-400">Email: </span>
                  <span className="font-semibold">{attendeeData.attendee_email}</span>
                </div>
                <div className="text-white">
                  <span className="text-gray-400">College: </span>
                  <span className="font-semibold">{attendeeData.college_name}</span>
                </div>
                <div className="text-white">
                  <span className="text-gray-400">Pass Type: </span>
                  <span className="font-semibold">{attendeeData.pass_type}</span>
                </div>
                <div className="text-white">
                  <span className="text-gray-400">Price: </span>
                  <span className="font-semibold">₹{attendeeData.pass_price}</span>
                </div>
                <div className="text-white">
                  <span className="text-gray-400">Already Present: </span>
                  <span className={`font-semibold ${attendeeData.is_present ? 'text-green-400' : 'text-red-400'}`}>
                    {attendeeData.is_present ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleMarkAttendance}
                  disabled={markingAttendance || attendeeData.is_present}
                  className={`flex-1 px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                    attendeeData.is_present 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : markingAttendance
                      ? 'bg-yellow-600 text-black cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                  }`}
                >
                  {markingAttendance ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black"></div>
                      Marking...
                    </>
                  ) : attendeeData.is_present ? (
                    <>
                      <RiCheckLine size={16} />
                      Already Present
                    </>
                  ) : (
                    <>
                      <RiCheckLine size={16} />
                      Mark Present
                    </>
                  )}
                </button>
                <button
                  onClick={handleCloseModal}
                  disabled={markingAttendance}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:cursor-not-allowed"
                >
                  <RiCloseLine size={16} />
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Panel Button */}
        <div className="pt-6 flex justify-end">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2"
          >
            <RiRefreshLine size={16} /> Reset Panel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendancePanel;
