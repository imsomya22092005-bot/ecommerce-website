import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { language } = useLanguage();

  const getResponseData = async (response) => {
    const text = await response.text();

    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return {
        message: text || "Something went wrong",
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const email = e.target.elements.email.value.trim();
    const password = e.target.elements.password.value;

    try {
      let response;
      let data;

      /* =========================
         REGISTER
      ========================= */

      if (isRegister) {
        const name =
          e.target.elements.fullName.value.trim();

        const confirmPassword =
          e.target.elements.confirmPassword.value;

        if (password !== confirmPassword) {
          setError(
            language === "Hindi"
              ? "पासवर्ड मैच नहीं कर रहे हैं।"
              : "Passwords do not match."
          );

          setLoading(false);
          return;
        }

        response = await fetch(
          "http://localhost:3000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        );

        data = await getResponseData(response);

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              "Registration failed"
          );
        }

        /*
          Registration successful.
          Ab automatically login karenge.
        */

        response = await fetch(
          "http://localhost:3000/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        data = await getResponseData(response);

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              "Login failed"
          );
        }
      } else {
        /* =========================
           LOGIN
        ========================= */

        response = await fetch(
          "http://localhost:3000/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        data = await getResponseData(response);

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              "Invalid email or password"
          );
        }
      }

      /* =========================
         GET TOKEN
      ========================= */

      const token =
        data.token ||
        data.accessToken ||
        data.jwt ||
        data.user?.token ||
        data.user?.accessToken;

      if (!token) {
        throw new Error(
          language === "Hindi"
            ? "Login successful hua, lekin token nahi mila."
            : "Login succeeded, but authentication token was not received."
        );
      }

      localStorage.setItem(
        "authToken",
        token
      );

      /* =========================
         USER NAME
      ========================= */

      let loggedInName =
        data.user?.name ||
        data.name ||
        data.user?.fullName ||
        data.fullName ||
        "";

      /* =========================
         PROFILE API
      ========================= */

      try {
        const profileResponse = await fetch(
          "http://localhost:3000/api/auth/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (profileResponse.ok) {
          const profileData =
            await getResponseData(profileResponse);

          loggedInName =
            profileData.user?.name ||
            profileData.name ||
            profileData.user?.fullName ||
            profileData.fullName ||
            loggedInName;
        }
      } catch (profileError) {
        console.log(
          "Profile request failed:",
          profileError
        );
      }

      /*
        Fallback:
        Agar backend response mein name nahi mila,
        email se naam bana denge.
      */

      if (!loggedInName) {
        loggedInName = email.split("@")[0];
      }

      /* =========================
         SAVE USER
      ========================= */

      localStorage.setItem(
        "userName",
        loggedInName
      );

      window.dispatchEvent(
        new Event("userUpdated")
      );

      /* =========================
         WELCOME POPUP
      ========================= */

      setWelcomeName(loggedInName);
      setShowWelcome(true);

    } catch (error) {
      console.error(
        "Authentication error:",
        error
      );

      setError(
        error.message ||
          (language === "Hindi"
            ? "कुछ गलत हो गया।"
            : "Something went wrong.")
      );
    } finally {
      setLoading(false);
    }
  };

  const continueShopping = () => {
    setShowWelcome(false);
    navigate("/");
  };

  /* =========================
     CLOSE LOGIN / REGISTER CARD
  ========================= */

  const closeAuth = () => {
    navigate("/");
  };

  return (
    <main className="auth-page">

      <div className="auth-container">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="auth-intro">

          <p className="section-label">
            {language === "Hindi"
              ? "SHOPSPHERE में आपका स्वागत है"
              : "WELCOME TO SHOPSPHERE"}
          </p>

          <h1>
            {language === "Hindi"
              ? "आपकी स्टाइल,"
              : "Your style,"}

            <br />

            {language === "Hindi"
              ? "आपकी पहचान।"
              : "your space."}
          </h1>

          <p>
            {language === "Hindi"
              ? "अपने ऑर्डर्स मैनेज करें, अपने पसंदीदा प्रोडक्ट्स सेव करें और एक पर्सनलाइज्ड शॉपिंग अनुभव का आनंद लें।"
              : "Sign in to manage your orders, save your favorites and enjoy a personalized shopping experience."}
          </p>

        </div>


        {/* =========================
            LOGIN / REGISTER CARD
        ========================= */}

        <div className="auth-card">

          {/* CLOSE BUTTON */}
          <button
            type="button"
            className="auth-close"
            onClick={closeAuth}
            aria-label="Close"
          >
            ×
          </button>


          {/* TABS */}

          <div className="auth-tabs">

            <button
              type="button"
              className={!isRegister ? "active" : ""}
              onClick={() => {
                setIsRegister(false);
                setError("");
              }}
            >
              {language === "Hindi"
                ? "लॉगिन"
                : "LOGIN"}
            </button>

            <button
              type="button"
              className={isRegister ? "active" : ""}
              onClick={() => {
                setIsRegister(true);
                setError("");
              }}
            >
              {language === "Hindi"
                ? "रजिस्टर"
                : "REGISTER"}
            </button>

          </div>


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* FULL NAME */}

            {isRegister && (
              <div className="form-group">

                <label>
                  {language === "Hindi"
                    ? "पूरा नाम"
                    : "FULL NAME"}
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder={
                    language === "Hindi"
                      ? "अपना नाम दर्ज करें"
                      : "Enter your name"
                  }
                  required
                />

              </div>
            )}


            {/* EMAIL */}

            <div className="form-group">

              <label>
                {language === "Hindi"
                  ? "ईमेल पता"
                  : "EMAIL ADDRESS"}
              </label>

              <input
                type="email"
                name="email"
                placeholder={
                  language === "Hindi"
                    ? "अपना ईमेल दर्ज करें"
                    : "Enter your email"
                }
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label>
                {language === "Hindi"
                  ? "पासवर्ड"
                  : "PASSWORD"}
              </label>

              <input
                type="password"
                name="password"
                placeholder={
                  language === "Hindi"
                    ? "अपना पासवर्ड दर्ज करें"
                    : "Enter your password"
                }
                required
              />

            </div>


            {/* CONFIRM PASSWORD */}

            {isRegister && (
              <div className="form-group">

                <label>
                  {language === "Hindi"
                    ? "पासवर्ड की पुष्टि करें"
                    : "CONFIRM PASSWORD"}
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder={
                    language === "Hindi"
                      ? "पासवर्ड दोबारा दर्ज करें"
                      : "Confirm your password"
                  }
                  required
                />

              </div>
            )}


            {/* FORGOT PASSWORD */}

            {!isRegister && (
              <div className="forgot-password">

                <button type="button">
                  {language === "Hindi"
                    ? "पासवर्ड भूल गए?"
                    : "Forgot password?"}
                </button>

              </div>
            )}


            {/* ERROR */}

            {error && (
              <p
                style={{
                  margin: "0 0 15px",
                  color: "#a64b3c",
                  fontSize: "12px",
                  lineHeight: "1.5",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}


            {/* SUBMIT */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? language === "Hindi"
                  ? "कृपया प्रतीक्षा करें..."
                  : "PLEASE WAIT..."
                : isRegister
                ? language === "Hindi"
                  ? "अकाउंट बनाएं"
                  : "CREATE ACCOUNT"
                : language === "Hindi"
                ? "साइन इन करें"
                : "SIGN IN"}
            </button>

          </form>


          {/* SWITCH LOGIN / REGISTER */}

          <p className="auth-switch">

            {isRegister
              ? language === "Hindi"
                ? "क्या आपका पहले से अकाउंट है?"
                : "Already have an account?"
              : language === "Hindi"
              ? "क्या आपका अकाउंट नहीं है?"
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
            >
              {isRegister
                ? language === "Hindi"
                  ? " लॉगिन"
                  : " Login"
                : language === "Hindi"
                ? " रजिस्टर"
                : " Register"}
            </button>

          </p>

        </div>

      </div>


      {/* =========================
          WELCOME POPUP
      ========================= */}

      {showWelcome && (
        <div className="welcome-overlay">

          <div className="welcome-popup">

            <div className="welcome-icon">
              ✦
            </div>

            <p className="section-label">
              {language === "Hindi"
                ? "SHOPSPHERE में आपका स्वागत है"
                : "WELCOME TO SHOPSPHERE"}
            </p>

            <h2>
              {language === "Hindi"
                ? `स्वागत है, ${welcomeName}!`
                : `Welcome, ${welcomeName}!`}
            </h2>

            <p>
              {isRegister
                ? language === "Hindi"
                  ? "आपका अकाउंट सफलतापूर्वक बन गया है।"
                  : "Your account has been created successfully."
                : language === "Hindi"
                ? "आपने सफलतापूर्वक साइन इन कर लिया है।"
                : "You have successfully signed in."}

              <br />

              {language === "Hindi"
                ? "हमें खुशी है कि आप हमारे साथ हैं।"
                : "We're happy to have you with us."}
            </p>

            <button
              type="button"
              className="welcome-button"
              onClick={continueShopping}
            >
              {language === "Hindi"
                ? "शॉपिंग जारी रखें →"
                : "CONTINUE SHOPPING →"}
            </button>

          </div>

        </div>
      )}

    </main>
  );
}

export default Login;