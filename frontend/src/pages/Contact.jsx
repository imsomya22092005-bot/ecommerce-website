import { useLanguage } from "../LanguageContext";

function Contact() {
  const { language } = useLanguage();

  const supportEmail =
    "support@shopsphere.com";

  const handleEmailContact = () => {
    window.location.href =
      `mailto:${supportEmail}`;
  };

  return (
    <main className="contact-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="contact-hero">

        <p className="contact-label">
          {language === "Hindi"
            ? "हमसे जुड़ें"
            : "GET IN TOUCH"}
        </p>

        <h1>
          {language === "Hindi"
            ? "हम आपकी मदद के लिए यहाँ हैं"
            : "We're here to help"}
        </h1>

        <p>
          {language === "Hindi"
            ? "किसी सवाल या सहायता के लिए हमसे संपर्क करें।"
            : "Have a question or need help? Get in touch with the ShopSphere team."}
        </p>

      </section>

      {/* =========================
          CONTACT CONTENT
      ========================= */}

      <section className="contact-content">

        <div className="contact-info">

          {/* EMAIL */}

          <div className="contact-info-card">

            <span>📧</span>

            <div>

              <h3>
                {language === "Hindi"
                  ? "ईमेल"
                  : "Email Us"}
              </h3>

              <p>
                {supportEmail}
              </p>

            </div>

          </div>

          {/* SUPPORT */}

          <div className="contact-info-card">

            <span>💬</span>

            <div>

              <h3>
                {language === "Hindi"
                  ? "सहायता"
                  : "Customer Support"}
              </h3>

              <p>
                {language === "Hindi"
                  ? "ऑर्डर और प्रोडक्ट से जुड़े सवालों के लिए हमसे संपर्क करें।"
                  : "Contact us for help with products and orders."}
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            CONTACT CARD
        ========================= */}

        <div className="contact-form-card">

          <div className="contact-success">

            <div className="success-icon">
              ✉
            </div>

            <h2>
              {language === "Hindi"
                ? "हमें ईमेल करें"
                : "Send us an email"}
            </h2>

            <p>
              {language === "Hindi"
                ? "हमारे support email पर अपना सवाल या समस्या भेजें।"
                : "Send your question or concern directly to our support email."}
            </p>

            <button
              type="button"
              onClick={
                handleEmailContact
              }
              className="contact-submit-btn"
            >
              {language === "Hindi"
                ? "ईमेल भेजें →"
                : "EMAIL US →"}
            </button>

            <p
              style={{
                marginTop: "15px",
                fontSize: "11px",
                color: "#81776e",
              }}
            >
              {supportEmail}
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Contact;