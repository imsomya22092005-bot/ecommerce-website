import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

function Home() {
  return (
    <main className="home">

      <section className="hero">

        <div className="hero-content">
          <p className="hero-label">NEW COLLECTION</p>

          <h1>
            Elevate Your
            <br />
            Everyday Style.
          </h1>

          <p className="hero-description">
            Discover thoughtfully selected products made
            for your style, comfort and everyday life.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="hero-btn primary-btn">
              SHOP NOW
            </Link>

            <Link to="/products" className="hero-btn secondary-btn">
              VIEW COLLECTION
            </Link>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <img
            src={heroImage}
            alt="ShopSphere collection"
            className="hero-image"
          />
        </div>

      </section>

      <section className="hero-features">

        <div className="feature">
          <span>✦</span>
          <div>
            <strong>FREE SHIPPING</strong>
            <p>On orders over ₹999</p>
          </div>
        </div>

        <div className="feature">
          <span>↻</span>
          <div>
            <strong>EASY RETURNS</strong>
            <p>30-day return policy</p>
          </div>
        </div>

        <div className="feature">
          <span>◇</span>
          <div>
            <strong>SECURE PAYMENT</strong>
            <p>100% secure checkout</p>
          </div>
        </div>

        <div className="feature">
          <span>♡</span>
          <div>
            <strong>24/7 SUPPORT</strong>
            <p>We're here to help</p>
          </div>
        </div>

      </section>

    </main>
  );
}

export default Home;