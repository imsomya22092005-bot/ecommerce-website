import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useLanguage } from "../LanguageContext";
import ProductCard from "../components/ProductCard";
import API_URL from "../api";

const PRODUCTS_PER_PAGE = 8;

/* =========================================================
   ONLY THESE CATEGORIES WILL BE SHOWN
========================================================= */

const ALLOWED_CATEGORIES = new Set([
  // Fashion
  "mens-shirts",
  "womens-dresses",
  "tops",

  // Beauty
  "beauty",
  "skin-care",
  "fragrances",

  // Footwear
  "mens-shoes",
  "womens-shoes",

  // Gadgets
  "smartphones",
  "laptops",
  "tablets",
  "mobile-accessories",

  // Sports
  "sports-accessories",

  // Furniture
  "furniture",

  // Home Accessories
  "home-decoration",
  "kitchen-accessories",

  // Accessories
  "mens-watches",
  "womens-watches",
  "sunglasses",
  "womens-bags",
  "womens-jewellery",
]);

/* =========================================================
   CATEGORY GROUP TITLES
========================================================= */

const GROUP_TITLES = {
  "mens-shoes||womens-shoes":
    "Footwear",

  "smartphones||laptops||tablets||mobile-accessories":
    "Gadgets",

  "beauty||skin-care||fragrances":
    "Beauty",

  "mens-shirts||womens-dresses||tops":
    "Fashion",

  "sports-accessories":
    "Sports",

  furniture:
    "Furniture",

  "home-decoration||kitchen-accessories":
    "Home Accessories",

  "mens-watches||womens-watches||sunglasses||womens-bags||womens-jewellery":
    "Accessories",
};

/* =========================================================
   GET GROUP TITLE
========================================================= */

function getGroupTitle(categories) {
  if (!categories.length) {
    return null;
  }

  const key =
    categories.join("||");

  return GROUP_TITLES[key] || null;
}

/* =========================================================
   PRODUCTS PAGE
========================================================= */

function Products() {
  const { language } =
    useLanguage();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  /* =======================================================
     URL VALUES
  ======================================================= */

  const getSearchFromURL = () =>
    searchParams.get("search") || "";

  const getCategoryFromURL = () =>
    searchParams.get("category") || "All";

  const getGroupedCategoriesFromURL = () => {
    const value =
      searchParams.get("categories");

    if (!value) {
      return [];
    }

    return value
      .split("||")
      .map((item) => item.trim())
      .filter(
        (item) =>
          item &&
          ALLOWED_CATEGORIES.has(
            item
          )
      );
  };

  const getSortFromURL = () =>
    searchParams.get("sort") ||
    "default";

  const getPageFromURL = () =>
    Math.max(
      1,
      Number(
        searchParams.get("page")
      ) || 1
    );

  /* =======================================================
     STATES
  ======================================================= */

  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [search, setSearch] =
    useState(
      getSearchFromURL()
    );

  const [category, setCategory] =
    useState(
      getCategoryFromURL()
    );

  const [
    groupedCategories,
    setGroupedCategories,
  ] = useState(
    getGroupedCategoriesFromURL()
  );

  const [sort, setSort] =
    useState(
      getSortFromURL()
    );

  const [
    currentPage,
    setCurrentPage,
  ] = useState(
    getPageFromURL()
  );

  const [
    pagination,
    setPagination,
  ] = useState({
    currentPage:
      getPageFromURL(),
    totalPages: 1,
    totalProducts: 0,
    limit:
      PRODUCTS_PER_PAGE,
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================================================
     SYNC STATE WITH URL
  ========================================================= */

  useEffect(() => {
    setSearch(
      getSearchFromURL()
    );

    const urlCategory =
      getCategoryFromURL();

    setCategory(
      ALLOWED_CATEGORIES.has(
        urlCategory
      )
        ? urlCategory
        : "All"
    );

    setGroupedCategories(
      getGroupedCategoriesFromURL()
    );

    setSort(
      getSortFromURL()
    );

    setCurrentPage(
      getPageFromURL()
    );
  }, [searchParams]);

  /* =========================================================
     LOAD ONLY ALLOWED CATEGORIES
  ========================================================= */

  useEffect(() => {
    const loadCategories =
      async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/api/products?limit=1000`
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Unable to load categories."
            );
          }

          const productList =
            Array.isArray(data)
              ? data
              : data.products || [];

          const uniqueCategories = [
            ...new Set(
              productList
                .map((product) =>
                  String(
                    product.category ||
                      ""
                  ).trim()
                )
                .filter(
                  (item) =>
                    ALLOWED_CATEGORIES.has(
                      item
                    )
                )
            ),
          ].sort((a, b) =>
            a.localeCompare(b)
          );

          setCategories(
            uniqueCategories
          );
        } catch (err) {
          console.error(
            "Category loading error:",
            err
          );
        }
      };

    loadCategories();
  }, []);

  /* =========================================================
     UPDATE URL
  ========================================================= */

  const updateURL = ({
    searchValue = search,
    categoryValue = category,
    groupedValue =
      groupedCategories,
    sortValue = sort,
    pageValue = currentPage,
  }) => {
    const params = {};

    if (searchValue.trim()) {
      params.search =
        searchValue.trim();
    }

    if (
      Array.isArray(
        groupedValue
      ) &&
      groupedValue.length > 0
    ) {
      params.categories =
        groupedValue
          .filter((item) =>
            ALLOWED_CATEGORIES.has(
              item
            )
          )
          .join("||");
    } else if (
      categoryValue &&
      categoryValue !== "All" &&
      ALLOWED_CATEGORIES.has(
        categoryValue
      )
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

  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          setLoading(true);
          setError("");

          /* =================================================
             GROUPED CATEGORY
          ================================================= */

          if (
            groupedCategories.length >
            0
          ) {
            const safeGroupedCategories =
              groupedCategories.filter(
                (item) =>
                  ALLOWED_CATEGORIES.has(
                    item
                  )
              );

            const responses =
              await Promise.all(
                safeGroupedCategories.map(
                  async (
                    backendCategory
                  ) => {
                    const response =
                      await fetch(
                        `${API_URL}/api/products?category=${encodeURIComponent(
                          backendCategory
                        )}&limit=1000`
                      );

                    const data =
                      await response.json();

                    if (!response.ok) {
                      throw new Error(
                        data.message ||
                          `Unable to load ${backendCategory}`
                      );
                    }

                    return Array.isArray(
                      data
                    )
                      ? data
                      : data.products ||
                          [];
                  }
                )
              );

            /* MERGE */

            const mergedProducts =
              responses.flat();

            /* REMOVE DUPLICATES */

            const uniqueProducts =
              Array.from(
                new Map(
                  mergedProducts.map(
                    (product) => [
                      product._id ||
                        product.id,
                      product,
                    ]
                  )
                ).values()
              );

            /* ALLOWED ONLY */

            let filteredProducts =
              uniqueProducts.filter(
                (product) =>
                  ALLOWED_CATEGORIES.has(
                    product.category
                  )
              );

            /* SEARCH */

            if (search.trim()) {
              const searchValue =
                search
                  .trim()
                  .toLowerCase();

              filteredProducts =
                filteredProducts.filter(
                  (product) =>
                    String(
                      product.name ||
                        ""
                    )
                      .toLowerCase()
                      .includes(
                        searchValue
                      )
                );
            }

            /* SORT */

            if (
              sort ===
              "price_asc"
            ) {
              filteredProducts.sort(
                (a, b) =>
                  Number(
                    a.price || 0
                  ) -
                  Number(
                    b.price || 0
                  )
              );
            }

            if (
              sort ===
              "price_desc"
            ) {
              filteredProducts.sort(
                (a, b) =>
                  Number(
                    b.price || 0
                  ) -
                  Number(
                    a.price || 0
                  )
              );
            }

            if (
              sort ===
              "name_asc"
            ) {
              filteredProducts.sort(
                (a, b) =>
                  String(
                    a.name || ""
                  ).localeCompare(
                    String(
                      b.name || ""
                    )
                  )
              );
            }

            if (
              sort ===
              "name_desc"
            ) {
              filteredProducts.sort(
                (a, b) =>
                  String(
                    b.name || ""
                  ).localeCompare(
                    String(
                      a.name || ""
                    )
                  )
              );
            }

            /* PAGINATION */

            const totalProducts =
              filteredProducts.length;

            const totalPages =
              Math.max(
                1,
                Math.ceil(
                  totalProducts /
                    PRODUCTS_PER_PAGE
                )
              );

            const safePage =
              Math.min(
                currentPage,
                totalPages
              );

            const startIndex =
              (safePage - 1) *
              PRODUCTS_PER_PAGE;

            const pageProducts =
              filteredProducts.slice(
                startIndex,
                startIndex +
                  PRODUCTS_PER_PAGE
              );

            setProducts(
              pageProducts
            );

            setPagination({
              currentPage:
                safePage,
              totalPages,
              totalProducts,
              limit:
                PRODUCTS_PER_PAGE,
            });

            if (
              safePage !==
              currentPage
            ) {
              setCurrentPage(
                safePage
              );
            }

            setLoading(false);

            return;
          }

          /* =================================================
             NORMAL PRODUCTS
          ================================================= */

          const params =
            new URLSearchParams();

          if (search.trim()) {
            params.set(
              "search",
              search.trim()
            );
          }

          if (
            category &&
            category !== "All" &&
            ALLOWED_CATEGORIES.has(
              category
            )
          ) {
            params.set(
              "category",
              category
            );
          }

          if (
            sort &&
            sort !== "default"
          ) {
            params.set(
              "sort",
              sort
            );
          }

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
                "Unable to load products."
            );
          }

          const productList =
            Array.isArray(data)
              ? data
              : data.products || [];

          /* FILTER OUT UNWANTED PRODUCTS */

          const allowedProducts =
            productList.filter(
              (product) =>
                ALLOWED_CATEGORIES.has(
                  product.category
                )
            );

          setProducts(
            allowedProducts
          );

          setPagination(
            data.pagination || {
              currentPage,
              totalPages: 1,
              totalProducts:
                allowedProducts.length,
              limit:
                PRODUCTS_PER_PAGE,
            }
          );

          setLoading(false);
        } catch (err) {
          console.error(
            "Product loading error:",
            err
          );

          setProducts([]);

          setError(
            err.message ||
              (language ===
              "Hindi"
                ? "प्रोडक्ट्स लोड नहीं हो सके।"
                : "Unable to load products.")
          );

          setLoading(false);
        }
      };

    fetchProducts();
  }, [
    search,
    category,
    groupedCategories,
    sort,
    currentPage,
    language,
  ]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchChange =
    (e) => {
      const value =
        e.target.value;

      setSearch(value);
      setCurrentPage(1);

      updateURL({
        searchValue: value,
        categoryValue: category,
        groupedValue:
          groupedCategories,
        sortValue: sort,
        pageValue: 1,
      });
    };

  /* =========================================================
     CATEGORY
  ========================================================= */

  const handleCategoryChange =
    (e) => {
      const value =
        e.target.value;

      setCategory(value);
      setGroupedCategories(
        []
      );
      setCurrentPage(1);

      updateURL({
        searchValue: search,
        categoryValue: value,
        groupedValue: [],
        sortValue: sort,
        pageValue: 1,
      });
    };

  /* =========================================================
     SORT
  ========================================================= */

  const handleSortChange =
    (e) => {
      const value =
        e.target.value;

      setSort(value);
      setCurrentPage(1);

      updateURL({
        searchValue: search,
        categoryValue: category,
        groupedValue:
          groupedCategories,
        sortValue: value,
        pageValue: 1,
      });
    };

  /* =========================================================
     PAGE
  ========================================================= */

  const handlePageChange =
    (page) => {
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
        groupedValue:
          groupedCategories,
        sortValue: sort,
        pageValue: page,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setGroupedCategories(
      []
    );
    setSort("default");
    setCurrentPage(1);

    setSearchParams({});
  };

  /* =========================================================
     FILTER COUNT
  ========================================================= */

  const activeFilterCount =
    (search.trim() ? 1 : 0) +
    (groupedCategories.length >
    0
      ? 1
      : category !== "All"
      ? 1
      : 0) +
    (sort !== "default"
      ? 1
      : 0);

  /* =========================================================
     PAGE NUMBERS
  ========================================================= */

  const totalPages =
    Math.max(
      1,
      Number(
        pagination.totalPages
      ) || 1
    );

  const getPageNumbers =
    () => {
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

      if (
        currentPage > 4
      ) {
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

      pages.push(
        totalPages
      );

      return pages;
    };

  /* =========================================================
     PAGE TITLE
  ========================================================= */

  const groupTitle =
    getGroupTitle(
      groupedCategories
    );

  const pageTitle =
    groupTitle ||
    (category !== "All"
      ? category
      : language ===
        "Hindi"
      ? "अपनी स्टाइल खोजें"
      : "Discover Your Style");

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="products-page">

      {/* HEADER */}

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
          {pageTitle}
        </h1>

        <p>
          {groupTitle
            ? language === "Hindi"
              ? `${pageTitle} के सभी प्रोडक्ट्स देखें।`
              : `Explore all products in ${pageTitle}.`
            : language === "Hindi"
            ? "हमारे खास चुने गए प्रोडक्ट्स का कलेक्शन देखें।"
            : "Explore our carefully selected collection of products."}
        </p>
      </section>

      {/* CONTROLS */}

      <section className="product-controls">

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

        <select
          value={
            groupedCategories.length >
            0
              ? "All"
              : category
          }
          onChange={
            handleCategoryChange
          }
        >
          <option value="All">
            {language === "Hindi"
              ? "सभी कैटेगरी"
              : "All Categories"}
          </option>

          {categories.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </select>

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

        {activeFilterCount > 0 && (
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

      {/* RESULT INFO */}

      {!loading && !error && (
        <div
          className="products-results-info"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
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
              ? `${pagination.totalProducts || 0} प्रोडक्ट मिले`
              : `${pagination.totalProducts || 0} products found`}
          </p>

          {groupTitle && (
            <span
              style={{
                color: "#8a6245",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.7px",
              }}
            >
              {groupTitle.toUpperCase()}
            </span>
          )}
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="no-products">
          <h2>
            {language === "Hindi"
              ? "प्रोडक्ट्स लोड हो रहे हैं..."
              : "Loading products..."}
          </h2>
        </div>
      )}

      {/* ERROR */}

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

      {/* PRODUCTS */}

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

      {/* NO PRODUCTS */}

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
              {groupTitle
                ? language === "Hindi"
                  ? `${groupTitle} में कोई प्रोडक्ट नहीं मिला।`
                  : `No products found in ${groupTitle}.`
                : language === "Hindi"
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

      {/* PAGINATION */}

      {!loading &&
        !error &&
        products.length > 0 &&
        totalPages > 1 && (
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

            <button
              type="button"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                handlePageChange(
                  currentPage - 1
                )
              }
            >
              ←
            </button>

            {getPageNumbers().map(
              (
                page,
                index
              ) => {
                if (
                  page === "..."
                ) {
                  return (
                    <span
                      key={`dots-${index}`}
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
                  >
                    {page}
                  </button>
                );
              }
            )}

            <button
              type="button"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                handlePageChange(
                  currentPage + 1
                )
              }
            >
              →
            </button>

          </div>
        )}

      {/* PAGE INFO */}

      {!loading &&
        !error &&
        products.length > 0 &&
        totalPages > 1 && (
          <p
            style={{
              margin: "14px 0 0",
              textAlign: "center",
              color: "#95897e",
              fontSize: "10px",
            }}
          >
            {language === "Hindi"
              ? `पेज ${currentPage} / ${totalPages}`
              : `Page ${currentPage} / ${totalPages}`}
          </p>
        )}

        {/* =====================================================
    BRAND STORY
===================================================== */}

<section className="brand-story-section">

  <div className="brand-story-inner">

    <div className="brand-story-label">
      <span className="brand-story-line"></span>

      <p className="section-label">
        {language === "Hindi"
          ? "हमारा नज़रिया"
          : "OUR PHILOSOPHY"}
      </p>
    </div>

    <div className="brand-story-content">

      <div className="brand-story-heading">
        <h2>
          {language === "Hindi"
            ? "शॉपिंग सिर्फ खरीदना नहीं है।"
            : "Shopping should feel"}
          <em>
            {language === "Hindi"
              ? " महसूस करना है।"
              : " effortless."}
          </em>
        </h2>
      </div>

      <div className="brand-story-copy">

        <p>
          {language === "Hindi"
            ? "ShopSphere को इस सोच के साथ बनाया गया है कि हर खरीदारी आसान, सुंदर और आपके लिए हो।"
            : "ShopSphere was created with a simple idea — shopping should be easy, inspiring and made to feel like you."}
        </p>

        <p>
          {language === "Hindi"
            ? "फैशन से लेकर रोज़मर्रा की essentials तक, हम ऐसी चीज़ें चुनते हैं जो आपकी lifestyle को बेहतर बनाएं।"
            : "From fashion to everyday essentials, we bring together products that fit naturally into modern everyday life."}
        </p>

        <Link
          to="/about"
          className="brand-story-link"
        >
          {language === "Hindi"
            ? "SHOPSPHERE के बारे में →"
            : "DISCOVER SHOPSPHERE →"}
        </Link>

      </div>

    </div>

    <div className="brand-story-signature">
      <span>01</span>

      <div className="brand-story-signature-line"></div>

      <span>
        SHOPSPHERE
      </span>
    </div>

  </div>

</section>

    </main>
  );
}

export default Products;