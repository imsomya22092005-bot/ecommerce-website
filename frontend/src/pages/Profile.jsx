import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function Profile() {
  const { language } = useLanguage();

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const token =
    localStorage.getItem("authToken");

  // =========================
  // LOAD PROFILE
  // =========================

  useEffect(() => {
    const loadProfile =
      async () => {
        if (!token) {
          setLoading(false);
          return;
        }

        try {
          const response =
            await fetch(
              `${API_URL}/api/auth/profile`,
              {
                method: "GET",
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                (language === "Hindi"
                  ? "प्रोफाइल लोड नहीं हो पाई।"
                  : "Failed to load profile.")
            );
          }

          // Backend auth/profile
          // returns the user directly
          setProfile(
            data?.user || data
          );

          // Keep local user information
          if (data?.username) {
            localStorage.setItem(
              "userName",
              data.username
            );
          }

          if (data?.email) {
            localStorage.setItem(
              "userEmail",
              data.email
            );
          }

          if (data?.role) {
            localStorage.setItem(
              "userRole",
              data.role
            );
          }
        } catch (error) {
          console.error(
            "Profile error:",
            error
          );

          setProfile(null);
        } finally {
          setLoading(false);
        }
      };

    loadProfile();
  }, [token, language]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="profile-page">

        <section className="profile-header">
          <p className="section-label">
            SHOPSPHERE
          </p>

          <h1>
            {language === "Hindi"
              ? "प्रोफाइल लोड हो रही है..."
              : "Loading Profile..."}
          </h1>
        </section>

      </main>
    );
  }

  // =========================
  // LOGIN REQUIRED
  // =========================

  if (!token || !profile) {
    return (
      <main className="profile-page">

        <div className="profile-card">

          <div className="profile-avatar">
            ?
          </div>

          <h1>
            {language === "Hindi"
              ? "कृपया लॉगिन करें"
              : "Please Login"}
          </h1>

          <p>
            {language === "Hindi"
              ? "अपनी प्रोफाइल देखने के लिए अपने अकाउंट में लॉगिन करें।"
              : "Log in to your account to view your profile."}
          </p>

          <Link to="/login">
            {language === "Hindi"
              ? "लॉगिन करें →"
              : "LOGIN →"}
          </Link>

        </div>

      </main>
    );
  }

  // =========================
  // USER DATA
  // =========================

  const username =
    profile.username || "";

  const email =
    profile.email || "";

  const role =
    profile.role || "user";

  const avatarLetter =
    (username ||
      email ||
      "U")
      .charAt(0)
      .toUpperCase();

  return (
    <main className="profile-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="profile-header">

        <p className="section-label">
          SHOPSPHERE
        </p>

        <h1>
          {language === "Hindi"
            ? "मेरी प्रोफाइल"
            : "My Profile"}
        </h1>

        <p>
          {language === "Hindi"
            ? "अपनी अकाउंट जानकारी देखें।"
            : "View your account information."}
        </p>

      </section>

      {/* =========================
          PROFILE CARD
      ========================= */}

      <section className="profile-card">

        {/* AVATAR */}

        <div className="profile-avatar">
          {avatarLetter}
        </div>

        {/* USER INFO */}

        <div className="profile-info">

          {/* USERNAME */}

          <div>
            <span>
              {language === "Hindi"
                ? "यूज़रनेम"
                : "USERNAME"}
            </span>

            <strong>
              {username || "—"}
            </strong>
          </div>

          {/* EMAIL */}

          <div>
            <span>
              {language === "Hindi"
                ? "ईमेल"
                : "EMAIL"}
            </span>

            <strong>
              {email || "—"}
            </strong>
          </div>

          {/* ROLE */}

          <div>
            <span>
              {language === "Hindi"
                ? "रोल"
                : "ROLE"}
            </span>

            <strong
              style={{
                textTransform:
                  "capitalize",
              }}
            >
              {role}
            </strong>
          </div>

        </div>

        {/* ACTIONS */}

        <div className="profile-actions">

          <Link to="/orders">
            {language === "Hindi"
              ? "मेरे ऑर्डर्स"
              : "MY ORDERS"}
          </Link>

          <Link to="/products">
            {language === "Hindi"
              ? "शॉपिंग करें"
              : "SHOP PRODUCTS"}
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Profile;