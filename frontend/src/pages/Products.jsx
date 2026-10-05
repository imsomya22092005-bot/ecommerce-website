import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import ProductCard from "../components/ProductCard";
import API_URL from "../api";

const PRODUCTS_PER_PAGE = 8;

function Products() {
  const { language } = useLanguage();

  const [searchParams, setSearchParams] =
    useSearchParams();

  // =========================
  // URL VALUES
  // =========================

  const initialSearch =
    searchParams.get("search") || "";

  const initialCategory =
    searchParams.get("category") || "All";

  const initialSort =
    searchParams.get("sort") || "default";

  const initialPage = Math.max(
    1,
    Number(searchParams.get("page")) || 1
  );

  // =========================
  // STATES
  // =========================

  const [products, setProducts] =
    useState([]);

  const [pagination, setPagination] =
    useState({
      currentPage: initialPage,
      totalPages: 1,
      totalProducts: 0,
      limit: PRODUCTS_PER_PAGE,
    });

  const [search, setSearch] =
    useState(initialSearch);

  const [category, setCategory] =
    useState(initialCategory);

  const [sort, setSort] =
    useState(initialSort);

  const [currentPage, setCurrentPage] =
    useState(initialPage);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // UPDATE URL
  // =========================

  const updateURL = ({
    searchValue = search,
    categoryValue = category,
    sortValue = sort,
    pageValue = currentPage,
  }) => {
    const params = {};

    if (searchValue.trim()) {
      params.search =
        searchValue.trim();
    }

    if (
      categoryValue &&
      categoryValue !== "All"
    ) {
      params.category =
        categoryValue;
    }

    if (
      sortValue &&
      sortValue !== "default"
    ) {
      params.sort =
        sortValue;
    }

    if (pageValue > 1) {
      params.page =
        String(pageValue);
    }

    setSearchParams(params);
  };

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          setLoading(true);
          setError("");

          const params =
            new URLSearchParams();

          // Search
          if (search.trim()) {
            params.set(
              "search",
              search.trim()
            );
          }

          // Category
          if (
            category &&
            category !== "All"
          ) {
            params.set(
              "category",
              category
            );
          }

          // Backend sort values
          if (
            sort &&
            sort !== "default"
          ) {
            params.set(
              "sort",
              sort
            );
          }

          // Backend pagination
          params.set(
            "page",
            String(currentPage)
          );

          params.set(
            "limit",
            String(
              PRODUCTS_PER_PAGE
            )
          );

          const response =
            await fetch(
              `${API_URL}/api/products?${params.toString()}`
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                (language ===
                "Hindi"
                  ? "प्रोडक्ट्स लोड नहीं हो सके।"
                  : "Unable to load products.")
            );
          }

          const productList =
            Array.isArray(data)
              ? data
              : data.products || [];

          setProducts(productList);

          // Backend pagination response
          if (data.pagination) {
            setPagination(
              data.pagination
            );
          } else {
            setPagination({
              currentPage,
              totalPages: 1,
              totalProducts:
                productList.length,
              limit:
                PRODUCTS_PER_PAGE,
            });
          }
        } catch (err) {
          console.error(
            "Error fetching products:",
            err
          );

          setProducts([]);

          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalProducts: 0,
            limit:
              PRODUCTS_PER_PAGE,
          });

          setError(
            err.message ||
              (language ===
              "Hindi"
                ? "प्रोडक्ट्स लोड नहीं हो सके।"
                : "Unable to load products.")
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, [
    search,
    category,
    sort,
    currentPage,
    language,
  ]);

  // =========================
  // SEARCH CHANGE
  // =========================

  const handleSearchChange = (
    e
  ) => {
    const value =
      e.target.value;

    setSearch(value);

    setCurrentPage(1);

    updateURL({
      searchValue: value,
      categoryValue: category,
      sortValue: sort,
      pageValue: 1,
    });
  };

  // =========================
  // CATEGORY CHANGE
  // =========================

  const handleCategoryChange =
    (e) => {
      const value =
        e.target.value;

      setCategory(value);
      setCurrentPage(1);

      updateURL({
        searchValue: search,
        categoryValue: value,
        sortValue: sort,
        pageValue: 1,
      });
    };

  // =========================
  // SORT CHANGE
  // =========================

  const handleSortChange = (
    e
  ) => {
    const value =
      e.target.value;

    setSort(value);
    setCurrentPage(1);

    updateURL({
      searchValue: search,
      categoryValue: category,
      sortValue: value,
      pageValue: 1,
    });
  };

  // =========================
  // PAGE CHANGE
  // =========================

  const handlePageChange = (
    page
  ) => {
    if (
      page < 1 ||
      page >
        pagination.totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    updateURL({
      searchValue: search,
      categoryValue: category,
      sortValue: sort,
      pageValue: page,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

  // =========================
  // TOTAL PAGES
  // =========================

  const totalPages =
    Math.max(
      1,
      Number(
        pagination.totalPages
      ) || 1
    );

  // =========================
  // GENERATE PAGE NUMBERS
  // =========================

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start =
      Math.max(
        2,
        currentPage - 1
      );

    const end =
      Math.min(
        totalPages - 1,
        currentPage + 1
      );

    for (
      let i = start;
      i <= end;
      i++
    ) {
      pages.push(i);
    }

    if (
      currentPage <
      totalPages - 3
    ) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  // =========================
  // UI
  // =========================

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
            ? "हमारे खास चुने गए प्रोडक्ट्स का कलेक्शन देखें।"
            : "Explore our carefully selected collection of products."}
        </p>
      </section>

      {/* =========================
          CONTROLS
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
          onChange={
            handleSearchChange
          }
        />

        {/* CATEGORY */}

        <select
          value={category}
          onChange={
            handleCategoryChange
          }
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
          onChange={
            handleSortChange
          }
        >
          <option value="default">
            {language === "Hindi"
              ? "क्रम से देखें"
              : "Sort By"}
          </option>

          <option value="price_asc">
            {language === "Hindi"
              ? "कीमत: कम से अधिक"
              : "Price: Low to High"}
          </option>

          <option value="price_desc">
            {language === "Hindi"
              ? "कीमत: अधिक से कम"
              : "Price: High to Low"}
          </option>

          <option value="name_asc">
            {language === "Hindi"
              ? "नाम: A से Z"
              : "Name: A to Z"}
          </option>

          <option value="name_desc">
            {language === "Hindi"
              ? "नाम: Z से A"
              : "Name: Z to A"}
          </option>
        </select>

        {/* CLEAR */}

        {activeFilterCount >
          0 && (
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
        )}

      </section>

      {/* =========================
          RESULT INFO
      ========================= */}

      {!loading && !error && (
        <div
          className="products-results-info"
          style={{
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            gap: "15px",
            flexWrap: "wrap",
            margin:
              "0 0 22px",
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
              ? `${pagination.totalProducts || 0} प्रोडक्ट मिले`
              : `${pagination.totalProducts || 0} products found`}
          </p>

          {activeFilterCount >
            0 && (
            <span
              style={{
                color:
                  "#8a6245",
                fontSize:
                  "10px",
                fontWeight:
                  700,
                letterSpacing:
                  "0.7px",
              }}
            >
              {
                activeFilterCount
              }{" "}
              {language ===
              "Hindi"
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
          PRODUCTS
      ========================= */}

      {!loading &&
        !error &&
        products.length > 0 && (
          <section className="products-grid">

            {products.map(
              (product) => (
                <ProductCard
                  key={
                    product._id ||
                    product.id
                  }
                  product={
                    product
                  }
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
        products.length === 0 && (
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
                ? "कोई दूसरा search या category try करें।"
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
        products.length > 0 &&
        totalPages > 1 && (
          <div
            className="products-pagination"
            style={{
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              gap: "7px",
              flexWrap:
                "wrap",
              marginTop:
                "35px",
            }}
          >

            {/* PREVIOUS */}

            <button
              type="button"
              disabled={
                currentPage ===
                1
              }
              onClick={() =>
                handlePageChange(
                  currentPage -
                    1
                )
              }
              style={{
                minWidth:
                  "38px",
                height:
                  "38px",
                border:
                  "1px solid #d8cbbb",
                background:
                  currentPage ===
                  1
                    ? "#eee8df"
                    : "#fffdf9",
                color:
                  currentPage ===
                  1
                    ? "#aaa095"
                    : "#211e1b",
                cursor:
                  currentPage ===
                  1
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              ←
            </button>

            {/* PAGE NUMBERS */}

            {getPageNumbers().map(
              (page, index) => {
                if (
                  page ===
                  "..."
                ) {
                  return (
                    <span
                      key={`dots-${index}`}
                      style={{
                        minWidth:
                          "25px",
                        textAlign:
                          "center",
                        color:
                          "#95897e",
                        fontSize:
                          "12px",
                      }}
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      handlePageChange(
                        page
                      )
                    }
                    style={{
                      minWidth:
                        "38px",
                      height:
                        "38px",
                      border:
                        "1px solid #d8cbbb",
                      background:
                        page ===
                        currentPage
                          ? "#211e1b"
                          : "#fffdf9",
                      color:
                        page ===
                        currentPage
                          ? "#fffdf9"
                          : "#211e1b",
                      cursor:
                        "pointer",
                      fontSize:
                        "11px",
                      fontWeight:
                        700,
                    }}
                  >
                    {page}
                  </button>
                );
              }
            )}

            {/* NEXT */}

            <button
              type="button"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                handlePageChange(
                  currentPage +
                    1
                )
              }
              style={{
                minWidth:
                  "38px",
                height:
                  "38px",
                border:
                  "1px solid #d8cbbb",
                background:
                  currentPage ===
                  totalPages
                    ? "#eee8df"
                    : "#fffdf9",
                color:
                  currentPage ===
                  totalPages
                    ? "#aaa095"
                    : "#211e1b",
                cursor:
                  currentPage ===
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
        products.length > 0 &&
        totalPages > 1 && (
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
              ? `पेज ${currentPage} / ${totalPages}`
              : `Page ${currentPage} / ${totalPages}`}
          </p>
        )}

    </main>
  );
}

export default Products;