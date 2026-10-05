import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Help() {
  const { language } = useLanguage();

  const [open, setOpen] =
    useState(null);

  const faqs = [
    {
      question:
        language === "Hindi"
          ? "मैं अपना ऑर्डर कैसे ट्रैक करूं?"
          : "How can I track my order?",

      answer:
        language === "Hindi"
          ? "More → Track Order पर जाएं और अपना Order ID डालें।"
          : "Go to More → Track Order and enter your Order ID.",
    },

    {
      question:
        language === "Hindi"
          ? "मैं अपना ऑर्डर कैसे रद्द करूं?"
          : "How can I cancel my order?",

      answer:
        language === "Hindi"
          ? "My Orders में अपने order पर जाएं। Pending या Confirmed order को उपलब्ध होने पर cancel किया जा सकता है।"
          : "Go to My Orders. Pending or Confirmed orders can be cancelled when the cancellation option is available.",
    },

    {
      question:
        language === "Hindi"
          ? "क्या मुझे ऑर्डर करने के लिए लॉगिन करना होगा?"
          : "Do I need to log in to place an order?",

      answer:
        language === "Hindi"
          ? "हाँ। Cart, Checkout और Orders देखने के लिए आपको अपने account में login करना होगा।"
          : "Yes. You need to be logged in to use the cart, checkout and orders.",
    },

    {
      question:
        language === "Hindi"
          ? "मैं अपनी प्रोफाइल कहाँ देख सकता हूं?"
          : "Where can I view my profile?",

      answer:
        language === "Hindi"
          ? "More → My Profile पर जाकर अपना username, email और role देख सकते हैं।"
          : "Go to More → My Profile to view your username, email and role.",
    },

    {
      question:
        language === "Hindi"
          ? "अगर मुझे कोई समस्या हो तो क्या करूं?"
          : "What if I have a problem?",

      answer:
        language === "Hindi"
          ? "Contact Us page से ShopSphere support email पर संपर्क करें।"
          : "Use the Contact Us page to contact the ShopSphere support email.",
    },
  ];

  return (
    <main className="help-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="help-hero">

        <p className="help-label">
          HELP & SUPPORT
        </p>

        <h1>
          {language === "Hindi"
            ? "हम आपकी मदद के लिए यहाँ हैं"
            : "How can we help you?"}
        </h1>

        <p>
          {language === "Hindi"
            ? "अपने सवाल का जवाब जल्दी पाएं।"
            : "Find answers to your questions quickly."}
        </p>

      </section>

      {/* =========================
          CONTENT
      ========================= */}

      <section className="help-content">

        <div className="help-title">

          <h2>
            {language === "Hindi"
              ? "अक्सर पूछे जाने वाले सवाल"
              : "Frequently Asked Questions"}
          </h2>

        </div>

        {/* FAQ LIST */}

        <div className="faq-list">

          {faqs.map(
            (faq, index) => (
              <div
                className="faq-item"
                key={index}
              >

                <button
                  type="button"
                  className="faq-question"
                  onClick={() =>
                    setOpen(
                      open === index
                        ? null
                        : index
                    )
                  }
                  aria-expanded={
                    open === index
                  }
                >

                  <span>
                    {
                      faq.question
                    }
                  </span>

                  <span>
                    {open === index
                      ? "−"
                      : "+"}
                  </span>

                </button>

                {open === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}

              </div>
            )
          )}

        </div>

        {/* =========================
            CONTACT BOX
        ========================= */}

        <div className="help-contact-box">

          <h3>
            {language === "Hindi"
              ? "अभी भी मदद चाहिए?"
              : "Still need help?"}
          </h3>

          <p>
            {language === "Hindi"
              ? "अपने सवाल के लिए हमें Contact Us page से ईमेल करें।"
              : "Send us an email through the Contact Us page for help."}
          </p>

          <Link to="/contact">
            {language === "Hindi"
              ? "हमसे संपर्क करें →"
              : "CONTACT US →"}
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Help;