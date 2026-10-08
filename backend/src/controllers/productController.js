const Product = require('../models/productModel');

const normalizeText = (value) => {
    return String(value || '')
        .toLowerCase()
        .trim()
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ');
};

const getSellingPrice = (product) => {
    return product.discountPrice ?? product.price;
};

const hasStock = (product) => {

    if (
        Array.isArray(product.variants) &&
        product.variants.length > 0
    ) {
        return product.variants.some(
            variant => Number(variant.stock) > 0
        );
    }

    return Number(product.stock) > 0;
};

const outfitRules = {

    tshirt: [
        'jeans',
        'cargo',
        'trousers',
        'pants',
        'shorts',
        'sneakers',
        'cap'
    ],

    't shirt': [
        'jeans',
        'cargo',
        'trousers',
        'pants',
        'shorts',
        'sneakers',
        'cap'
    ],

    't-shirts': [
        'jeans',
        'cargo',
        'trousers',
        'pants',
        'shorts',
        'sneakers',
        'cap'
    ],

    shirt: [
        'jeans',
        'trousers',
        'pants',
        'chinos',
        'loafers',
        'sneakers',
        'belt'
    ],

    jeans: [
        'tshirt',
        't shirt',
        'shirt',
        'hoodie',
        'sneakers',
        'boots',
        'belt',
        'cap'
    ],

    cargo: [
        'tshirt',
        't shirt',
        'hoodie',
        'sneakers',
        'cap'
    ],

    'cargo pants': [
        'tshirt',
        't shirt',
        'hoodie',
        'sneakers',
        'cap'
    ],

    trousers: [
        'shirt',
        'tshirt',
        't shirt',
        'loafers',
        'sneakers',
        'belt'
    ],

    pants: [
        'shirt',
        'tshirt',
        't shirt',
        'hoodie',
        'sneakers',
        'belt'
    ],

    shorts: [
        'tshirt',
        't shirt',
        'hoodie',
        'sneakers',
        'cap',
        'socks'
    ],

    hoodie: [
        'jeans',
        'cargo',
        'cargo pants',
        'joggers',
        'sneakers',
        'cap'
    ],

    joggers: [
        'tshirt',
        't shirt',
        'hoodie',
        'sneakers',
        'socks'
    ],

    sneakers: [
        'jeans',
        'cargo',
        'cargo pants',
        'shorts',
        'joggers',
        'tshirt',
        't shirt',
        'cap',
        'socks'
    ],

    shoes: [
        'jeans',
        'trousers',
        'shorts',
        'tshirt',
        'shirt',
        'socks'
    ],

    socks: [
        'sneakers',
        'shoes',
        'shorts',
        'joggers'
    ],

    dress: [
        'heels',
        'sandals',
        'handbag',
        'bag',
        'jewelry',
        'earrings'
    ],

    heels: [
        'dress',
        'skirt',
        'trousers',
        'handbag',
        'bag'
    ],

    skirt: [
        'tshirt',
        't shirt',
        'shirt',
        'heels',
        'sandals',
        'handbag'
    ],

    jacket: [
        'tshirt',
        't shirt',
        'shirt',
        'jeans',
        'cargo',
        'trousers',
        'sneakers',
        'boots',
        'cap'
    ],

    coat: [
        'shirt',
        'tshirt',
        't shirt',
        'jeans',
        'trousers',
        'boots',
        'bag'
    ],

    cap: [
        'tshirt',
        't shirt',
        'hoodie',
        'jeans',
        'cargo',
        'sneakers'
    ],

    belt: [
        'jeans',
        'trousers',
        'pants',
        'shirt'
    ],

    handbag: [
        'dress',
        'skirt',
        'heels',
        'sandals'
    ],

    bag: [
        'dress',
        'shirt',
        'hoodie',
        'jeans',
        'trousers',
        'sneakers'
    ]
};


const getProductType = (product) => {

    const subcategory = normalizeText(product.subcategory);
    const category = normalizeText(product.category);
    const name = normalizeText(product.name);

    const values = [
        subcategory,
        category,
        name
    ];

    if (
        values.some(value =>
            value.includes('t shirt') ||
            value.includes('tshirt') ||
            value.includes('tee')
        )
    ) {
        return 'tshirt';
    }

    if (
        values.some(value =>
            value.includes('cargo')
        )
    ) {
        return 'cargo';
    }

    if (
        values.some(value =>
            value.includes('jean')
        )
    ) {
        return 'jeans';
    }

    if (
        values.some(value =>
            value.includes('trouser')
        )
    ) {
        return 'trousers';
    }

    if (
        values.some(value =>
            value.includes('short')
        )
    ) {
        return 'shorts';
    }

    if (
        values.some(value =>
            value.includes('jogger')
        )
    ) {
        return 'joggers';
    }

    if (
        values.some(value =>
            value.includes('hoodie')
        )
    ) {
        return 'hoodie';
    }

    if (
        values.some(value =>
            value.includes('shirt')
        )
    ) {
        return 'shirt';
    }

    if (
        values.some(value =>
            value.includes('sneaker')
        )
    ) {
        return 'sneakers';
    }

    if (
        values.some(value =>
            value.includes('sock')
        )
    ) {
        return 'socks';
    }

    if (
        values.some(value =>
            value.includes('dress')
        )
    ) {
        return 'dress';
    }

    if (
        values.some(value =>
            value.includes('heel')
        )
    ) {
        return 'heels';
    }

    if (
        values.some(value =>
            value.includes('skirt')
        )
    ) {
        return 'skirt';
    }

    if (
        values.some(value =>
            value.includes('jacket')
        )
    ) {
        return 'jacket';
    }

    if (
        values.some(value =>
            value.includes('coat')
        )
    ) {
        return 'coat';
    }

    if (
        values.some(value =>
            value.includes('cap')
        )
    ) {
        return 'cap';
    }

    if (
        values.some(value =>
            value.includes('belt')
        )
    ) {
        return 'belt';
    }

    if (
        values.some(value =>
            value.includes('handbag')
        )
    ) {
        return 'handbag';
    }

    if (
        values.some(value =>
            value.includes('bag')
        )
    ) {
        return 'bag';
    }

    return subcategory || category;
};

const getProducts = async (req, res) => {

    try {

        const {
            search,
            category,
            subcategory,
            gender,
            size,
            color,
            minPrice,
            maxPrice,
            sort = 'newest',
            page = 1,
            limit = 20
        } = req.query;


        const query = {
            isActive: true
        };

        if (search) {

            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    brand: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }


        if (category) {
            query.category = {
                $regex: `^${category}$`,
                $options: 'i'
            };
        }


        if (subcategory) {
            query.subcategory = {
                $regex: `^${subcategory}$`,
                $options: 'i'
            };
        }


        if (gender) {
            query.gender = gender;
        }

        if (size) {
            query.sizes = {
                $in: [size]
            };
        }

        if (color) {
            query.colors = {
                $in: [color]
            };
        }

        if (minPrice || maxPrice) {

            query.$expr = {
                $and: [
                    ...(minPrice
                        ? [{
                            $gte: [
                                {
                                    $ifNull: [
                                        '$discountPrice',
                                        '$price'
                                    ]
                                },
                                Number(minPrice)
                            ]
                        }]
                        : []),

                    ...(maxPrice
                        ? [{
                            $lte: [
                                {
                                    $ifNull: [
                                        '$discountPrice',
                                        '$price'
                                    ]
                                },
                                Number(maxPrice)
                            ]
                        }]
                        : [])
                ]
            };
        }


        const pageNumber = Math.max(
            Number(page),
            1
        );

        const limitNumber = Math.min(
            Math.max(Number(limit), 1),
            50
        );

        const skip =
            (pageNumber - 1) * limitNumber;


        /*
         * Sorting.
         */

        let sortOption = {
            createdAt: -1
        };


        if (sort === 'price_asc') {

            sortOption = {
                price: 1
            };

        } else if (sort === 'price_desc') {

            sortOption = {
                price: -1
            };

        } else if (sort === 'name_asc') {

            sortOption = {
                name: 1
            };

        } else if (sort === 'name_desc') {

            sortOption = {
                name: -1
            };

        } else if (sort === 'rating_desc') {

            sortOption = {
                rating: -1
            };

        } else if (sort === 'newest') {

            sortOption = {
                createdAt: -1
            };
        }

        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);


        const total =
            await Product.countDocuments(query);


        const totalPages = Math.ceil(
            total / limitNumber
        );


        res.status(200).json({
            success: true,

            products,

            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                pages: totalPages
            }
        });

    } catch (error) {

        console.error(
            'Get products error:',
            error
        );

        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            isActive: true
        }).populate({
            path: 'relatedProducts',
            match: {
                isActive: true
            }
        });


        if (!product) {

            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }


        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: 'Invalid product ID'
        });
    }
};

//  COMPLETE THE LOOK


const getCompleteLook = async (req, res) => {

    try {
        const product = await Product.findOne({
            _id: req.params.id,
            isActive: true
        }).populate({
            path: 'relatedProducts',
            match: {
                isActive: true
            }
        });


        if (!product) {

            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        let recommendations = Array.isArray(
            product.relatedProducts
        )
            ? product.relatedProducts.filter(
                item =>
                    item &&
                    item._id.toString() !==
                    product._id.toString() &&
                    hasStock(item)
            )
            : [];

        const recommendationIds =
            new Set(
                recommendations.map(
                    item => item._id.toString()
                )
            );

        if (recommendations.length < 3) {

            const mainType =
                getProductType(product);


            const compatibleTypes =
                outfitRules[mainType] || [];

            const candidates =
                await Product.find({
                    isActive: true,

                    _id: {
                        $ne: product._id,
                        $nin: recommendations.map(
                            item => item._id
                        )
                    }
                })
                    .limit(100);


            const scoredCandidates =
                candidates.map(candidate => {

                    let score = 0;


                    const candidateType =
                        getProductType(candidate);


                    const candidateCategory =
                        normalizeText(
                            candidate.category
                        );


                    const candidateSubcategory =
                        normalizeText(
                            candidate.subcategory
                        );


                    const mainCategory =
                        normalizeText(
                            product.category
                        );


                    const mainSubcategory =
                        normalizeText(
                            product.subcategory
                        );

                    if (
                        candidate._id.toString() ===
                        product._id.toString()
                    ) {
                        return {
                            product: candidate,
                            score: -999
                        };
                    }

                    if (!candidate.isActive) {
                        return {
                            product: candidate,
                            score: -999
                        };
                    }

                    if (!hasStock(candidate)) {
                        return {
                            product: candidate,
                            score: -999
                        };
                    }

                    if (
                        candidateSubcategory &&
                        mainSubcategory &&
                        candidateSubcategory ===
                        mainSubcategory
                    ) {

                        return {
                            product: candidate,
                            score: -999
                        };
                    }

                    if (
                        candidate.gender === product.gender ||
                        candidate.gender === 'Unisex' ||
                        product.gender === 'Unisex'
                    ) {
                        score += 20;
                    } else {
                        return {
                            product: candidate,
                            score: -999
                        };
                    }

                    if (
                        compatibleTypes.includes(
                            candidateType
                        )
                    ) {
                        score += 60;
                    }

                    if (
                        candidateCategory !==
                        mainCategory
                    ) {
                        score += 10;
                    }

                    const mainPrice =
                        getSellingPrice(product);

                    const candidatePrice =
                        getSellingPrice(candidate);


                    if (
                        mainPrice > 0 &&
                        candidatePrice > 0
                    ) {

                        const ratio =
                            candidatePrice /
                            mainPrice;


                        if (
                            ratio >= 0.25 &&
                            ratio <= 3
                        ) {
                            score += 10;
                        }
                    }

                    if (
                        Number(candidate.rating) >= 4
                    ) {
                        score += 5;
                    }

                    if (
                        normalizeText(candidate.brand) ===
                        normalizeText(product.brand)
                    ) {
                        score += 3;
                    }

                    return {
                        product: candidate,
                        score
                    };
                });

            scoredCandidates.sort(
                (a, b) =>
                    b.score - a.score
            );

            for (
                const candidate of scoredCandidates
            ) {
                if (
                    recommendations.length >= 3
                ) {
                    break;
                }

                if (
                    candidate.score < 20
                ) {
                    continue;
                }

                const candidateId =
                    candidate.product._id.toString();

                if (
                    recommendationIds.has(
                        candidateId
                    )
                ) {
                    continue;
                }

                recommendations.push(
                    candidate.product
                );

                recommendationIds.add(
                    candidateId
                );
            }
        }

        const finalProducts = [product, ...recommendations]
            .filter(Boolean)
            .filter(item => {

                if (
                    item._id.toString() ===
                    product._id.toString()
                ) {
                    return true;
                }

                return (
                    item.isActive &&
                    hasStock(item)
                );
            });

        const uniqueProducts = [];
        const seenIds = new Set();

        for (const item of finalProducts) {
            const id =
                item._id.toString();

            if (seenIds.has(id)) {
                continue;
            }

            seenIds.add(id);
            uniqueProducts.push(item);
        }

        const products =
            uniqueProducts.slice(0, 4);

        const totalAmount =
            products.reduce(
                (total, item) => {
                    return (
                        total + getSellingPrice(item)
                    );
                },
                0
            );

        const originalAmount =
            products.reduce(
                (total, item) => {
                    return (
                        total + Number(item.price)
                    );
                },
                0
            );

        const totalSavings =
            Number(
                (originalAmount - totalAmount).toFixed(2)
            );

        res.status(200).json({
            success: true,
            title: 'Complete the Look',
            products,

            pricing: {
                originalAmount:
                    Number(
                        originalAmount.toFixed(2)
                    ),

                totalAmount:
                    Number(totalAmount.toFixed(2))
                , totalSavings
            }
        });

    } catch (error) {
        console.error(
            'Get complete look error:',
            error
        );

        res.status(500).json({
            success: false,
            message: 'Failed to load complete look',
            error: error.message
        });
    }
};


const createProduct = async (req, res) => {
    try {
        const product =
            await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        if (
            Array.isArray(
                req.body.relatedProducts
            )
        ) {
            req.body.relatedProducts =
                req.body.relatedProducts.filter(
                    id =>
                        id.toString() !==
                        req.params.id.toString()
                );
        }

        const product =
            await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product =
            await Product.findByIdAndUpdate(
                req.params.id,
                {
                    isActive: false
                },
                {
                    new: true
                }
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product removed successfully'
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: 'Invalid product ID'
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    getCompleteLook,
    updateProduct,
    deleteProduct
};