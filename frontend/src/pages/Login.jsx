import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function Login() {
  const [isRegister, setIsRegister] =
    useState(false);

  const [showWelcome, setShowWelcome] =
    useState(false);

  const [welcomeName, setWelcomeName] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const { language } =
    useLanguage();

  // =========================
  // API RESPONSE
  // =========================

  const getResponseData =
    async (response) => {
      const text =
        await response.text();

      try {
        return text
          ? JSON.parse(text)
          : {};
      } catch {
        return {
          message:
            text ||
            "Something went wrong",
        };
      }
    };

  // =========================
  // SAVE SESSION
  // =========================

  const saveUserSession = ({
    token,
    username,
    email,
    role,
  }) => {
    localStorage.setItem(
      "authToken",
      token
    );

    localStorage.setItem(
      "userName",
      username ||
        email.split("@")[0]
    );

    localStorage.setItem(
      "userEmail",
      email
    );

    localStorage.setItem(
      "userRole",
      role || "user"
    );

    window.dispatchEvent(
      new Event("userUpdated")
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");
      setLoading(true);

      const email =
        e.target.elements.email.value.trim();

      const password =
        e.target.elements.password.value;

      try {
        let response;
        let data;

        // =========================
        // REGISTER
        // =========================

        if (isRegister) {
          const username =
            e.target.elements.username.value.trim();

          const confirmPassword =
            e.target.elements.confirmPassword
              .value;

          if (!username) {
            throw new Error(
              language === "Hindi"
                ? "कृपया username दर्ज करें।"
                : "Please enter your username."
            );
          }

          if (
            password.length < 6
          ) {
            throw new Error(
              language === "Hindi"
                ? "पासवर्ड कम से कम 6 characters का होना चाहिए।"
                : "Password must be at least 6 characters."
            );
          }

          if (
            password !==
            confirmPassword
          ) {
            throw new Error(
              language === "Hindi"
                ? "पासवर्ड मैच नहीं कर रहे हैं।"
                : "Passwords do not match."
            );
          }

          response =
            await fetch(
              `${API_URL}/api/auth/register`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  username,
                  email,
                  password,
                }),
              }
            );

          data =
            await getResponseData(
              response
            );

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Registration failed"
            );
          }

          // =========================
          // LOGIN AFTER REGISTER
          // =========================

          response =
            await fetch(
              `${API_URL}/api/auth/login`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  email,
                  password,
                }),
              }
            );

          data =
            await getResponseData(
              response
            );

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Login failed"
            );
          }
        }

        // =========================
        // LOGIN
        // =========================

        else {
          response =
            await fetch(
              `${API_URL}/api/auth/login`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  email,
                  password,
                }),
              }
            );

          data =
            await getResponseData(
              response
            );

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Invalid email or password"
            );
          }
        }

        // =========================
        // TOKEN
        // =========================

        const token =
          data.token;

        if (!token) {
          throw new Error(
            language === "Hindi"
              ? "Authentication token नहीं मिला।"
              : "Authentication token was not received."
          );
        }

        // =========================
        // GET PROFILE
        // =========================

        let username =
          data.user?.username ||
          "";

        let userEmail =
          data.user?.email ||
          email;

        let userRole =
          data.user?.role ||
          "user";

        try {
          const profileResponse =
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

          const profileData =
            await getResponseData(
              profileResponse
            );

          if (
            profileResponse.ok
          ) {
            const profile =
              profileData?.user ||
              profileData;

            username =
              profile?.username ||
              username;

            userEmail =
              profile?.email ||
              userEmail;

            userRole =
              profile?.role ||
              userRole;
          }
        } catch (profileError) {
          console.error(
            "Profile request failed:",
            profileError
          );
        }

        // =========================
        // FALLBACK USERNAME
        // =========================

        if (!username) {
          username =
            email.split("@")[0];
        }

        // =========================
        // SAVE SESSION
        // =========================

        saveUserSession({
          token,
          username,
          email: userEmail,
          role: userRole,
        });

        // =========================
        // WELCOME
        // =========================

        setWelcomeName(
          username
        );

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

  // =========================
  // CONTINUE
  // =========================

  const continueShopping =
    () => {
      setShowWelcome(false);
      navigate("/");
    };

  // =========================
  // CLOSE
  // =========================

  const closeAuth = () => {
    navigate("/");
  };

  return (
    <main className="auth-page">

      <div className="auth-container">

        {/* =========================
            LEFT
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
              ? "अपने ऑर्डर्स मैनेज करें और एक आसान shopping experience का आनंद लें।"
              : "Sign in to manage your orders and enjoy a simple shopping experience."}
          </p>

        </div>

        {/* =========================
            CARD
        ========================= */}

        <div className="auth-card">

          {/* CLOSE */}

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
              className={
                !isRegister
                  ? "active"
                  : ""
              }
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
              className={
                isRegister
                  ? "active"
                  : ""
              }
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

          <form
            onSubmit={
              handleSubmit
            }
          >

            {/* USERNAME */}

            {isRegister && (
              <div className="form-group">

                <label>
                  {language === "Hindi"
                    ? "यूज़रनेम"
                    : "USERNAME"}
                </label>

                <input
                  type="text"
                  name="username"
                  placeholder={
                    language ===
                    "Hindi"
                      ? "अपना username दर्ज करें"
                      : "Enter your username"
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
                  language ===
                  "Hindi"
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
                  language ===
                  "Hindi"
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
                    language ===
                    "Hindi"
                      ? "पासवर्ड दोबारा दर्ज करें"
                      : "Confirm your password"
                  }
                  required
                />

              </div>
            )}

            {/* ERROR */}

            {error && (
              <p
                style={{
                  margin:
                    "0 0 15px",
                  color:
                    "#a64b3c",
                  fontSize:
                    "12px",
                  lineHeight:
                    "1.5",
                  textAlign:
                    "center",
                }}
              >
                {error}
              </p>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="auth-submit"
              disabled={
                loading
              }
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

          {/* SWITCH */}

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
                setIsRegister(
                  (current) =>
                    !current
                );

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
              onClick={
                continueShopping
              }
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