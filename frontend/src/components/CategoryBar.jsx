import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  House,
  Shirt,
  Footprints,
  Sparkles,
  ShoppingBag,
  Watch,
  Heart,
  Info,
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

const categoryIcons = {
  Men: <Shirt size={20} strokeWidth={1.7} />,
  Women: <Sparkles size={20} strokeWidth={1.7} />,
  Footwear: <Footprints size={20} strokeWidth={1.7} />,
  Accessories: <Watch size={20} strokeWidth={1.7} />,
};

const categoryTranslations = {
  Hindi: {
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
      <Link to="/" className="shop-category">
        <span className="category-icon">
          <House size={20} strokeWidth={1.7} />
        </span>
        <small>{language === "Hindi" ? "होम" : "Home"}</small>
      </Link>

      {categories.map((category) => (
        <Link
          key={category}
          to={"/products?category=" + encodeURIComponent(category)}
          className="shop-category"
        >
          <span className="category-icon">
            {categoryIcons[category] || (
              <ShoppingBag size={20} strokeWidth={1.7} />
            )}
          </span>
          <small>{categoryTranslations[language]?.[category] || category}</small>
        </Link>
      ))}

      <Link to="/new-arrivals" className="shop-category">
        <span className="category-icon">
          <Sparkles size={20} strokeWidth={1.7} />
        </span>
        <small>{language === "Hindi" ? "नए प्रोडक्ट्स" : "New Arrivals"}</small>
      </Link>

      <Link to="/products?sort=price_desc" className="shop-category">
        <span className="category-icon">
          <ShoppingBag size={20} strokeWidth={1.7} />
        </span>
        <small>{language === "Hindi" ? "बेस्ट सेलर्स" : "Best Sellers"}</small>
      </Link>

      <Link to="/products" className="shop-category">
        <span className="category-icon">
          <Heart size={20} strokeWidth={1.7} />
        </span>
        <small>{language === "Hindi" ? "कलेक्शंस" : "Collections"}</small>
      </Link>

      <Link to="/about" className="shop-category">
        <span className="category-icon">
          <Info size={20} strokeWidth={1.7} />
        </span>
        <small>{language === "Hindi" ? "हमारे बारे में" : "About Us"}</small>
      </Link>
    </div>
  );
}

export default CategoryBar;