import API_URL from "../api";
import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../LanguageContext";
import ProductCard from "../components/ProductCard";

// const API_URL = "http://localhost:3000";
const PRODUCTS_PER_PAGE = 8;

function Products() {
  const { language } = useLanguage();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const categoryFromURL =
    searchParams.get("category");

  const initialCategory =
    categoryFromURL &&
    categoryFromURL !== "all"
      ? categoryFromURL
      : "All";

  const initialSearch =
    searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [search, setSearch] =
    useState(initialSearch);
  const [category, setCategory] =
    useState(initialCategory);
  const [sort, setSort] =
    useState("default");
  const [currentPage, setCurrentPage] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && cat !== "all") {
      setCategory(cat);
    } else if (cat === "all") {
      setCategory("All");
    }
    const q = searchParams.get("search");
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/products?limit=0`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch products"
          );
        }

        const data =
          await response.json();

        /*
          Backend currently returns the
          products collection.
          We keep filtering/sorting/pagination
          on the frontend so the page remains
          compatible with the current API.
        */

        const productList = Array.isArray(data)
          ? data
          : data.products || [];

        setProducts(productList);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );

        setError(
          language === "Hindi"
            ? "प्रोडक्ट्स लोड नहीं हो सके।"
            : "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [language]);

  // =========================
  // FILTER + SORT
  // =========================

  const filteredProducts = useMemo(() => {
    const result = products
      .filter((product) => {
        const productName =
          String(
            product.name || ""
          ).toLowerCase();

        const searchValue =
          search.toLowerCase().trim();

        const matchesSearch =
          productName.includes(
            searchValue
          );

        let matchesCategory = category === "All";
        if (!matchesCategory) {
          const prodCat = String(product.category || "").toLowerCase();
          const selectedCat = String(category).toLowerCase();

          if (selectedCat === "fashion") {
            matchesCategory = [
              "fashion",
              "mens-shirts",
              "womens-dresses",
              "tops",
            ].includes(prodCat);
          } else if (selectedCat === "accessories") {
            matchesCategory = [
              "accessories",
              "mens-watches",
              "womens-watches",
              "womens-jewellery",
              "sunglasses",
              "womens-bags",
              "sports-accessories",
              "mobile-accessories",
            ].includes(prodCat);
          } else if (selectedCat === "footwear") {
            matchesCategory = [
              "footwear",
              "mens-shoes",
              "womens-shoes",
            ].includes(prodCat);
          } else {
            matchesCategory = prodCat === selectedCat;
          }
        }

        return (
          matchesSearch &&
          matchesCategory
        );
      })
      .sort((a, b) => {
        if (sort === "low") {
          return (
            Number(a.price || 0) -
            Number(b.price || 0)
          );
        }

        if (sort === "high") {
          return (
            Number(b.price || 0) -
            Number(a.price || 0)
          );
        }

        if (sort === "name") {
          return String(
            a.name || ""
          ).localeCompare(
            String(b.name || "")
          );
        }

        return 0;
      });

    return result;
  }, [
    products,
    search,
    category,
    sort,
  ]);

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length /
        PRODUCTS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    PRODUCTS_PER_PAGE;

  const endIndex =
    startIndex + PRODUCTS_PER_PAGE;

  const visibleProducts =
    filteredProducts.slice(
      startIndex,
      endIndex
    );

  // =========================
  // RESET PAGE WHEN FILTERS CHANGE
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    category,
    sort,
  ]);

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("default");
    setCurrentPage(1);
    setSearchParams({});
  };

  // =========================
  // ACTIVE FILTER COUNT
  // =========================

  const activeFilterCount =
    (search.trim() ? 1 : 0) +
    (category !== "All" ? 1 : 0) +
    (sort !== "default" ? 1 : 0);

  return (
    <main className="products-page">

      {/* =========================
          HEADER
      ========================= */}

      <section
        className="products-header"
        id="new-arrivals"
      >
        <p className="section-label">
          {language === "Hindi"
            ? "SHOPSPHERE कलेक्शन"
            : "SHOPSPHERE COLLECTION"}
        </p>

        <h1>
          {language === "Hindi"
            ? "अपनी स्टाइल खोजें"
            : "Discover Your Style"}
        </h1>

        <p>
          {language === "Hindi"
            ? "हमारे खास चुने गए प्रोडक्ट्स का कलेक्शन देखें, जो रोज़मर्रा की खूबसूरती के लिए डिज़ाइन किए गए हैं।"
            : "Explore our carefully selected collection of products designed for everyday elegance."}
        </p>
      </section>

      {/* =========================
          SEARCH + FILTERS
      ========================= */}

      <section className="product-controls">

        {/* SEARCH */}

        <input
          type="text"
          placeholder={
            language === "Hindi"
              ? "प्रोडक्ट खोजें..."
              : "Search products..."
          }
          value={search}
          onChange={(e) => {
            const value =
              e.target.value;

            setSearch(value);

            setSearchParams({
              ...(value && {
                search: value,
              }),
              ...(category !== "All" && {
                category,
              }),
            });
          }}
        />

        {/* CATEGORY */}

        <select
          value={category}
          onChange={(e) => {
            const value =
              e.target.value;

            setCategory(value);

            setSearchParams({
              ...(search && {
                search,
              }),
              ...(value !== "All" && {
                category: value,
              }),
            });
          }}
        >
          <option value="All">
            {language === "Hindi"
              ? "सभी कैटेगरी"
              : "All Categories"}
          </option>

          <option value="Fashion">
            {language === "Hindi"
              ? "फैशन"
              : "Fashion"}
          </option>

          <option value="Accessories">
            {language === "Hindi"
              ? "एक्सेसरीज़"
              : "Accessories"}
          </option>

          <option value="Footwear">
            {language === "Hindi"
              ? "फुटवियर"
              : "Footwear"}
          </option>
        </select>

        {/* SORT */}

        <select
          value={sort}
          onChange={(e) => {
            setSort(
              e.target.value
            );
          }}
        >
          <option value="default">
            {language === "Hindi"
              ? "क्रम से देखें"
              : "Sort By"}
          </option>

          <option value="low">
            {language === "Hindi"
              ? "कीमत: कम से अधिक"
              : "Price: Low to High"}
          </option>

          <option value="high">
            {language === "Hindi"
              ? "कीमत: अधिक से कम"
              : "Price: High to Low"}
          </option>

          <option value="name">
            {language === "Hindi"
              ? "नाम: A से Z"
              : "Name: A to Z"}
          </option>
        </select>

        {/* CLEAR */}

        <button
          type="button"
          className="clear-filters-btn"
          onClick={clearFilters}
        >
          {language === "Hindi"
            ? "फ़िल्टर साफ़ करें"
            : "Clear Filters"}
        </button>

      </section>

      {/* =========================
          RESULTS INFO
      ========================= */}

      {!loading && !error && (
        <div
          className="products-results-info"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
            flexWrap: "wrap",
            margin: "0 0 22px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#81776e",
              fontSize: "11px",
            }}
          >
            {language === "Hindi"
              ? `${filteredProducts.length} प्रोडक्ट मिले`
              : `${filteredProducts.length} products found`}
          </p>

          {activeFilterCount > 0 && (
            <span
              style={{
                color: "#8a6245",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.7px",
              }}
            >
              {activeFilterCount}{" "}
              {language === "Hindi"
                ? "फ़िल्टर सक्रिय"
                : "FILTERS ACTIVE"}
            </span>
          )}
        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="no-products">

          <h2>
            {language === "Hindi"
              ? "प्रोडक्ट्स लोड हो रहे हैं..."
              : "Loading products..."}
          </h2>

        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {!loading && error && (
        <div className="no-products">

          <div className="no-products-icon">
            !
          </div>

          <h2>
            {error}
          </h2>

          <p>
            {language === "Hindi"
              ? "कृपया बाद में दोबारा कोशिश करें।"
              : "Please try again later."}
          </p>

        </div>
      )}

      {/* =========================
          PRODUCTS
      ========================= */}

      {!loading &&
        !error &&
        visibleProducts.length > 0 && (
          <section className="products-grid">

            {visibleProducts.map(
              (product) => (
                <ProductCard
                  key={
                    product._id ||
                    product.id
                  }
                  product={product}
                />
              )
            )}

          </section>
        )}

      {/* =========================
          NO PRODUCTS
      ========================= */}

      {!loading &&
        !error &&
        filteredProducts.length === 0 && (
          <div className="no-products">

            <div className="no-products-icon">
              ⌕
            </div>

            <h2>
              {language === "Hindi"
                ? "कोई प्रोडक्ट नहीं मिला"
                : "No products found"}
            </h2>

            <p>
              {language === "Hindi"
                ? "कोई दूसरा सर्च या कैटेगरी ट्राय करें।"
                : "Try another search or category."}
            </p>

            <button
              type="button"
              className="clear-filters-btn"
              onClick={
                clearFilters
              }
            >
              {language === "Hindi"
                ? "फ़िल्टर साफ़ करें"
                : "Clear Filters"}
            </button>

          </div>
        )}

      {/* =========================
          PAGINATION
      ========================= */}

      {!loading &&
        !error &&
        filteredProducts.length >
          PRODUCTS_PER_PAGE && (
          <div
            className="products-pagination"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              flexWrap: "wrap",
              marginTop: "35px",
            }}
          >

            {/* PREVIOUS */}

            <button
              type="button"
              disabled={
                safeCurrentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
              style={{
                minWidth: "38px",
                height: "38px",
                border:
                  "1px solid #d8cbbb",
                background:
                  safeCurrentPage === 1
                    ? "#eee8df"
                    : "#fffdf9",
                color:
                  safeCurrentPage === 1
                    ? "#aaa095"
                    : "#211e1b",
                cursor:
                  safeCurrentPage === 1
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              ←
            </button>

            {/* PAGE NUMBERS */}

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() =>
                  setCurrentPage(
                    page
                  )
                }
                style={{
                  minWidth: "38px",
                  height: "38px",
                  border:
                    "1px solid #d8cbbb",
                  background:
                    page ===
                    safeCurrentPage
                      ? "#211e1b"
                      : "#fffdf9",
                  color:
                    page ===
                    safeCurrentPage
                      ? "#fffdf9"
                      : "#211e1b",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {page}
              </button>
            ))}

            {/* NEXT */}

            <button
              type="button"
              disabled={
                safeCurrentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
              style={{
                minWidth: "38px",
                height: "38px",
                border:
                  "1px solid #d8cbbb",
                background:
                  safeCurrentPage ===
                  totalPages
                    ? "#eee8df"
                    : "#fffdf9",
                color:
                  safeCurrentPage ===
                  totalPages
                    ? "#aaa095"
                    : "#211e1b",
                cursor:
                  safeCurrentPage ===
                  totalPages
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              →
            </button>

          </div>
        )}

      {/* =========================
          PAGE INFO
      ========================= */}

      {!loading &&
        !error &&
        filteredProducts.length >
          PRODUCTS_PER_PAGE && (
          <p
            style={{
              margin:
                "14px 0 0",
              textAlign:
                "center",
              color:
                "#95897e",
              fontSize:
                "10px",
            }}
          >
            {language === "Hindi"
              ? `पेज ${safeCurrentPage} / ${totalPages}`
              : `Page ${safeCurrentPage} / ${totalPages}`}
          </p>
        )}

    </main>
  );
}

export default Products;