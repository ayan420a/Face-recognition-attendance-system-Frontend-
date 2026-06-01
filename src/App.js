import React, { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";

const API_BASE = (process.env.REACT_APP_API_BASE || "https://face-recognition-attendance-system-backend-production-cabd.up.railway.app").replace(/\/+$/, "");

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
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  LogOut: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  XCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

/* ============================================================
   AUTH SCREEN COMPONENT
   ============================================================ */

function AuthScreen({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }
    if (isSignup && !fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    try {
      setLoading(true);
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const body = isSignup
        ? { username: username.trim(), password, fullName: fullName.trim() }
        : { username: username.trim(), password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || `Error ${res.status}`);
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("fullName", data.fullName);
      onLogin(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-ambient-1" />
      <div className="auth-ambient-2" />

      <div className="auth-container">
        <div className="auth-header">
          <img src="/logo.png" alt="FaceID Pro" className="auth-logo" />
          <h1 className="auth-title">FaceID Pro</h1>
          <p className="auth-subtitle">Smart Attendance System</p>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${!isSignup ? "active" : ""}`}
              onClick={() => { setIsSignup(false); setError(""); }}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${isSignup ? "active" : ""}`}
              onClick={() => { setIsSignup(true); setError(""); }}
              type="button"
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {isSignup && (
              <div className="auth-field">
                <label className="auth-label">
                  <Icons.User /> Full Name
                </label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">
                <Icons.Mail /> Username
              </label>
              <input
                type="text"
                className="auth-input"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">
                <Icons.Lock /> Password
              </label>
              <input
                type="password"
                className="auth-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
            </div>

            {error && (
              <div className="auth-error">
                <Icons.AlertCircle />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  {isSignup ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                <>
                  <span className="btn-icon"><Icons.Shield /></span>
                  {isSignup ? "Create Account" : "Sign In"}
                </>
              )}
            </button>
          </form>
        </div>

        <p className="auth-footer-text">
          Secured with face recognition & liveness detection
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN APP (Dashboard)
   ============================================================ */

function Dashboard({ user, onLogout }) {
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

  // backend status
  const [knownFacesCount, setKnownFacesCount] = useState(0);

  // camera state
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [recognizeLoading, setRecognizeLoading] = useState(false);
  const [lastRecognized, setLastRecognized] = useState("");

  // live clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // admin panel
  const [showAdmin, setShowAdmin] = useState(false);
  const [registeredFaces, setRegisteredFaces] = useState([]);
  const [loadingFaces, setLoadingFaces] = useState(false);
  const [adminMsg, setAdminMsg] = useState("");

  // confirm dialogs
  const [confirmAction, setConfirmAction] = useState(null);

  const token = localStorage.getItem("token");

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${token}`,
  }), [token]);

  useEffect(() => {
    loadAttendance();
    loadStatus();
  }, []);

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
      setAttendanceError(err.message || "Error loading attendance");
    } finally {
      setLoadingAttendance(false);
    }
  };

  // ====== API: status ======
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
    if (!name.trim()) { setUploadError("Name is required"); return; }
    if (!file) { setUploadError("Please upload a photo"); return; }

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
      await loadAttendance();
      await loadStatus();
      setTimeout(() => setUploadSuccess(""), 3000);
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ====== Camera ======
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
      alert("Unable to access camera. Check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  const captureAndRecognize = async () => {
    if (!videoRef.current || !cameraOn) { alert("Camera is not started."); return; }

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
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );
        blobs.push(blob);
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
      if (!res.ok) throw new Error(await res.text() || `Status ${res.status}`);

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
      alert("Recognition failed: " + (err.message || "unknown error"));
    } finally {
      setRecognizeLoading(false);
    }
  };

  // ====== Export ======
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
      alert("Export failed: " + (err.message || "unknown error"));
    }
  };

  // ====== Admin: Delete attendance row ======
  const deleteAttendanceRow = async (index) => {
    try {
      const res = await fetch(`${API_BASE}/api/attendance/${index}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error((await res.json()).detail || `Status ${res.status}`);
      setAdminMsg("Record deleted successfully");
      setTimeout(() => setAdminMsg(""), 2000);
      await loadAttendance();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  // ====== Admin: Clear all attendance ======
  const clearAllAttendance = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/attendance`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error((await res.json()).detail || `Status ${res.status}`);
      setAdminMsg("All records cleared");
      setTimeout(() => setAdminMsg(""), 2000);
      await loadAttendance();
    } catch (err) {
      alert("Clear failed: " + err.message);
    }
    setConfirmAction(null);
  };

  // ====== Admin: Load registered faces ======
  const loadRegisteredFaces = async () => {
    try {
      setLoadingFaces(true);
      const res = await fetch(`${API_BASE}/api/faces/list`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setRegisteredFaces(data || []);
    } catch (err) {
      console.error("Error loading faces:", err);
    } finally {
      setLoadingFaces(false);
    }
  };

  // ====== Admin: Delete face ======
  const deleteFace = async (faceName) => {
    try {
      const res = await fetch(`${API_BASE}/api/faces/${encodeURIComponent(faceName)}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error((await res.json()).detail || `Status ${res.status}`);
      setAdminMsg(`${faceName} removed`);
      setTimeout(() => setAdminMsg(""), 2000);
      await loadRegisteredFaces();
      await loadStatus();
    } catch (err) {
      alert("Delete face failed: " + err.message);
    }
  };

  // Open admin panel
  const toggleAdmin = () => {
    const next = !showAdmin;
    setShowAdmin(next);
    if (next) loadRegisteredFaces();
  };

  // Helpers
  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
    });
  }, []);

  const formatDate = useCallback((date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
  }, []);

  const todayStr = new Date().toLocaleDateString("en-CA");
  const todayCount = attendance.filter(r => r.date === todayStr).length;

  return (
    <div className="app-root">
      {/* ===== CONFIRM DIALOG ===== */}
      {confirmAction && (
        <div className="confirm-overlay" onClick={() => setConfirmAction(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <Icons.AlertCircle />
            </div>
            <h3>{confirmAction.title}</h3>
            <p>{confirmAction.message}</p>
            <div className="confirm-buttons">
              <button className="btn-secondary" onClick={() => setConfirmAction(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmAction.onConfirm}>
                <span className="btn-icon"><Icons.Trash /></span>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TOP NAVBAR ===== */}
      <nav className="top-navbar" id="top-navbar">
        <div className="navbar-brand">
          <img src="/logo.png" alt="FaceID Pro Logo" className="navbar-logo" />
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

          {/* Admin & Logout */}
          <button
            className={`btn-secondary navbar-admin-btn ${showAdmin ? 'active-admin' : ''}`}
            onClick={toggleAdmin}
            title="Admin Panel"
          >
            <span className="btn-icon"><Icons.Settings /></span>
            Admin
          </button>
          <button className="btn-secondary navbar-user-btn" onClick={onLogout} title="Logout">
            <span className="btn-icon"><Icons.LogOut /></span>
            <span className="navbar-username">{user?.fullName || user?.username}</span>
          </button>
        </div>
      </nav>

      {/* ===== ADMIN PANEL (Slide-down) ===== */}
      {showAdmin && (
        <div className="admin-panel">
          <div className="admin-panel-inner">
            <header className="admin-header">
              <div className="card-title-group">
                <div className="card-icon violet">
                  <Icons.Settings />
                </div>
                <div>
                  <h2>Admin Panel</h2>
                  <div className="card-header-sub">Manage attendance records & registered faces</div>
                </div>
              </div>
              <button className="btn-secondary" onClick={toggleAdmin}>
                <span className="btn-icon"><Icons.XCircle /></span>
                Close
              </button>
            </header>

            {adminMsg && (
              <div className="admin-msg">
                <Icons.CheckCircle />
                {adminMsg}
              </div>
            )}

            <div className="admin-grid">
              {/* Attendance Management */}
              <div className="admin-section">
                <h3 className="admin-section-title">
                  <span className="btn-icon" style={{ width: 18, height: 18, color: "var(--accent-teal)" }}><Icons.ClipboardList /></span>
                  Attendance Records ({attendance.length})
                </h3>
                <div className="admin-actions">
                  <button
                    className="btn-danger"
                    onClick={() => setConfirmAction({
                      title: "Clear All Records",
                      message: "This will permanently delete ALL attendance records. This action cannot be undone.",
                      onConfirm: clearAllAttendance,
                    })}
                    disabled={attendance.length === 0}
                  >
                    <span className="btn-icon"><Icons.Trash /></span>
                    Clear All Records
                  </button>
                </div>
                <div className="admin-table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.length === 0 && (
                        <tr className="empty-row">
                          <td colSpan={5}>No records</td>
                        </tr>
                      )}
                      {attendance.map((row, idx) => (
                        <tr key={idx}>
                          <td style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
                          <td>{row.name}</td>
                          <td>{row.date}</td>
                          <td>{row.time}</td>
                          <td>
                            <button
                              className="btn-icon-only danger"
                              onClick={() => deleteAttendanceRow(idx)}
                              title="Delete this record"
                            >
                              <Icons.Trash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Registered Faces */}
              <div className="admin-section">
                <h3 className="admin-section-title">
                  <span className="btn-icon" style={{ width: 18, height: 18, color: "var(--accent-blue)" }}><Icons.Users /></span>
                  Registered Faces ({registeredFaces.length})
                </h3>
                <div className="admin-actions">
                  <button className="btn-secondary" onClick={loadRegisteredFaces} disabled={loadingFaces}>
                    <span className="btn-icon"><Icons.Refresh /></span>
                    {loadingFaces ? "Loading..." : "Refresh"}
                  </button>
                </div>
                <div className="admin-faces-list">
                  {registeredFaces.length === 0 && (
                    <div className="admin-empty">No registered faces yet</div>
                  )}
                  {registeredFaces.map((face, idx) => (
                    <div className="admin-face-item" key={idx}>
                      <div className="admin-face-info">
                        <div className="admin-face-avatar">
                          <Icons.User />
                        </div>
                        <div>
                          <div className="admin-face-name">{face.name}</div>
                          <div className="admin-face-file">{face.filename}</div>
                        </div>
                      </div>
                      <button
                        className="btn-icon-only danger"
                        onClick={() => setConfirmAction({
                          title: `Remove ${face.name}?`,
                          message: `This will delete the registered face photo for "${face.name}". They will no longer be recognized.`,
                          onConfirm: () => { deleteFace(face.name); setConfirmAction(null); },
                        })}
                        title="Remove face"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content">
        {/* Metrics */}
        <div className="metrics-row">
          <div className="metric-card" id="metric-faces">
            <div className="metric-icon blue"><Icons.Users /></div>
            <div className="metric-info">
              <div className="metric-value">{knownFacesCount}</div>
              <div className="metric-label">Registered Faces</div>
            </div>
          </div>
          <div className="metric-card" id="metric-today">
            <div className="metric-icon teal"><Icons.CheckCircle /></div>
            <div className="metric-info">
              <div className="metric-value">{todayCount}</div>
              <div className="metric-label">Today's Check-ins</div>
            </div>
          </div>
          <div className="metric-card" id="metric-total">
            <div className="metric-icon violet"><Icons.Activity /></div>
            <div className="metric-info">
              <div className="metric-value">{attendance.length}</div>
              <div className="metric-label">Total Records</div>
            </div>
          </div>
          <div className="metric-card" id="metric-camera">
            <div className="metric-icon pink"><Icons.Shield /></div>
            <div className="metric-info">
              <div className="metric-value">{cameraOn ? "Active" : "Off"}</div>
              <div className="metric-label">Camera Status</div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="page-container">
          {/* Face Recognition */}
          <section className="card face-card" id="face-recognition-card">
            <header className="card-header">
              <div className="card-title-group">
                <div className="card-icon blue"><Icons.Scan /></div>
                <div>
                  <h2>Face Recognition</h2>
                  <div className="card-header-sub">AI-powered identity verification</div>
                </div>
              </div>
              <div className="btn-group">
                <button className="btn-primary" type="button" onClick={startCamera} id="btn-start-camera">
                  <span className="btn-icon"><Icons.Camera /></span>
                  {cameraOn ? "Camera On" : "Start Camera"}
                </button>
                {cameraOn && (
                  <button className="btn-danger" type="button" onClick={stopCamera} id="btn-stop-camera">
                    <span className="btn-icon"><Icons.CameraOff /></span>
                    Stop
                  </button>
                )}
              </div>
            </header>

            <div className={`camera-area ${cameraOn ? 'active' : ''}`}>
              <div className={`camera-inner ${cameraOn ? 'recording' : ''}`}>
                <video ref={videoRef} className="camera-video" playsInline />
                {!cameraOn && (
                  <div className="camera-status">
                    <div className="camera-status-icon"><Icons.Camera /></div>
                    <p className="camera-status-text">Camera is offline</p>
                    <p className="camera-status-sub">Click "Start Camera" to begin face recognition</p>
                  </div>
                )}
              </div>
            </div>

            <footer className="card-footer">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="btn-icon" style={{ width: 16, height: 16, color: "var(--accent-cyan)" }}><Icons.Users /></span>
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
                    <><span className="spinner" /> Scanning...</>
                  ) : (
                    <><span className="btn-icon"><Icons.Scan /></span> Capture & Recognize</>
                  )}
                </button>
              </div>
              {lastRecognized && (
                <div className="recognize-result">
                  <Icons.CheckCircle />
                  <span>Result: <strong>{lastRecognized}</strong></span>
                </div>
              )}
            </footer>
          </section>

          {/* Register New Face */}
          <section className="card register-card" id="register-card">
            <header className="card-header">
              <div className="card-title-group">
                <div className="card-icon violet"><Icons.UserPlus /></div>
                <div>
                  <h2>Register New Face</h2>
                  <div className="card-header-sub">Add a new person to the system</div>
                </div>
              </div>
            </header>

            <form onSubmit={handleRegisterSubmit} id="register-form">
              <div className="form-group">
                <label className="form-label"><Icons.User /> Person Name</label>
                <input className="text-input" placeholder="Enter full name..." value={name} onChange={(e) => setName(e.target.value)} id="input-name" />
              </div>

              <div className="form-group">
                <label className="form-label"><Icons.Image /> Upload Photo</label>
                <label className={`upload-box upload-clickable ${file ? 'has-file' : ''}`}>
                  <input id="photo-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                  <div className="upload-icon-wrapper"><Icons.Upload /></div>
                  <p className="upload-main">
                    {file ? (<>✓ {file.name}</>) : (<><span className="highlight">Click to upload</span> a photo</>)}
                  </p>
                  <p className="upload-sub">JPG, PNG — max 5 MB</p>
                </label>
              </div>

              {uploadError && (<div className="error-text"><Icons.AlertCircle />{uploadError}</div>)}
              {uploadSuccess && (<div className="success-text"><Icons.CheckCircle />{uploadSuccess}</div>)}

              <button type="submit" className="btn-primary" disabled={uploading} style={{ marginTop: 8, width: "100%", justifyContent: "center" }} id="btn-register">
                {uploading ? (<><span className="spinner" /> Registering...</>) : (<><span className="btn-icon"><Icons.Save /></span> Register Face</>)}
              </button>
            </form>

            <div className="help-text">
              <Icons.Info /> Upload a clear, well-lit photo with the person's face fully visible. For best results, use a front-facing portrait photo.
            </div>
          </section>
        </div>

        {/* Attendance Log */}
        <section className="card log-card" id="attendance-log-card">
          <header className="card-header log-header">
            <div className="card-title-group">
              <div className="card-icon teal"><Icons.ClipboardList /></div>
              <div>
                <h2>Attendance Log</h2>
                <div className="card-header-sub">Real-time check-in records</div>
              </div>
            </div>
            <div className="log-actions">
              <button className="btn-secondary" onClick={loadAttendance} disabled={loadingAttendance} id="btn-refresh">
                <span className="btn-icon"><Icons.Refresh /></span>
                {loadingAttendance ? "Loading..." : "Refresh"}
              </button>
              <button className="btn-secondary" onClick={handleExport} id="btn-export">
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
                      <span className="btn-icon" style={{ width: 14, height: 14 }}><Icons.User /></span> Name
                    </span>
                  </th>
                  <th>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="btn-icon" style={{ width: 14, height: 14 }}><Icons.Calendar /></span> Date
                    </span>
                  </th>
                  <th>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="btn-icon" style={{ width: 14, height: 14 }}><Icons.Clock /></span> Check-in Time
                    </span>
                  </th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceError && (
                  <tr className="empty-row"><td colSpan={4}>{attendanceError}</td></tr>
                )}
                {!attendanceError && attendance.length === 0 && (
                  <tr className="empty-row">
                    <td colSpan={4}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <span className="btn-icon" style={{ width: 32, height: 32, color: "var(--text-muted)", opacity: 0.5 }}><Icons.ClipboardList /></span>
                        No attendance records yet
                      </div>
                    </td>
                  </tr>
                )}
                {!attendanceError && attendance.map((row, idx) => (
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

<<<<<<< HEAD
export default App;
=======
/* ============================================================
   ROOT APP — Handles auth state
   ============================================================ */

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("fullName");
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  const handleLogin = (data) => {
    setUser({ username: data.username, fullName: data.fullName });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    setUser(null);
  };

  if (checking) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-large" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
>>>>>>> 37e5345 (feat: use REACT_APP_API_BASE env var for backend URL)
