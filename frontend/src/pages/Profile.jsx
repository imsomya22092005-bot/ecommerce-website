import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

const API_URL = "http://localhost:3000";

function Profile() {
  const { language } = useLanguage();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("authToken");

    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load profile"
          );
        }

        const data =
          await response.json();

        setProfile(
          data.user || data
        );
      } catch (error) {
        console.error(
          "Profile error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="profile-page">
        <h1>
          {language === "Hindi"
            ? "प्रोफाइल लोड हो रही है..."
            : "Loading Profile..."}
        </h1>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="profile-page">
        <div className="profile-card">
          <h1>
            {language === "Hindi"
              ? "कृपया लॉगिन करें"
              : "Please Login"}
          </h1>

          <Link to="/login">
            {language === "Hindi"
              ? "लॉगिन करें →"
              : "LOGIN →"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">

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

      <section className="profile-card">

        <div className="profile-avatar">
          {(profile.name ||
            profile.email ||
            "U")
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="profile-info">

          <div>
            <span>
              {language === "Hindi"
                ? "नाम"
                : "NAME"}
            </span>

            <strong>
              {profile.name || "—"}
            </strong>
          </div>

          <div>
            <span>
              {language === "Hindi"
                ? "ईमेल"
                : "EMAIL"}
            </span>

            <strong>
              {profile.email || "—"}
            </strong>
          </div>

          <div>
            <span>
              {language === "Hindi"
                ? "रोल"
                : "ROLE"}
            </span>

            <strong>
              {profile.role || "user"}
            </strong>
          </div>

        </div>

        <div className="profile-actions">

          <Link to="/orders">
            {language === "Hindi"
              ? "मेरे ऑर्डर्स"
              : "MY ORDERS"}
          </Link>

          <Link to="/wishlist">
            {language === "Hindi"
              ? "विशलिस्ट"
              : "WISHLIST"}
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Profile;