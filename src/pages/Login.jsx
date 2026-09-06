import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Utensils,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";

// Import custom CSS file
import "../styles/Login.css";

// Import assets
import logoImage from "../assets/images/logo.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const processedUsername = formData.username.trim();

    if (!processedUsername || !formData.password) {
      alert("Please fill in both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: processedUsername,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message || "Invalid credentials or unauthorized user.");
        setLoading(false);
        return;
      }

      // Save user profile details and JWT token securely
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("username", result.user.username);
      localStorage.setItem("role", result.user.role);
      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      const userRole = result.user.role?.toLowerCase();
      const roleId = result.user.role_id;
      const usernameLower = result.user.username?.toLowerCase() || "";

      // Dedicated Supervisor check (routes to blank/supervisor dashboard)
      if (userRole === "supervisor" || usernameLower.startsWith("supervisor")) {
        navigate("/supervisor-dashboard");
      } else if (roleId === 1 || userRole === "admin" || userRole === "super admin") {
        navigate("/admin-dashboard");
      } else if (roleId === 2 || userRole === "cashier") {
        navigate("/dashboard");
      } else if (roleId === 4 || userRole === "captain") {
        navigate("/captain-dashboard");
      } else {
        alert("Access Denied: You do not have valid dashboard permissions.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Server error. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section - Hero / Branding Panel */}
      <div className="hero-section">
        <div className="hero-bg-overlay" />
        <div className="gold-curved-border" />

        <div className="hero-content">
          <div className="hero-logo-box">
            <img
              src={logoImage}
              alt="Restaurant Logo"
              className="hero-logo-img"
            />
          </div>

          <div className="hero-title-container">
            <h1 className="hero-title-primary">HOTEL / RESTAURANT</h1>
            <h2 className="hero-title-secondary">ERP SYSTEM</h2>
          </div>

          <div className="features-row">
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <Utensils className="feature-icon" />
              </div>
              <span className="feature-label">POS BILLING</span>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <TrendingUp className="feature-icon" />
              </div>
              <span className="feature-label">INVENTORY</span>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <Users className="feature-icon" />
              </div>
              <span className="feature-label">CUSTOMERS</span>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <BarChart3 className="feature-icon" />
              </div>
              <span className="feature-label">REPORTS</span>
            </div>
          </div>

          <div className="hero-tagline-container">
            <p className="hero-tagline">Smart Management,</p>
            <p className="hero-tagline">Better Business!</p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="form-section">
        <div className="form-wrapper">
          <div className="form-card" style={{ padding: "40px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)", background: "#ffffff", width: "100%", maxWidth: "400px", boxSizing: "border-box" }}>
            <div className="form-header-container" style={{ textAlign: "center", marginBottom: "28px" }}>
              <div className="form-logo-box" style={{ width: "65px", height: "65px", margin: "0 auto 12px auto", position: "relative" }}>
                <img
                  src={logoImage}
                  alt="Logo"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>

              <h2 className="form-welcome-title" style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 6px 0" }}>WELCOME BACK!</h2>
              <p className="form-welcome-subtitle" style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                Sign in to continue to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="form-body">
              {/* Username Input Field */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "8px" }}>Username</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span style={{ position: "absolute", left: "14px", color: "#94a3b8", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                    <User size={20} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                    style={{
                      width: "100%",
                      padding: "13px 14px 13px 44px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#f8fafc",
                      boxSizing: "border-box",
                      color: "#0f172a",
                      transition: "all 0.2s ease"
                    }}
                  />
                </div>
              </div>

              {/* Password Input Field */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "8px" }}>Password</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span style={{ position: "absolute", left: "14px", color: "#94a3b8", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                    <Lock size={20} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "13px 44px 13px 44px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#f8fafc",
                      boxSizing: "border-box",
                      color: "#0f172a",
                      transition: "all 0.2s ease"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px"
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: "#d97706",
                  color: "#ffffff",
                  padding: "13px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 10px rgba(217, 119, 6, 0.25)",
                  transition: "background-color 0.2s ease"
                }}
              >
                <LogOut style={{ width: "18px", height: "18px", transform: "rotate(180deg)" }} />
                <span>{loading ? "Authenticating..." : "LOGIN"}</span>
              </button>
            </form>
          </div>
        </div>

        <div className="footer-copyright" style={{ textAlign: "center", fontSize: "12px", color: "#64748b", paddingBottom: "12px" }}>
          © 2026 Hotel / Restaurant ERP System. All rights reserved.
        </div>
      </div>
    </div>
  );
}