import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Collections() {
  const { language } = useLanguage();
  const hindi = language === "Hindi";

  const cards = [
    {
      title: hindi ? "मेन्स एडिट" : "The Men's Edit",
      text: hindi ? "Clean layers, everyday essentials और modern silhouettes." : "Clean layers, everyday essentials and modern silhouettes.",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85",
      href: "/products?category=Men",
    },
    {
      title: hindi ? "विमेन्स एडिट" : "The Women's Edit",
      text: hindi ? "Soft tailoring, statement pieces और effortless everyday style." : "Soft tailoring, statement pieces and effortless everyday style.",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
      href: "/products?category=Women",
    },
    {
      title: hindi ? "फुटवियर" : "Step Into It",
      text: hindi ? "Comfort और confidence के लिए चुने हुए pairs." : "Selected pairs built around comfort and confidence.",
      image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1200&q=85",
      href: "/products?category=Footwear",
    },
    {
      title: hindi ? "एक्सेसरीज़" : "Finishing Touches",
      text: hindi ? "छोटी details जो पूरे look को अपना बनाती हैं." : "Small details that make the whole look feel yours.",
      image: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=1200&q=85",
      href: "/products?category=Accessories",
    },
  ];

  return (
    <main className="editorial-page collections-page">
      <section className="editorial-hero">
        <div>
          <p className="editorial-kicker">SHOPSPHERE / 2026</p>
          <h1>
            {hindi ? "कलेक्शन जो" : "Collections that"}
            <em>{hindi ? " आपके साथ चलें।" : " move with you."}</em>
          </h1>
          <p>
            {hindi
              ? "हर collection को रोज़मर्रा की जिंदगी, personal style और easy shopping को ध्यान में रखकर curated किया गया है।"
              : "Every collection is curated around everyday life, personal style and the kind of pieces you will actually want to keep."}
          </p>
          <Link to="/products" className="editorial-dark-btn">
            {hindi ? "सभी प्रोडक्ट्स देखें →" : "EXPLORE ALL PRODUCTS →"}
          </Link>
        </div>
        <div className="editorial-hero-art">
          <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=90" alt="ShopSphere collection" />
          <span>CURATED / 01</span>
        </div>
      </section>

      <section className="collection-intro">
        <p className="editorial-kicker">{hindi ? "THE SHOPSPHERE EDIT" : "THE SHOPSPHERE EDIT"}</p>
        <h2>{hindi ? "कम लेकिन बेहतर।" : "Less noise."} <em>{hindi ? "ज़्यादा आपका।" : "More you."}</em></h2>
        <p>
          {hindi
            ? "हम ऐसी categories और products सामने लाते हैं जिनमें style और utility दोनों हों। Browse करें, compare करें और वही चुनें जो आपके लिए सही लगे।"
            : "We bring forward categories and products where style meets utility. Browse, compare and choose what feels right for your everyday."}
        </p>
      </section>

      <section className="collection-grid-section">
        <div className="editorial-section-head">
          <div>
            <p className="editorial-kicker">{hindi ? "क्यूरेटेड कैटेगरीज़" : "CURATED CATEGORIES"}</p>
            <h2>{hindi ? "अपना edit चुनें।" : "Choose your edit."}</h2>
          </div>
          <span>04 / COLLECTIONS</span>
        </div>

        <div className="collection-grid">
          {cards.map((card, index) => (
            <Link to={card.href} className="collection-tile" key={card.title}>
              <img src={card.image} alt={card.title} />
              <div className="collection-tile-shade" />
              <div className="collection-tile-copy">
                <span>0{index + 1}</span>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
                <strong>↗</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="collection-manifesto">
        <div className="manifesto-mark">SS</div>
        <div>
          <p className="editorial-kicker">SHOPSPHERE PHILOSOPHY</p>
          <h2>{hindi ? "आपकी पसंद सबसे अच्छी filter है।" : "Your taste is the best filter."}</h2>
          <p>
            {hindi
              ? "ShopSphere का idea simple है: endless scrolling को thoughtful discovery में बदलना।"
              : "The idea is simple: turn endless scrolling into thoughtful discovery, with products that earn a place in your everyday."}
          </p>
          <Link to="/home" className="editorial-line-link">
            {hindi ? "शॉपिंग शुरू करें →" : "START SHOPPING →"}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Collections;
