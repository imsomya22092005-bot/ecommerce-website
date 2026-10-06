import { Link } from "react-router-dom";

import {
  House,
  Shirt,
  Footprints,
  Sparkles,
  Smartphone,
  Dumbbell,
  Sofa,
  Watch,
  ShoppingBag,
  Heart,
  Info,
} from "lucide-react";

import { useLanguage } from "../LanguageContext";

/* =========================================================
   SHOPSPHERE CATEGORY GROUPS
========================================================= */

const categoryGroups = [
  {
    name: "Fashion",
    hindi: "फैशन",
    icon: (
      <Shirt
        size={20}
        strokeWidth={1.7}
      />
    ),
    categories: [
      "mens-shirts",
      "womens-dresses",
      "tops",
    ],
  },

  {
    name: "Beauty",
    hindi: "ब्यूटी",
    icon: (
      <Sparkles
        size={20}
        strokeWidth={1.7}
      />
    ),
    categories: [
      "beauty",
      "skin-care",
      "fragrances",
    ],
  },

  {
    name: "Footwear",
    hindi: "फुटवियर",
    icon: (
      <Footprints
        size={20}
        strokeWidth={1.7}
      />
    ),
    categories: [
      "mens-shoes",
      "womens-shoes",
    ],
  },

  {
    name: "Gadgets",
    hindi: "गैजेट्स",
    icon: (
      <Smartphone
        size={20}
        strokeWidth={1.7}
      />
    ),
    categories: [
      "smartphones",
      "laptops",
      "tablets",
      "mobile-accessories",
    ],
  },

  {
    name: "Sports",
    hindi: "स्पोर्ट्स",
    icon: (
      <Dumbbell
        size={20}
        strokeWidth={1.7}
      />
    ),
    categories: [
      "sports-accessories",
    ],
  },

  {
    name: "Furniture",
    hindi: "फर्नीचर",
    icon: (
      <Sofa
        size={20}
        strokeWidth={1.7}
      />
    ),
    categories: [
      "furniture",
    ],
  },

  {
    name: "Home Accessories",
    hindi: "होम एक्सेसरीज़",
    icon: (
      <House
        size={20}
        strokeWidth={1.7}
      />
    ),
    categories: [
      "home-decoration",
      "kitchen-accessories",
    ],
  },

  {
    name: "Accessories",
    hindi: "एक्सेसरीज़",
    icon: (
      <Watch
        size={20}
        strokeWidth={1.7}
      />
    ),
    categories: [
      "mens-watches",
      "womens-watches",
      "sunglasses",
      "womens-bags",
      "womens-jewellery",
    ],
  },
];

/* =========================================================
   BUILD GROUP URL
========================================================= */

function createGroupUrl(categories) {
  return `/products?categories=${encodeURIComponent(
    categories.join("||")
  )}`;
}

/* =========================================================
   CATEGORY BAR
========================================================= */

function CategoryBar() {
  const { language } =
    useLanguage();

  return (
    <div className="shop-categorybar">

      {/* HOME */}

      <Link
        to="/"
        className="shop-category"
      >
        <span className="category-icon">
          <House
            size={20}
            strokeWidth={1.7}
          />
        </span>

        <small>
          {language === "Hindi"
            ? "होम"
            : "Home"}
        </small>
      </Link>

      {/* MAIN CATEGORIES */}

      {categoryGroups.map(
        (group) => (
          <Link
            key={group.name}
            to={createGroupUrl(
              group.categories
            )}
            className="shop-category"
          >
            <span className="category-icon">
              {group.icon}
            </span>

            <small>
              {language === "Hindi"
                ? group.hindi
                : group.name}
            </small>
          </Link>
        )
      )}

      {/* NEW ARRIVALS */}

      <Link
        to="/new-arrivals"
        className="shop-category"
      >
        <span className="category-icon">
          <Sparkles
            size={20}
            strokeWidth={1.7}
          />
        </span>

        <small>
          {language === "Hindi"
            ? "नए प्रोडक्ट्स"
            : "New Arrivals"}
        </small>
      </Link>

      {/* BEST SELLERS */}

      <Link
        to="/products?sort=price_desc"
        className="shop-category"
      >
        <span className="category-icon">
          <ShoppingBag
            size={20}
            strokeWidth={1.7}
          />
        </span>

        <small>
          {language === "Hindi"
            ? "बेस्ट सेलर्स"
            : "Best Sellers"}
        </small>
      </Link>

      {/* COLLECTIONS */}

      <Link
        to="/products"
        className="shop-category"
      >
        <span className="category-icon">
          <Heart
            size={20}
            strokeWidth={1.7}
          />
        </span>

        <small>
          {language === "Hindi"
            ? "कलेक्शंस"
            : "Collections"}
        </small>
      </Link>

      {/* ABOUT */}

      <Link
        to="/about"
        className="shop-category"
      >
        <span className="category-icon">
          <Info
            size={20}
            strokeWidth={1.7}
          />
        </span>

        <small>
          {language === "Hindi"
            ? "हमारे बारे में"
            : "About Us"}
        </small>
      </Link>

    </div>
  );
}

export default CategoryBar;