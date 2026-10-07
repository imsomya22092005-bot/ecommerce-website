import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

const categoryVisuals = {
  Home:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=180&q=80",
  Men:
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=180&q=80",
  Women:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=180&q=80",
  Footwear:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=180&q=80",
  Accessories:
    "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=180&q=80",
  "New Arrivals":
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=180&q=80",
  "Best Sellers":
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=180&q=80",
  Collections:
    "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=180&q=80",
  "About Us":
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=180&q=80",
};

const categoryTranslations = {
  Hindi: {
    Home: "होम",
    Men: "मेन्स",
    Women: "विमेन्स",
    Accessories: "एक्सेसरीज़",
    Footwear: "फुटवियर",
    Fashion: "फैशन",
    Electronics: "इलेक्ट्रॉनिक्स",
    Smartphones: "स्मार्टफोन",
    Laptops: "लैपटॉप",
    Audio: "ऑडियो",
    Beauty: "ब्यूटी",
    Home: "होम",
  },
  English: {},
};

function CategoryIcon({ name }) {
  const image =
    categoryVisuals[name] ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=180&q=80";

  return (
    <span className="category-icon category-image-icon">
      <img src={image} alt="" loading="lazy" />
    </span>
  );
}

function CategoryBar() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(
          API_URL + "/api/products?limit=1000"
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load categories");
        }

        const productList = Array.isArray(data)
          ? data
          : data.products || [];

        const backendCategories = [
          ...new Set(
            productList
              .map((product) => String(product.category || "").trim())
              .filter(Boolean)
          ),
        ].sort((a, b) => a.localeCompare(b));

        setCategories(backendCategories);
      } catch (error) {
        console.error("Navbar category loading error:", error);
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="shop-categorybar">
      <Link to="/home" className="shop-category">
        <CategoryIcon name="Home" />
        <small>{language === "Hindi" ? "होम" : "Home"}</small>
      </Link>

      {categories.map((category) => (
        <Link
          key={category}
          to={"/products?category=" + encodeURIComponent(category)}
          className="shop-category"
        >
          <CategoryIcon name={category} />
          <small>
            {categoryTranslations[language]?.[category] || category}
          </small>
        </Link>
      ))}

      <Link to="/new-arrivals" className="shop-category">
        <CategoryIcon name="New Arrivals" />
        <small>{language === "Hindi" ? "नए प्रोडक्ट्स" : "New Arrivals"}</small>
      </Link>

      <Link to="/products?sort=price_desc" className="shop-category">
        <CategoryIcon name="Best Sellers" />
        <small>{language === "Hindi" ? "बेस्ट सेलर्स" : "Best Sellers"}</small>
      </Link>

      <Link to="/products" className="shop-category">
        <CategoryIcon name="Collections" />
        <small>{language === "Hindi" ? "कलेक्शंस" : "Collections"}</small>
      </Link>

      <Link to="/about" className="shop-category">
        <CategoryIcon name="About Us" />
        <small>{language === "Hindi" ? "हमारे बारे में" : "About Us"}</small>
      </Link>
    </div>
  );
}

export default CategoryBar;
