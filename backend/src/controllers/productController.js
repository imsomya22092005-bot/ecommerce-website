const Product = require('../models/productModel');
const Subscriber = require('../models/subscriberModel');
const { sendNewProductEmails } = require('../utils/emailService');

// CREATE PRODUCT

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        // Notify newsletter subscribers without delaying the product response.
        Subscriber.find({})
            .lean()
            .then((subscribers) => sendNewProductEmails(subscribers, product))
            .catch((error) => console.error('New product email notification error:', error));

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



// GET ALL PRODUCTS
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
            sort,
            page = 1,
            limit = 12
        } = req.query;


        // BUILD FILTER
        

        const query = {
            isActive: true
        };


        // Search by product name or brand
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


        // Category
        if (category) {
            query.category = category;
        }


        // Subcategory
        if (subcategory) {
            query.subcategory = subcategory;
        }


        // Gender
        if (gender) {
            query.gender = gender;
        }


        // Size
        if (size) {
            query.sizes = {
                $in: [size]
            };
        }


        // Color
        if (color) {
            query.colors = {
                $in: [color]
            };
        }


        // Price range discountPrice exists, use that as well

        if (minPrice || maxPrice) {
            query.$expr = {
                $and: []
            };

            if (minPrice) {
                query.$expr.$and.push({
                    $gte: [
                        {
                            $ifNull: ['$discountPrice', '$price']
                        },
                        Number(minPrice)
                    ]
                });
            }

            if (maxPrice) {
                query.$expr.$and.push({
                    $lte: [
                        {
                            $ifNull: ['$discountPrice', '$price']
                        },
                        Number(maxPrice)
                    ]
                });
            }
        }


        // PAGINATION

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.min(
            Math.max(Number(limit), 1),
            50
        );

        const skip = (pageNumber - 1) * limitNumber;


        let sortOption = {
            createdAt: -1
        };

        if (sort === 'price_asc') {
            sortOption = {
                price: 1
            };
        }

        else if (sort === 'price_desc') {
            sortOption = {
                price: -1
            };
        }

        else if (sort === 'name_asc') {
            sortOption = {
                name: 1
            };
        }

        else if (sort === 'name_desc') {
            sortOption = {
                name: -1
            };
        }

        else if (sort === 'rating_desc') {
            sortOption = {
                rating: -1
            };
        }

        else if (sort === 'newest') {
            sortOption = {
                createdAt: -1
            };
        }


       
        // GET PRODUCTS

        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);


        const total = await Product.countDocuments(query);

        const totalPages = Math.ceil(
            total / limitNumber
        );


       
        // RESPONSE

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

        console.error('Get products error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};


// GET SINGLE PRODUCT

const getProductById = async (req, res) => {
    try {

        const product = await Product.findOne({
            _id: req.params.id,
            isActive: true
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


// UPDATE PRODUCT

const updateProduct = async (req, res) => {
    try {

        const product = await Product.findByIdAndUpdate(
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



// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {

        const product = await Product.findByIdAndUpdate(
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
    updateProduct,
    deleteProduct
};