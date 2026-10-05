import { useState } from "react";
import { useLanguage } from "../LanguageContext";

function Help() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      question:
        language === "Hindi"
          ? "मैं अपना ऑर्डर कैसे ट्रैक करूं?"
          : "How can I track my order?",
      answer:
        language === "Hindi"
          ? "आप More → Track Order से अपना ऑर्डर ट्रैक कर सकते हैं।"
          : "You can track your order from More → Track Order.",
    },
    {
      question:
        language === "Hindi"
          ? "मैं अपना ऑर्डर कैसे रद्द करूं?"
          : "How can I cancel my order?",
      answer:
        language === "Hindi"
          ? "ऑर्डर प्लेस होने के बाद My Orders सेक्शन में जाकर cancellation options देखें।"
          : "Go to My Orders and check the available cancellation options for your order.",
    },
    {
      question:
        language === "Hindi"
          ? "क्या मैं अपना पासवर्ड बदल सकता हूं?"
          : "Can I change my password?",
      answer:
        language === "Hindi"
          ? "हाँ, आप अपने account settings से password बदल सकते हैं।"
          : "Yes, you can change your password from your account settings.",
    },
    {
      question:
        language === "Hindi"
          ? "अगर मुझे कोई समस्या हो तो क्या करूं?"
          : "What if I have a problem?",
      answer:
        language === "Hindi"
          ? "हमारी support team से Contact Us page के जरिए संपर्क करें।"
          : "Contact our support team through the Contact Us page.",
    },
  ];

  return (
    <main className="help-page">

      <section className="help-hero">
        <p className="help-label">HELP & SUPPORT</p>

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

      <section className="help-content">

        <div className="help-title">
          <h2>
            {language === "Hindi"
              ? "अक्सर पूछे जाने वाले सवाल"
              : "Frequently Asked Questions"}
          </h2>
        </div>

        <div className="faq-list">

          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>

              <button
                className="faq-question"
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
              >
                <span>{faq.question}</span>
                <span>{open === index ? "−" : "+"}</span>
              </button>

              {open === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}

            </div>
          ))}

        </div>

        <div className="help-contact-box">

          <h3>
            {language === "Hindi"
              ? "अभी भी मदद चाहिए?"
              : "Still need help?"}
          </h3>

          <p>
            {language === "Hindi"
              ? "हमारी support team से संपर्क करें।"
              : "Our support team is always ready to help."}
          </p>

          <a href="/contact">
            Contact Us →
          </a>

        </div>

      </section>

    </main>
  );
}

export default Help;