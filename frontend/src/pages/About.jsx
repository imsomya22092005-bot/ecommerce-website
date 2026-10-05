import { useLanguage } from "../LanguageContext";
import aboutVisual from "../assets/about-visual.png";

function About() {
  const { language } = useLanguage();

  return (
    <main className="about-page">

      {/* =========================
          ABOUT HERO
      ========================= */}

      <section className="about-hero">

        <div className="about-hero-content">

          <p className="section-label">
            {language === "Hindi"
              ? "SHOPSPHERE के बारे में"
              : "ABOUT SHOPSPHERE"}
          </p>

          <h1>
            {language === "Hindi"
              ? "ऐसी स्टाइल जो"
              : "Style that feels"}
            <br />

            <em>
              {language === "Hindi"
                ? "सिर्फ आपकी हो।"
                : "uniquely yours."}
            </em>
          </h1>

          <p className="about-intro">
            {language === "Hindi"
              ? "ShopSphere एक आधुनिक ई-कॉमर्स प्लेटफॉर्म है, जिसे रोज़मर्रा की शॉपिंग को आसान, खूबसूरत और आनंददायक बनाने के लिए बनाया गया है।"
              : "ShopSphere is a modern e-commerce platform created to make everyday shopping simple, elegant and enjoyable."}
          </p>

        </div>


        {/* ABOUT IMAGE */}

        <div className="about-hero-visual">

          <img
            src={aboutVisual}
            alt={
              language === "Hindi"
                ? "ShopSphere कलेक्शन"
                : "ShopSphere collection"
            }
          />

        </div>

      </section>


      {/* =========================
          OUR STORY
      ========================= */}

      <section className="about-content">

        <div className="about-story">

          <p className="section-label">
            {language === "Hindi"
              ? "हमारी कहानी"
              : "OUR STORY"}
          </p>

          <h2>
            {language === "Hindi"
              ? "रोज़मर्रा की ज़िंदगी के लिए डिज़ाइन किया गया।"
              : "Designed for everyday living."}
          </h2>

          <p>
            {language === "Hindi"
              ? "ShopSphere में हमारा मानना है कि शॉपिंग केवल कोई प्रोडक्ट ढूंढने से कहीं अधिक होनी चाहिए। प्रोडक्ट खोजने से लेकर चेकआउट तक पूरा अनुभव आसान और सहज होना चाहिए।"
              : "At ShopSphere, we believe shopping should be more than simply finding a product. It should be an experience that feels effortless from discovery to checkout."}
          </p>

          <p>
            {language === "Hindi"
              ? "हमारा कलेक्शन फैशन, एक्सेसरीज़ और रोज़मर्रा की ज़रूरतों के लिए सोच-समझकर चुने गए प्रोडक्ट्स को एक आसान शॉपिंग अनुभव में साथ लाता है।"
              : "Our collection brings together thoughtfully selected products across fashion, accessories and everyday essentials — all in one simple shopping experience."}
          </p>

        </div>


        {/* =========================
            VALUES
        ========================= */}

        <div className="about-values">

          <div className="about-value">

            <span>01</span>

            <div>

              <h3>
                {language === "Hindi"
                  ? "गुणवत्ता"
                  : "QUALITY"}
              </h3>

              <p>
                {language === "Hindi"
                  ? "ऐसे प्रोडक्ट्स चुने जाते हैं जो रोज़मर्रा की स्टाइल और उपयोगिता को ध्यान में रखकर चुने गए हों।"
                  : "Products selected with everyday style and usability in mind."}
              </p>

            </div>

          </div>


          <div className="about-value">

            <span>02</span>

            <div>

              <h3>
                {language === "Hindi"
                  ? "सादगी"
                  : "SIMPLICITY"}
              </h3>

              <p>
                {language === "Hindi"
                  ? "बिना किसी अनावश्यक जटिलता के एक साफ़ और आसान शॉपिंग अनुभव।"
                  : "A clean and intuitive shopping experience without unnecessary complexity."}
              </p>

            </div>

          </div>


          <div className="about-value">

            <span>03</span>

            <div>

              <h3>
                {language === "Hindi"
                  ? "आप सबसे पहले"
                  : "YOU FIRST"}
              </h3>

              <p>
                {language === "Hindi"
                  ? "हम जो भी बनाते हैं, उसका उद्देश्य हमारे ग्राहकों के लिए शॉपिंग को आसान बनाना है।"
                  : "Everything we build starts with making shopping easier for our customers."}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          BOTTOM
      ========================= */}

      <section className="about-bottom">

        <p>SHOPSPHERE</p>

        <h2>
          {language === "Hindi"
            ? "खोजें। चुनें। इसे अपना बनाएं।"
            : "Discover. Choose. Make it yours."}
        </h2>

      </section>

    </main>
  );
}

export default About;