import React, { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";

const API_BASE = "https://face-recognition-attendance-system-backend-production.up.railway.app/";

/* ============================================================
   SVG ICON COMPONENTS
   ============================================================ */

const Icons = {
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
  CameraOff: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M21 21H3a2 2 0 01-2-2V9a2 2 0 012-2h3l2.5-3h5L16 7h1" />
      <path d="M14.12 14.12A3 3 0 009.88 9.88" />
    </svg>
  ),
  Scan: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 012-2h2" />
      <path d="M17 3h2a2 2 0 012 2v2" />
      <path d="M21 17v2a2 2 0 01-2 2h-2" />
      <path d="M7 21H5a2 2 0 01-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  ),
  UserPlus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Upload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
    </svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Refresh: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  ),
  ClipboardList: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="16" y2="15" />
    </svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  AlertCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Image: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Save: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Activity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

/* ============================================================
   MAIN APP
   ============================================================ */

function App() {
  // form state
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // attendance state
  const [attendance, setAttendance] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");

  // backend status (known faces)
  const [knownFacesCount, setKnownFacesCount] = useState(0);

  // camera state
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [recognizeLoading, setRecognizeLoading] = useState(false);
  const [lastRecognized, setLastRecognized] = useState("");

  // live clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // load attendance + status on mount
  useEffect(() => {
    loadAttendance();
    loadStatus();
  }, []);

  // Live clock tick
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // ====== API: attendance ======
  const loadAttendance = async () => {
    try {
      setLoadingAttendance(true);
      setAttendanceError("");

      const res = await fetch(`${API_BASE}/api/attendance`);
      if (!res.ok) throw new Error(`Status ${res.status}`);

      const data = await res.json();
      setAttendance(data || []);
    } catch (err) {
      console.error("Error loading attendance:", err);
      setAttendanceError(err.message || "Error loading attendance");
    } finally {
      setLoadingAttendance(false);
    }
  };

  // ====== API: backend status (known faces) ======
  const loadStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/status`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setKnownFacesCount(data.known_faces || 0);
    } catch (err) {
      console.error("Error loading status:", err);
    }
  };

  // ====== API: register face ======
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setUploadError("");
    setUploadSuccess("");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setUploadError("Name is required");
      return;
    }
    if (!file) {
      setUploadError("Please upload a photo");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");
      setUploadSuccess("");

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("photo", file);

      const res = await fetch(`${API_BASE}/api/faces/register`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }

      setUploadSuccess(`${name.trim()} registered successfully!`);
      setName("");
      setFile(null);
      const input = document.getElementById("photo-input");
      if (input) input.value = "";

      // reload attendance + status after new registration
      await loadAttendance();
      await loadStatus();

      // Clear success message after 3s
      setTimeout(() => setUploadSuccess(""), 3000);
    } catch (err) {
      console.error("Error registering face:", err);
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ====== Camera + recognize ======
  const startCamera = async () => {
    if (cameraOn) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraOn(true);
      }
    } catch (err) {
      console.error("Error starting camera:", err);
      alert("Unable to access camera. Check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  const captureAndRecognize = async () => {
    if (!videoRef.current || !cameraOn) {
      alert("Camera is not started.");
      return;
    }

    try {
      setRecognizeLoading(true);
      setLastRecognized("");

      const video = videoRef.current;
      const FRAME_COUNT = 5;
      const INTERVAL_MS = 60;

      const blobs = [];
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");

      for (let i = 0; i < FRAME_COUNT; i++) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // eslint-disable-next-line no-await-in-loop
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );
        blobs.push(blob);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));
      }

      const formData = new FormData();
      blobs.forEach((blob, idx) => {
        formData.append("photos", blob, `frame_${idx}.png`);
      });

      const res = await fetch(`${API_BASE}/api/recognize`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }

      const data = await res.json();
      const names = data.recognized || [];
      const liveness = data.liveness || [];

      if (names.length === 0) {
        setLastRecognized("No face detected");
      } else {
        const parts = names.map((n, idx) => {
          const live = liveness[idx];
          if (live === true) return `${n} (liveness OK)`;
          if (live === false) return `${n} (liveness FAILED)`;
          return n;
        });
        setLastRecognized(parts.join(", "));
      }

      await loadAttendance();
    } catch (err) {
      console.error("Error recognizing:", err);
      alert("Recognition failed: " + (err.message || "unknown error"));
    } finally {
      setRecognizeLoading(false);
    }
  };

  // ====== Export attendance ======
  const handleExport = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/attendance/export`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed: " + (err.message || "unknown error"));
    }
  };

  // Format time for the navbar clock
  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }, []);

  const formatDate = useCallback((date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  // Get today's attendance count
  const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  const todayCount = attendance.filter(r => r.date === todayStr).length;

  return (
    <div className="app-root">
      {/* ===== TOP NAVBAR ===== */}
      <nav className="top-navbar" id="top-navbar">
        <div className="navbar-brand">
          <img
            src="/logo.png"
            alt="FaceID Pro Logo"
            className="navbar-logo"
          />
          <div className="navbar-title">
            <h1>FaceID Pro</h1>
            <span>Smart Attendance System</span>
          </div>
        </div>

        <div className="navbar-status">
          <div className="status-indicator" id="status-faces">
            <div className={`status-dot ${knownFacesCount > 0 ? '' : 'offline'}`} />
            <span>
              <span className="status-count">{knownFacesCount}</span> Registered Faces
            </span>
          </div>
          <div className="navbar-time" id="live-clock">
            <div>{formatDate(currentTime)}</div>
            <div style={{ textAlign: "right", fontWeight: 600, color: "#94a3b8" }}>
              {formatTime(currentTime)}
            </div>
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content">
        {/* --- Metrics Row --- */}
        <div className="metrics-row">
          <div className="metric-card" id="metric-faces">
            <div className="metric-icon blue">
              <Icons.Users />
            </div>
            <div className="metric-info">
              <div className="metric-value">{knownFacesCount}</div>
              <div className="metric-label">Registered Faces</div>
            </div>
          </div>

          <div className="metric-card" id="metric-today">
            <div className="metric-icon teal">
              <Icons.CheckCircle />
            </div>
            <div className="metric-info">
              <div className="metric-value">{todayCount}</div>
              <div className="metric-label">Today's Check-ins</div>
            </div>
          </div>

          <div className="metric-card" id="metric-total">
            <div className="metric-icon violet">
              <Icons.Activity />
            </div>
            <div className="metric-info">
              <div className="metric-value">{attendance.length}</div>
              <div className="metric-label">Total Records</div>
            </div>
          </div>

          <div className="metric-card" id="metric-camera">
            <div className="metric-icon pink">
              <Icons.Shield />
            </div>
            <div className="metric-info">
              <div className="metric-value">{cameraOn ? "Active" : "Off"}</div>
              <div className="metric-label">Camera Status</div>
            </div>
          </div>
        </div>

        {/* --- Main Grid --- */}
        <div className="page-container">
          {/* LEFT: Face Recognition */}
          <section className="card face-card" id="face-recognition-card">
            <header className="card-header">
              <div className="card-title-group">
                <div className="card-icon blue">
                  <Icons.Scan />
                </div>
                <div>
                  <h2>Face Recognition</h2>
                  <div className="card-header-sub">AI-powered identity verification</div>
                </div>
              </div>
              <div className="btn-group">
                <button
                  className="btn-primary"
                  type="button"
                  onClick={startCamera}
                  id="btn-start-camera"
                >
                  <span className="btn-icon"><Icons.Camera /></span>
                  {cameraOn ? "Camera On" : "Start Camera"}
                </button>
                {cameraOn && (
                  <button
                    className="btn-danger"
                    type="button"
                    onClick={stopCamera}
                    id="btn-stop-camera"
                  >
                    <span className="btn-icon"><Icons.CameraOff /></span>
                    Stop
                  </button>
                )}
              </div>
            </header>

            <div className={`camera-area ${cameraOn ? 'active' : ''}`}>
              <div className={`camera-inner ${cameraOn ? 'recording' : ''}`}>
                <video
                  ref={videoRef}
                  className="camera-video"
                  playsInline
                />
                {!cameraOn && (
                  <div className="camera-status">
                    <div className="camera-status-icon">
                      <Icons.Camera />
                    </div>
                    <p className="camera-status-text">Camera is offline</p>
                    <p className="camera-status-sub">
                      Click "Start Camera" to begin face recognition
                    </p>
                  </div>
                )}
              </div>
            </div>

            <footer className="card-footer">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="btn-icon" style={{ width: 16, height: 16, color: "var(--accent-cyan)" }}>
                    <Icons.Users />
                  </span>
                  {knownFacesCount} registered face(s)
                </span>
                <button
                  className="btn-primary"
                  type="button"
                  onClick={captureAndRecognize}
                  disabled={!cameraOn || recognizeLoading}
                  id="btn-recognize"
                >
                  {recognizeLoading ? (
                    <>
                      <span className="spinner" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon"><Icons.Scan /></span>
                      Capture & Recognize
                    </>
                  )}
                </button>
              </div>
              {lastRecognized && (
                <div className="recognize-result">
                  <Icons.CheckCircle />
                  <span>
                    Result: <strong>{lastRecognized}</strong>
                  </span>
                </div>
              )}
            </footer>
          </section>

          {/* RIGHT: Register New Face */}
          <section className="card register-card" id="register-card">
            <header className="card-header">
              <div className="card-title-group">
                <div className="card-icon violet">
                  <Icons.UserPlus />
                </div>
                <div>
                  <h2>Register New Face</h2>
                  <div className="card-header-sub">Add a new person to the system</div>
                </div>
              </div>
            </header>

            <form onSubmit={handleRegisterSubmit} id="register-form">
              <div className="form-group">
                <label className="form-label">
                  <Icons.User />
                  Person Name
                </label>
                <input
                  className="text-input"
                  placeholder="Enter full name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="input-name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Icons.Image />
                  Upload Photo
                </label>
                <label className={`upload-box upload-clickable ${file ? 'has-file' : ''}`}>
                  <input
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <div className="upload-icon-wrapper">
                    <Icons.Upload />
                  </div>
                  <p className="upload-main">
                    {file ? (
                      <>✓ {file.name}</>
                    ) : (
                      <>
                        <span className="highlight">Click to upload</span> a photo
                      </>
                    )}
                  </p>
                  <p className="upload-sub">JPG, PNG — max 5 MB</p>
                </label>
              </div>

              {uploadError && (
                <div className="error-text">
                  <Icons.AlertCircle />
                  {uploadError}
                </div>
              )}

              {uploadSuccess && (
                <div className="success-text">
                  <Icons.CheckCircle />
                  {uploadSuccess}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={uploading}
                style={{ marginTop: 8, width: "100%", justifyContent: "center" }}
                id="btn-register"
              >
                {uploading ? (
                  <>
                    <span className="spinner" />
                    Registering...
                  </>
                ) : (
                  <>
                    <span className="btn-icon"><Icons.Save /></span>
                    Register Face
                  </>
                )}
              </button>
            </form>

            <div className="help-text">
              <Icons.Info />
              Upload a clear, well-lit photo with the person's face fully visible.
              For best results, use a front-facing portrait photo.
            </div>
          </section>
        </div>

        {/* --- Attendance Log --- */}
        <section className="card log-card" id="attendance-log-card">
          <header className="card-header log-header">
            <div className="card-title-group">
              <div className="card-icon teal">
                <Icons.ClipboardList />
              </div>
              <div>
                <h2>Attendance Log</h2>
                <div className="card-header-sub">Real-time check-in records</div>
              </div>
            </div>
            <div className="log-actions">
              <button
                className="btn-secondary"
                onClick={loadAttendance}
                disabled={loadingAttendance}
                id="btn-refresh"
              >
                <span className="btn-icon"><Icons.Refresh /></span>
                {loadingAttendance ? "Loading..." : "Refresh"}
              </button>
              <button
                className="btn-secondary"
                onClick={handleExport}
                id="btn-export"
              >
                <span className="btn-icon"><Icons.Download /></span>
                Export XLSX
              </button>
            </div>
          </header>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="btn-icon" style={{ width: 14, height: 14 }}><Icons.User /></span>
                      Name
                    </span>
                  </th>
                  <th>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="btn-icon" style={{ width: 14, height: 14 }}><Icons.Calendar /></span>
                      Date
                    </span>
                  </th>
                  <th>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="btn-icon" style={{ width: 14, height: 14 }}><Icons.Clock /></span>
                      Check-in Time
                    </span>
                  </th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceError && (
                  <tr className="empty-row">
                    <td colSpan={4}>{attendanceError}</td>
                  </tr>
                )}

                {!attendanceError && attendance.length === 0 && (
                  <tr className="empty-row">
                    <td colSpan={4}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <span className="btn-icon" style={{ width: 32, height: 32, color: "var(--text-muted)", opacity: 0.5 }}>
                          <Icons.ClipboardList />
                        </span>
                        No attendance records yet
                      </div>
                    </td>
                  </tr>
                )}

                {!attendanceError &&
                  attendance.map((row, idx) => (
                    <tr key={idx} style={{ animationDelay: `${idx * 0.03}s` }}>
                      <td>{row.name}</td>
                      <td>{row.date}</td>
                      <td>{row.time}</td>
                      <td>
                        <span className="status-badge present">
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                          Present
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <footer className="card-footer">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Total Records: <strong style={{ color: "var(--text-primary)" }}>{attendance.length}</strong></span>
              <span>Today: <strong style={{ color: "var(--accent-teal)" }}>{todayCount} check-in(s)</strong></span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;