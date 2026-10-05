import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function Profile() {
  const { language } = useLanguage();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();
        const userObj = data.user || data;

        setProfile(userObj);
        setFormData({
          username: userObj.username || userObj.name || "",
          email: userObj.email || "",
          password: "",
        });
      } catch (err) {
        console.error("Profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError(
        language === "Hindi"
          ? "कृपया पहले लॉगिन करें।"
          : "Please login first."
      );
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setMessage("");

      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
      };

      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedUser = data.user || profile;
      setProfile(updatedUser);
      setFormData({
        username: updatedUser.username || "",
        email: updatedUser.email || "",
        password: "",
      });

      if (updatedUser.username) {
        localStorage.setItem("userName", updatedUser.username);
        window.dispatchEvent(new Event("userUpdated"));
      }

      setMessage(
        language === "Hindi"
          ? "प्रोफाइल सफलतापूर्वक अपडेट हो गई!"
          : "Profile updated successfully!"
      );
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(
        err.message ||
          (language === "Hindi"
            ? "प्रोफाइल अपडेट नहीं हो सकी।"
            : "Could not update profile.")
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h1>
            {language === "Hindi"
              ? "प्रोफाइल लोड हो रही है..."
              : "Loading Profile..."}
          </h1>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="profile-page">
        <div
          className="profile-card"
          style={{
            maxWidth: "500px",
            margin: "80px auto",
            textAlign: "center",
            padding: "40px 30px",
            background: "#fffdf9",
            border: "1px solid #e2d6c7",
          }}
        >
          <h1>
            {language === "Hindi"
              ? "कृपया लॉगिन करें"
              : "Please Login"}
          </h1>
          <p style={{ margin: "14px 0 24px", color: "#776d64" }}>
            {language === "Hindi"
              ? "अपनी प्रोफाइल देखने के लिए लॉगिन करें।"
              : "Please sign in to view your profile details."}
          </p>
          <Link
            to="/login"
            style={{
              display: "inline-block",
              background: "#211e1b",
              color: "#fffdf9",
              padding: "12px 24px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "1px",
            }}
          >
            {language === "Hindi"
              ? "लॉगिन करें →"
              : "LOGIN →"}
          </Link>
        </div>
      </main>
    );
  }

  const displayName = profile.username || profile.name || "User";

  return (
    <main
      className="profile-page"
      style={{
        minHeight: "85vh",
        background: "#f6f1e9",
        padding: "40px 5% 80px",
        color: "#211e1b",
      }}
    >
      <section
        className="profile-header"
        style={{
          maxWidth: "700px",
          margin: "0 auto 30px",
          textAlign: "center",
        }}
      >
        <p
          className="section-label"
          style={{
            color: "#8a6245",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "2px",
            marginBottom: "8px",
          }}
        >
          SHOPSPHERE
        </p>

        <h1
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: "clamp(30px, 4vw, 44px)",
            margin: "0 0 10px",
            fontWeight: 600,
          }}
        >
          {language === "Hindi"
            ? "मेरी प्रोफाइल"
            : "My Profile"}
        </h1>

        <p style={{ color: "#776d64", fontSize: "13px", margin: 0 }}>
          {language === "Hindi"
            ? "अपनी अकाउंट जानकारी देखें और अपडेट करें।"
            : "View and update your personal account information."}
        </p>
      </section>

      <section
        className="profile-card"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#fffdf9",
          border: "1px solid #e2d6c7",
          padding: "36px 32px",
        }}
      >
        {/* AVATAR & HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            borderBottom: "1px solid #eee7de",
            paddingBottom: "24px",
            marginBottom: "24px",
          }}
        >
          <div
            className="profile-avatar"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#211e1b",
              color: "#fffdf9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 700,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontFamily: '"Playfair Display", serif',
              }}
            >
              {displayName}
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                color: "#8a6245",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: 700,
              }}
            >
              {profile.role || "user"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsEditing(!isEditing);
              setError("");
              setMessage("");
            }}
            style={{
              background: isEditing ? "#eee7de" : "#211e1b",
              color: isEditing ? "#211e1b" : "#fffdf9",
              border: "none",
              padding: "10px 16px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "1px",
              cursor: "pointer",
            }}
          >
            {isEditing
              ? language === "Hindi"
                ? "कैंसल"
                : "CANCEL"
              : language === "Hindi"
              ? "एडिट प्रोफाइल"
              : "EDIT PROFILE"}
          </button>
        </div>

        {/* FEEDBACK MESSAGES */}
        {message && (
          <p
            style={{
              padding: "10px 14px",
              background: "#edf4ea",
              color: "#3f6834",
              border: "1px solid #c9e0c1",
              fontSize: "12px",
              marginBottom: "18px",
            }}
          >
            {message}
          </p>
        )}

        {error && (
          <p
            style={{
              padding: "10px 14px",
              background: "#fcedeb",
              color: "#a64b3c",
              border: "1px solid #f4c7c3",
              fontSize: "12px",
              marginBottom: "18px",
            }}
          >
            {error}
          </p>
        )}

        {/* VIEW DETAILS */}
        {!isEditing ? (
          <div
            className="profile-info"
            style={{ display: "grid", gap: "16px", marginBottom: "30px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: "#faf7f2",
                border: "1px solid #f0e7dd",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "#8a6245",
                  fontWeight: 700,
                  letterSpacing: "1px",
                }}
              >
                {language === "Hindi" ? "यूज़रनेम" : "USERNAME"}
              </span>
              <strong style={{ fontSize: "13px" }}>
                {profile.username || profile.name || "—"}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: "#faf7f2",
                border: "1px solid #f0e7dd",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "#8a6245",
                  fontWeight: 700,
                  letterSpacing: "1px",
                }}
              >
                {language === "Hindi" ? "ईमेल" : "EMAIL"}
              </span>
              <strong style={{ fontSize: "13px" }}>
                {profile.email || "—"}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: "#faf7f2",
                border: "1px solid #f0e7dd",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "#8a6245",
                  fontWeight: 700,
                  letterSpacing: "1px",
                }}
              >
                {language === "Hindi" ? "रोल" : "ROLE"}
              </span>
              <strong
                style={{
                  fontSize: "13px",
                  textTransform: "capitalize",
                }}
              >
                {profile.role || "user"}
              </strong>
            </div>
          </div>
        ) : (
          /* EDIT FORM */
          <form onSubmit={handleUpdate} style={{ marginBottom: "30px" }}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#8a6245",
                  marginBottom: "6px",
                }}
              >
                {language === "Hindi" ? "यूज़रनेम" : "USERNAME"}
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #d8cbbb",
                  background: "#fff",
                  fontSize: "12px",
                  color: "#211e1b",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#8a6245",
                  marginBottom: "6px",
                }}
              >
                {language === "Hindi" ? "ईमेल" : "EMAIL"}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #d8cbbb",
                  background: "#fff",
                  fontSize: "12px",
                  color: "#211e1b",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#8a6245",
                  marginBottom: "6px",
                }}
              >
                {language === "Hindi"
                  ? "नया पासवर्ड (बदलने के लिए भरें)"
                  : "NEW PASSWORD (LEAVE BLANK TO KEEP)"}
              </label>
              <input
                type="password"
                placeholder={
                  language === "Hindi"
                    ? "नया पासवर्ड (वैकल्पिक)"
                    : "Enter new password (optional)"
                }
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #d8cbbb",
                  background: "#fff",
                  fontSize: "12px",
                  color: "#211e1b",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              style={{
                width: "100%",
                padding: "12px",
                background: "#211e1b",
                color: "#fffdf9",
                border: "none",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1px",
                cursor: updating ? "wait" : "pointer",
              }}
            >
              {updating
                ? language === "Hindi"
                  ? "अपडेट हो रहा है..."
                  : "SAVING..."
                : language === "Hindi"
                ? "सेव करें"
                : "SAVE CHANGES"}
            </button>
          </form>
        )}

        {/* PROFILE LINKS */}
        <div
          className="profile-actions"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            borderTop: "1px solid #eee7de",
            paddingTop: "24px",
          }}
        >
          <Link
            to="/orders"
            style={{
              display: "block",
              textAlign: "center",
              padding: "12px 14px",
              border: "1px solid #d8cbbb",
              background: "#fff",
              color: "#211e1b",
              textDecoration: "none",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            📋 {language === "Hindi" ? "मेरे ऑर्डर्स" : "MY ORDERS"}
          </Link>

          <Link
            to="/wishlist"
            style={{
              display: "block",
              textAlign: "center",
              padding: "12px 14px",
              border: "1px solid #d8cbbb",
              background: "#fff",
              color: "#211e1b",
              textDecoration: "none",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            ♡ {language === "Hindi" ? "विशलिस्ट" : "WISHLIST"}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Profile;