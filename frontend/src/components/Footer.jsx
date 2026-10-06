import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="footer">

      <div className="footer-main">

        {/* BRAND */}

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >
            SHOPSPHERE
          </Link>

          <p>
            {language === "Hindi"
              ? "आपकी रोज़मर्रा की स्टाइल और ज़िंदगी के लिए सोच-समझकर चुने गए प्रोडक्ट्स।"
              : "Thoughtfully selected products for your everyday style and life."}
          </p>

        </div>

        {/* SHOP */}

        <div className="footer-column">

          <h3>
            {language === "Hindi"
              ? "शॉप"
              : "SHOP"}
          </h3>

          <Link to="/products">
            {language === "Hindi"
              ? "सभी प्रोडक्ट्स"
              : "All Products"}
          </Link>

          <Link to="/new-arrivals">
            {language === "Hindi"
              ? "नए प्रोडक्ट्स"
              : "New Arrivals"}
          </Link>

          <Link to="/wishlist">
            {language === "Hindi"
              ? "मेरी विशलिस्ट"
              : "Wishlist"}
          </Link>

          <Link to="/products">
            {language === "Hindi"
              ? "कलेक्शन"
              : "Collections"}
          </Link>

        </div>

        {/* COMPANY */}

        <div className="footer-column">

          <h3>
            {language === "Hindi"
              ? "कंपनी"
              : "COMPANY"}
          </h3>

          <Link to="/about">
            {language === "Hindi"
              ? "हमारे बारे में"
              : "About Us"}
          </Link>

          <Link to="/profile">
            {language === "Hindi"
              ? "मेरी प्रोफाइल"
              : "My Profile"}
          </Link>

          <Link to="/orders">
            {language === "Hindi"
              ? "मेरे ऑर्डर्स"
              : "My Orders"}
          </Link>

        </div>

        {/* HELP */}

        <div className="footer-column">

          <h3>
            {language === "Hindi"
              ? "सहायता"
              : "HELP"}
          </h3>

          <Link to="/cart">
            {language === "Hindi"
              ? "शॉपिंग बैग"
              : "Shopping Bag"}
          </Link>

          <Link to="/checkout">
            {language === "Hindi"
              ? "चेकआउट"
              : "Checkout"}
          </Link>

          <Link to="/help">
            {language === "Hindi"
              ? "मदद और सहायता"
              : "Help & Support"}
          </Link>

          <Link to="/contact">
            {language === "Hindi"
              ? "हमसे संपर्क करें"
              : "Contact Us"}
          </Link>

        </div>

      </div>

      {/* BOTTOM */}

      <div className="footer-bottom">

        <p>
          {language === "Hindi"
            ? "© 2026 ShopSphere. सर्वाधिकार सुरक्षित।"
            : "© 2026 ShopSphere. All rights reserved."}
        </p>

        <p>
          {language === "Hindi"
            ? "सादगी को ध्यान में रखकर डिज़ाइन किया गया।"
            : "Designed with simplicity in mind."}
        </p>

      </div>

    </footer>
  );
}

export default Footer;