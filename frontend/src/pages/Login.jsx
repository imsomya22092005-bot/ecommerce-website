import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");

  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      const name = e.target.elements.fullName.value;

      localStorage.setItem("userName", name);

      setWelcomeName(name);
      setShowWelcome(true);
    } else {
      const email = e.target.elements.email.value;

      const savedName = localStorage.getItem("userName");

      if (savedName) {
        setWelcomeName(savedName);
      } else {
        const nameFromEmail = email.split("@")[0];

        localStorage.setItem("userName", nameFromEmail);
        setWelcomeName(nameFromEmail);
      }

      setShowWelcome(true);
    }
  };

  const continueShopping = () => {
    setShowWelcome(false);
    navigate("/");
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        {/* LEFT SIDE */}
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

        {/* LOGIN / REGISTER CARD */}
        <div className="auth-card">

          <div className="auth-tabs">
            <button
              type="button"
              className={!isRegister ? "active" : ""}
              onClick={() => setIsRegister(false)}
            >
              {language === "Hindi"
                ? "लॉगिन"
                : "LOGIN"}
            </button>

            <button
              type="button"
              className={isRegister ? "active" : ""}
              onClick={() => setIsRegister(true)}
            >
              {language === "Hindi"
                ? "रजिस्टर"
                : "REGISTER"}
            </button>
          </div>

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

            {/* SUBMIT */}
            <button
              type="submit"
              className="auth-submit"
            >
              {isRegister
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
              onClick={() => setIsRegister(!isRegister)}
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

      {/* CUSTOM WELCOME POPUP */}
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