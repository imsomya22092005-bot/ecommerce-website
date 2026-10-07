import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Journal() {
  const { language } = useLanguage();
  const hindi = language === "Hindi";

  const stories = [
    {
      tag: "STYLE NOTE / 01",
      title: hindi ? "Everyday style को effortless कैसे रखें" : "How to keep everyday style effortless",
      text: hindi ? "Simple silhouettes, useful layers और एक detail जो पूरे look को बदल दे।" : "Simple silhouettes, useful layers and one detail that can change the entire look.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=85",
    },
    {
      tag: "THE EDIT / 02",
      title: hindi ? "Accessories जो हर outfit को elevate करें" : "The accessories that elevate every outfit",
      text: hindi ? "कम pieces, सही pieces — और styling में थोड़ी personality." : "Fewer pieces, better pieces — with just enough personality.",
      image: "https://images.unsplash.com/photo-1506629905607-d9d3b4e9b1cf?auto=format&fit=crop&w=1000&q=85",
    },
    {
      tag: "SHOPSPHERE / 03",
      title: hindi ? "हम products कैसे चुनते हैं" : "How we think about products",
      text: hindi ? "Useful, beautiful और everyday life में genuinely काम आने वाली चीज़ें." : "Useful, beautiful and genuinely worth making part of everyday life.",
      image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1000&q=85",
    },
  ];

  return (
    <main className="editorial-page journal-page">
      <section className="journal-hero">
        <p className="editorial-kicker">SHOPSPHERE / JOURNAL</p>
        <h1>{hindi ? "Style के बारे में" : "A little more"} <em>{hindi ? "थोड़ा और।" : "to discover."}</em></h1>
        <p>
          {hindi
            ? "Ideas, edits और छोटी inspirations — ShopSphere की दुनिया से।"
            : "Ideas, edits and small inspirations from the world of ShopSphere."}
        </p>
      </section>

      <section className="journal-feature">
        <div className="journal-feature-image">
          <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1500&q=90" alt="ShopSphere journal feature" />
        </div>
        <div className="journal-feature-copy">
          <p className="editorial-kicker">{hindi ? "FEATURED STORY" : "FEATURED STORY"}</p>
          <h2>{hindi ? "अच्छा style loud होने की जरूरत नहीं रखता।" : "Good style does not need to be loud."}</h2>
          <p>
            {hindi
              ? "Texture, proportion और छोटे thoughtful details — कभी-कभी यही सबसे strong statement होते हैं।"
              : "Texture, proportion and small thoughtful details can often make the strongest statement."}
          </p>
          <Link to="/collections" className="editorial-line-link">
            {hindi ? "COLLECTIONS EXPLORE करें →" : "EXPLORE COLLECTIONS →"}
          </Link>
        </div>
      </section>

      <section className="journal-stories">
        <div className="editorial-section-head">
          <div>
            <p className="editorial-kicker">{hindi ? "LATEST NOTES" : "LATEST NOTES"}</p>
            <h2>{hindi ? "कुछ पढ़ने लायक।" : "Worth a little scroll."}</h2>
          </div>
          <span>03 / STORIES</span>
        </div>

        <div className="journal-grid">
          {stories.map((story) => (
            <article className="journal-card" key={story.tag}>
              <div className="journal-card-image">
                <img src={story.image} alt={story.title} />
              </div>
              <p className="editorial-kicker">{story.tag}</p>
              <h3>{story.title}</h3>
              <p>{story.text}</p>
              <span className="journal-read">READ NOTE →</span>
            </article>
          ))}
        </div>
      </section>

      <section className="journal-quote">
        <div className="journal-quote-mark">“</div>
        <h2>{hindi ? "Style वह है जो आपके साथ रह जाए।" : "Style is what stays with you."}</h2>
        <p>{hindi ? "— ShopSphere" : "— ShopSphere editorial"}</p>
      </section>

      <section className="editorial-cta">
        <p className="editorial-kicker">SHOPSPHERE</p>
        <h2>{hindi ? "अब कुछ पसंद करें।" : "Now find something you love."}</h2>
        <Link to="/home" className="editorial-dark-btn">
          {hindi ? "SHOP NOW →" : "SHOP NOW →"}
        </Link>
      </section>
    </main>
  );
}

export default Journal;
