import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";
import heroImage from "../assets/hero.png";
import heroModel from "../assets/hero-model.png";
import "./Landing.css";

function Landing() {
  const { language } = useLanguage();
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const hindi = language === "Hindi";

  const handleNewsletter = async (e) => {
    e.preventDefault();
    const email = e.currentTarget.email.value.trim();

    if (!email || newsletterSubmitting) return;

    try {
      setNewsletterSubmitting(true);
      setNewsletterMessage("");

      const response = await fetch(
        `${API_URL}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to subscribe");
      }

      setNewsletterMessage(
        data.message ||
          (hindi
            ? "आप ShopSphere updates के लिए subscribed हैं।"
            : "You're now subscribed to ShopSphere updates.")
      );
      e.currentTarget.reset();
    } catch (error) {
      setNewsletterMessage(
        error.message ||
          (hindi
            ? "अभी subscribe नहीं हो पाया।"
            : "Unable to subscribe right now.")
      );
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">
            {hindi ? "SHOPSPHERE • CURATED LIVING" : "SHOPSPHERE • CURATED LIVING"}
          </p>

          <h1>
            {hindi ? "आपकी दुनिया।" : "A world of"}
            <em>{hindi ? " आपकी तरह।" : " your own."}</em>
          </h1>

          <p className="landing-hero-description">
            {hindi
              ? "फैशन, एक्सेसरीज़ और everyday essentials का एक thoughtfully curated space — आपके style के लिए।"
              : "A thoughtfully curated space for fashion, accessories and everyday essentials — made to feel like you."}
          </p>

          <div className="landing-actions">
            <Link to="/home" className="landing-btn landing-btn-primary">
              {hindi ? "शॉप शुरू करें →" : "START SHOPPING →"}
            </Link>

            <Link to="/login" className="landing-btn landing-btn-secondary">
              {hindi ? "लॉगिन / रजिस्टर" : "LOGIN / REGISTER"}
            </Link>
          </div>

          <div className="landing-trust-row">
            <span>01</span>
            <i />
            <span>{hindi ? "चुनिंदा • सरल • आधुनिक" : "CURATED • SIMPLE • MODERN"}</span>
          </div>
        </div>

        <div className="landing-hero-art">
          <div className="landing-image-main">
            <img src={heroImage} alt="ShopSphere collection" />
          </div>
          <div className="landing-image-card">
            <img src={heroModel} alt="ShopSphere style" />
            <span>{hindi ? "NEW EDIT" : "NEW EDIT"}</span>
          </div>
          <div className="landing-art-label">
            <span>SS</span>
            <small>2026</small>
          </div>
        </div>
      </section>

      <section className="landing-intro">
        <p className="section-label">{hindi ? "हमारा नज़रिया" : "OUR PHILOSOPHY"}</p>
        <h2>
          {hindi ? "शॉपिंग सिर्फ खरीदना नहीं है।" : "Shopping should feel"}
          <em>{hindi ? " महसूस करना है।" : " effortless."}</em>
        </h2>
        <p>
          {hindi
            ? "ShopSphere को इस सोच के साथ बनाया गया है कि हर खरीदारी आसान, सुंदर और आपके लिए हो। फैशन से लेकर रोज़मर्रा की essentials तक, हम ऐसी चीज़ें चुनते हैं जो आपकी lifestyle के साथ naturally fit हों।"
            : "ShopSphere was created with a simple idea — shopping should be easy, inspiring and made to feel like you. From fashion to everyday essentials, we bring together products that fit naturally into modern everyday life."}
        </p>
        <Link to="/about" className="landing-text-link">
          {hindi ? "SHOPSPHERE के बारे में →" : "DISCOVER SHOPSPHERE →"}
        </Link>
      </section>

      <section className="landing-why">
        <div className="landing-section-heading">
          <div>
            <p className="section-label">{hindi ? "SHOPSPHERE क्यों?" : "WHY SHOPSPHERE"}</p>
            <h2>
              {hindi ? "सिर्फ एक" : "More than a"}{" "}
              <em>{hindi ? "मार्केटप्लेस नहीं।" : "marketplace."}</em>
            </h2>
          </div>
          <p>
            {hindi
              ? "सोच-समझकर चुने गए products, simple shopping और ऐसा style जो आपके लिए सही महसूस हो।"
              : "Thoughtfully selected products, simple shopping and a style that feels truly yours."}
          </p>
        </div>

        <div className="landing-why-grid">
          {[
            [ "01", "✦", hindi ? "सोच-समझकर चुना गया" : "Thoughtfully Selected", hindi ? "हर product को useful, beautiful और effortless shopping के लिए चुना गया है।" : "Products chosen to make everyday shopping more useful, beautiful and effortless." ],
            [ "02", "◇", hindi ? "आपकी स्टाइल के लिए" : "Made for Your Style", hindi ? "Fashion से everyday essentials तक, अपनी lifestyle के हिसाब से खोजें।" : "From fashion to everyday essentials, find pieces that naturally fit your lifestyle." ],
            [ "03", "◈", hindi ? "आसान शॉपिंग" : "Simple Experience", hindi ? "Easy browsing, clear choices और आपके लिए बनी shopping experience।" : "Easy browsing, clear choices and an experience designed around you." ],
            [ "04", "○", hindi ? "हमेशा कुछ नया" : "Always Evolving", hindi ? "Fresh collections और new discoveries के साथ explore करते रहें।" : "Fresh collections and new discoveries, so there is always something new to explore." ],
          ].map(([number, icon, title, text]) => (
            <article className="landing-why-card" key={number}>
              <span className="landing-card-number">{number}</span>
              <div className="landing-card-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-editorial">
        <div className="landing-editorial-image">
          <img src={heroModel} alt="ShopSphere editorial" />
        </div>
        <div className="landing-editorial-copy">
          <p className="section-label">{hindi ? "THE SHOPSPHERE EDIT" : "THE SHOPSPHERE EDIT"}</p>
          <h2>
            {hindi ? "जो पसंद आए," : "Choose what"}
            <em>{hindi ? " उसे अपना बनाएं।" : " feels like you."}</em>
          </h2>
          <p>
            {hindi
              ? "हम trends के पीछे नहीं भागते — हम ऐसी चीज़ें चुनते हैं जिन्हें आप बार-बार पहनना, इस्तेमाल करना और अपने तरीके से रखना चाहें।"
              : "We don't chase every trend. We curate pieces you will want to wear, use and make your own, again and again."}
          </p>
          <Link to="/home" className="landing-btn landing-btn-primary">
            {hindi ? "कलेक्शन देखें →" : "EXPLORE COLLECTION →"}
          </Link>
        </div>
      </section>


      <section className="landing-discover">
        <div className="landing-section-heading">
          <div>
            <p className="section-label">{hindi ? "SHOPSPHERE EXPLORE" : "SHOPSPHERE EXPLORE"}</p>
            <h2>
              {hindi ? "थोड़ा और" : "Go a little"} <em>{hindi ? "अंदर।" : "deeper."}</em>
            </h2>
          </div>
          <p>
            {hindi
              ? "Collections और Journal में ShopSphere की visual world को थोड़ा और explore करें।"
              : "Explore the visual world of ShopSphere through our Collections and Journal."}
          </p>
        </div>

        <div className="landing-discover-grid">
          <Link to="/collections" className="landing-discover-card">
            <img
              src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1000&q=85"
              alt="ShopSphere collections"
            />
            <div>
              <span>01 / COLLECTIONS</span>
              <h3>{hindi ? "क्यूरेटेड कलेक्शंस" : "Curated Collections"}</h3>
              <strong>EXPLORE →</strong>
            </div>
          </Link>

          <Link to="/journal" className="landing-discover-card">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
              alt="ShopSphere journal"
            />
            <div>
              <span>02 / JOURNAL</span>
              <h3>{hindi ? "स्टाइल, आइडियाज़ और एडिट्स" : "Style, ideas & edits"}</h3>
              <strong>READ →</strong>
            </div>
          </Link>
        </div>
      </section>

      <section className="landing-newsletter">
        <div className="landing-newsletter-copy">
          <p className="section-label">{hindi ? "अपडेट्स पाएं" : "STAY IN THE LOOP"}</p>
          <h2>
            {hindi ? "कुछ अच्छा आने वाला है।" : "Something good is"}
            <em>{hindi ? " हमेशा आने वाला है।" : " always coming."}</em>
          </h2>
          <p>
            {hindi
              ? "नए collections, चुनिंदा products और ShopSphere के खास updates सबसे पहले पाएं।"
              : "Be the first to know about new collections, selected products and exclusive ShopSphere updates."}
          </p>

          <form className="landing-newsletter-form" onSubmit={handleNewsletter}>
            <input
              name="email"
              type="email"
              required
              placeholder={hindi ? "अपना ईमेल दर्ज करें" : "Enter your email address"}
            />
            <button type="submit" disabled={newsletterSubmitting}>
              {newsletterSubmitting ? "..." : hindi ? "सब्सक्राइब करें" : "SUBSCRIBE"}
            </button>
          </form>

          {newsletterMessage && <p className="landing-newsletter-message">{newsletterMessage}</p>}
          <small>{hindi ? "कोई स्पैम नहीं। केवल ShopSphere updates." : "No spam. Just ShopSphere updates."}</small>
        </div>

        <div className="landing-newsletter-mark" aria-hidden="true">
          <div className="landing-orbit landing-orbit-one" />
          <div className="landing-orbit landing-orbit-two" />
          <div className="landing-newsletter-core">
            <span>✦</span>
            <strong>SS</strong>
            <small>NEW / 2026</small>
          </div>
          <b>NEW</b>
        </div>
      </section>

      <section className="landing-final">
        <p className="section-label">SHOPSPHERE</p>
        <h2>
          {hindi ? "अपना अगला favourite खोजें।" : "Find your next favourite."}
        </h2>
        <Link to="/home" className="landing-btn landing-btn-primary">
          {hindi ? "शॉप नाउ →" : "SHOP NOW →"}
        </Link>
        <Link to="/login" className="landing-final-login">
          {hindi ? "पहले से account है? Login करें" : "Already have an account? Login"}
        </Link>
      </section>
    </main>
  );
}

export default Landing;
