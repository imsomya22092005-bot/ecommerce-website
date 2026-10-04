import { useState } from "react";
import { useLanguage } from "../LanguageContext";

function Contact() {
  const { language } = useLanguage();

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="contact-page">

      <section className="contact-hero">
        <p className="contact-label">
          {language === "Hindi"
            ? "हमसे जुड़ें"
            : "GET IN TOUCH"}
        </p>

        <h1>
          {language === "Hindi"
            ? "हम आपकी मदद के लिए यहाँ हैं"
            : "We'd love to hear from you"}
        </h1>

        <p>
          {language === "Hindi"
            ? "किसी भी सवाल या सहायता के लिए हमसे संपर्क करें।"
            : "Have a question or need help? Our team is here for you."}
        </p>
      </section>

      <section className="contact-content">

        <div className="contact-info">

          <div className="contact-info-card">
            <span>📧</span>

            <div>
              <h3>Email Us</h3>
              <p>support@shopsphere.com</p>
            </div>
          </div>

          <div className="contact-info-card">
            <span>📞</span>

            <div>
              <h3>Call Us</h3>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="contact-info-card">
            <span>📍</span>

            <div>
              <h3>Visit Us</h3>
              <p>New Delhi, India</p>
            </div>
          </div>

          <div className="contact-info-card">
            <span>🕐</span>

            <div>
              <h3>Working Hours</h3>
              <p>Mon – Sat, 10 AM – 7 PM</p>
            </div>
          </div>

        </div>

        <div className="contact-form-card">

          {submitted ? (
            <div className="contact-success">
              <div className="success-icon">✓</div>

              <h2>
                {language === "Hindi"
                  ? "मैसेज भेज दिया गया!"
                  : "Message Sent!"}
              </h2>

              <p>
                {language === "Hindi"
                  ? "हम जल्द ही आपसे संपर्क करेंगे।"
                  : "Thank you for contacting us. We'll get back to you soon."}
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="contact-reset-btn"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <h2>
                {language === "Hindi"
                  ? "मैसेज भेजें"
                  : "Send us a message"}
              </h2>

              <form onSubmit={handleSubmit}>

                <div className="contact-form-row">

                  <div className="contact-field">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="contact-field">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Your email"
                      required
                    />
                  </div>

                </div>

                <div className="contact-field">
                  <label>Subject</label>

                  <input
                    type="text"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label>Message</label>

                  <textarea
                    rows="5"
                    placeholder="Write your message..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="contact-submit-btn"
                >
                  Send Message →
                </button>

              </form>
            </>
          )}

        </div>

      </section>

    </main>
  );
}

export default Contact;