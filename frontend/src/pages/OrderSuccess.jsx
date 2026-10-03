import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function OrderSuccess() {
  const order =
    JSON.parse(localStorage.getItem("lastOrder"));

  const { language } = useLanguage();

  return (
    <main className="order-success">
      <div className="success-icon">✓</div>

      <p className="section-label">
        {language === "Hindi"
          ? "ऑर्डर कन्फर्म हो गया"
          : "ORDER CONFIRMED"}
      </p>

      <h1>
        {language === "Hindi"
          ? "आपके ऑर्डर के लिए धन्यवाद"
          : "Thank You For Your Order"}
      </h1>

      <p>
        {language === "Hindi"
          ? "आपका ऑर्डर सफलतापूर्वक प्लेस हो गया है। हम आपको आपकी डिलीवरी के बारे में अपडेट देते रहेंगे।"
          : "Your order has been successfully placed. We'll keep you updated about your delivery."}
      </p>

      {order && (
        <div className="order-details">
          <div>
            <span>
              {language === "Hindi"
                ? "ऑर्डर आईडी"
                : "ORDER ID"}
            </span>

            <strong>#{order.id}</strong>
          </div>

          <div>
            <span>
              {language === "Hindi"
                ? "ऑर्डर की तारीख"
                : "ORDER DATE"}
            </span>

            <strong>{order.date}</strong>
          </div>

          <div>
            <span>
              {language === "Hindi"
                ? "कुल"
                : "TOTAL"}
            </span>

            <strong>₹{order.total}</strong>
          </div>
        </div>
      )}

      <div className="success-actions">
        <Link to="/products">
          {language === "Hindi"
            ? "शॉपिंग जारी रखें"
            : "CONTINUE SHOPPING"}
        </Link>

        <Link to="/">
          {language === "Hindi"
            ? "होम पर वापस जाएं"
            : "BACK TO HOME"}
        </Link>
      </div>
    </main>
  );
}

export default OrderSuccess;