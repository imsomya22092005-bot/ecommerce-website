import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  UserRound,
  ShoppingBag,
  Truck,
  Store,
  LogOut,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function Profile() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  /* =========================
     LOAD PROFILE
  ========================= */

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile."
          );
        }

        const user = data?.user || data;

        setProfile(user);

        if (user?.username) {
          localStorage.setItem(
            "userName",
            user.username
          );
        }

        if (user?.email) {
          localStorage.setItem(
            "userEmail",
            user.email
          );
        }

        if (user?.role) {
          localStorage.setItem(
            "userRole",
            user.role
          );
        }

        window.dispatchEvent(
          new Event("userUpdated")
        );
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
  }, [token]);

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");

    window.dispatchEvent(
      new Event("userUpdated")
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    navigate("/");
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="profile-page">
        <section className="profile-loading">
          <div className="profile-loader"></div>

          <p className="profile-loading-text">
            {language === "Hindi"
              ? "आपकी प्रोफाइल लोड हो रही है..."
              : "Loading your profile..."}
          </p>
        </section>
      </main>
    );
  }

  /* =========================
     LOGIN REQUIRED
  ========================= */

  if (!token || !profile) {
    return (
      <main className="profile-page">
        <section className="profile-login-state">
          <div className="profile-login-icon">
            <UserRound
              size={30}
              strokeWidth={1.5}
            />
          </div>

          <p className="section-label">
            SHOPSPHERE
          </p>

          <h1>
            {language === "Hindi"
              ? "कृपया लॉगिन करें"
              : "Please Login"}
          </h1>

          <p className="profile-login-description">
            {language === "Hindi"
              ? "अपनी प्रोफाइल और ऑर्डर जानकारी देखने के लिए अपने अकाउंट में लॉगिन करें।"
              : "Log in to your account to view your profile and order information."}
          </p>

          <Link
            to="/login"
            className="profile-primary-btn"
          >
            {language === "Hindi"
              ? "लॉगिन करें"
              : "LOGIN"}

            <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    );
  }

  /* =========================
     USER DATA
  ========================= */

  const username = profile.username || "";
  const email = profile.email || "";
  const role = profile.role || "user";

  const avatarLetter = (
    username ||
    email ||
    "U"
  )
    .charAt(0)
    .toUpperCase();

  const displayRole =
    role.charAt(0).toUpperCase() +
    role.slice(1);

  /* =========================
     MAIN PROFILE
  ========================= */

  return (
    <main className="profile-page">

      {/* =========================
          PROFILE HERO
      ========================= */}

      <section className="profile-hero">
        <div className="profile-hero-inner">

          <div>
            <p className="section-label">
              SHOPSPHERE ACCOUNT
            </p>

            <h1>
              {language === "Hindi"
                ? "मेरी प्रोफाइल"
                : "My Profile"}
            </h1>

            <p className="profile-hero-text">
              {language === "Hindi"
                ? `स्वागत है, ${username}। अपने अकाउंट और शॉपिंग को एक जगह मैनेज करें।`
                : `Welcome back, ${username}. Manage your account and shopping from one place.`}
            </p>
          </div>

          <div className="profile-hero-badge">
            <ShieldCheck
              size={17}
              strokeWidth={1.7}
            />

            <span>
              ACCOUNT ACTIVE
            </span>
          </div>

        </div>
      </section>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <section className="profile-main">

        {/* USER CARD */}

        <div className="profile-user-card">

          <div className="profile-avatar-large">
            {avatarLetter}
          </div>

          <div className="profile-user-heading">

            <span className="profile-user-role">
              {displayRole}
            </span>

            <h2>
              {username}
            </h2>

            <p>
              {email}
            </p>

          </div>

        </div>

        {/* =========================
            ACCOUNT DETAILS
        ========================= */}

        <div className="profile-details-card">

          <div className="profile-card-heading">

            <div>
              <p className="profile-mini-label">
                ACCOUNT
              </p>

              <h2>
                {language === "Hindi"
                  ? "अकाउंट डिटेल्स"
                  : "Account Details"}
              </h2>
            </div>

            <UserRound
              size={22}
              strokeWidth={1.4}
            />

          </div>

          <div className="profile-details-grid">

            <div className="profile-detail-item">
              <span>
                {language === "Hindi"
                  ? "यूज़रनेम"
                  : "USERNAME"}
              </span>

              <strong>
                {username || "—"}
              </strong>
            </div>

            <div className="profile-detail-item">
              <span>
                {language === "Hindi"
                  ? "ईमेल पता"
                  : "EMAIL ADDRESS"}
              </span>

              <strong className="profile-email">
                {email || "—"}
              </strong>
            </div>

            <div className="profile-detail-item">
              <span>
                {language === "Hindi"
                  ? "अकाउंट रोल"
                  : "ACCOUNT ROLE"}
              </span>

              <strong>
                {displayRole}
              </strong>
            </div>

            <div className="profile-detail-item">
              <span>
                {language === "Hindi"
                  ? "स्टेटस"
                  : "STATUS"}
              </span>

              <strong className="profile-status">
                Active
              </strong>
            </div>

          </div>

        </div>

        {/* =========================
            QUICK ACCESS
        ========================= */}

        <div className="profile-quick-section">

          <div className="profile-card-heading">

            <div>
              <p className="profile-mini-label">
                QUICK ACCESS
              </p>

              <h2>
                {language === "Hindi"
                  ? "आप क्या करना चाहेंगे?"
                  : "What would you like to do?"}
              </h2>
            </div>

          </div>

          <div className="profile-quick-grid">

            {/* ORDERS */}

            <Link
              to="/orders"
              className="profile-quick-card"
            >
              <div className="profile-quick-icon">
                <ShoppingBag
                  size={22}
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <span>
                  {language === "Hindi"
                    ? "ऑर्डर्स"
                    : "MY ORDERS"}
                </span>

                <h3>
                  {language === "Hindi"
                    ? "अपने ऑर्डर्स देखें"
                    : "View your orders"}
                </h3>
              </div>

              <ArrowRight
                size={18}
                strokeWidth={1.6}
              />
            </Link>

            {/* TRACK ORDER */}

            <Link
              to="/track-order"
              className="profile-quick-card"
            >
              <div className="profile-quick-icon">
                <Truck
                  size={22}
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <span>
                  {language === "Hindi"
                    ? "ट्रैकिंग"
                    : "TRACK ORDER"}
                </span>

                <h3>
                  {language === "Hindi"
                    ? "ऑर्डर ट्रैक करें"
                    : "Track your order"}
                </h3>
              </div>

              <ArrowRight
                size={18}
                strokeWidth={1.6}
              />
            </Link>

            {/* SHOP */}

            <Link
              to="/products"
              className="profile-quick-card"
            >
              <div className="profile-quick-icon">
                <Store
                  size={22}
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <span>
                  {language === "Hindi"
                    ? "शॉपिंग"
                    : "SHOP"}
                </span>

                <h3>
                  {language === "Hindi"
                    ? "प्रोडक्ट्स ब्राउज़ करें"
                    : "Browse products"}
                </h3>
              </div>

              <ArrowRight
                size={18}
                strokeWidth={1.6}
              />
            </Link>

          </div>

        </div>

        {/* =========================
            LOGOUT
        ========================= */}

        <div className="profile-logout-section">

          <div>
            <p className="profile-mini-label">
              ACCOUNT
            </p>

            <h3>
              {language === "Hindi"
                ? "अकाउंट से साइन आउट करें"
                : "Sign out of your account"}
            </h3>

            <p>
              {language === "Hindi"
                ? "आप बाद में कभी भी दोबारा लॉगिन कर सकते हैं।"
                : "You can sign in again anytime."}
            </p>
          </div>

          <button
            type="button"
            className="profile-logout-btn"
            onClick={handleLogout}
          >
            <LogOut
              size={17}
              strokeWidth={1.7}
            />

            {language === "Hindi"
              ? "लॉगआउट"
              : "LOG OUT"}
          </button>

        </div>

      </section>
    </main>
  );
}

export default Profile;