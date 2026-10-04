const Product = require('../models/productModel');

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            message: 'Product created successfully',
            product
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// const getProducts = async (req, res) => {
//     try {
//         const products = await Product.find();

//         res.status(200).json(products);

//     } catch (error) {
//         res.status(500).json({
//             message: 'Server error',
//             error: error.message
//         });
//     }
// };

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(400).json({
            message: 'Invalid product ID'
        });
    }
};

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
                message: 'Product not found'
            });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            message: 'Product deleted successfully'
        });

    } catch (error) {
        res.status(400).json({
            message: 'Invalid product ID'
        });
    }
};



const getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 12
        } = req.query;

        const query = {};

        if (search) {
            query.name = {
                $regex: search,
                $options: 'i'
            };
        }

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};

            if (minPrice) {
                query.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                query.price.$lte = Number(maxPrice);
            }
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        let sortOption = {};

        if (sort === 'price_asc') {
            sortOption.price = 1;
        } else if (sort === 'price_desc') {
            sortOption.price = -1;
        } else if (sort === 'name_asc') {
            sortOption.name = 1;
        } else if (sort === 'name_desc') {
            sortOption.name = -1;
        }

        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        const totalProducts = await Product.countDocuments(query);

        res.status(200).json({
            products,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(totalProducts / limitNumber),
                totalProducts,
                limit: limitNumber
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
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