
const { genrateUniqueName } = require("../helper");
const productmodel = require("../models/productmodels ");
const categorymodels = require("../models/categorymodels");
const colormodels = require("../models/colormodels");
const fs = require("fs");




const productconntroller = {


    async create(req, res) {
        try {
            if (!req.body.name || !req.body.slug) {
                return res.send({ msg: "Please fill all the fields", flag: 0 })
            }
            const thumbnail = req.files.thumbnail;
            const image = genrateUniqueName(thumbnail.name);
            const desntinationPath = `./public/images/product/${image}`;
            thumbnail.mv(
                desntinationPath,
                async (err) => {
                    if (err) {
                        return res.send({ msg: "Unable to upload image", flag: 0 })
                    } else {
                        const findProduct = await productmodel.findOne({ name: req.body.name });
                        if (findProduct) {
                            return res.send({ msg: "Product already created", flag: 0 })
                        }

                        const product = new productmodel({
                            ...req.body,
                            thumbnail: image,
                            colors: JSON.parse(req.body.colors)
                        })
                        product.save().then(() => {
                            res.send({ msg: "Product created successfully", flag: 1 })
                        }).catch((err) => {
                            console.log(err)
                            res.send({ msg: "Unable to create product", flag: 0, errmsg: err.message })
                        })

                    }

                }
            )



        } catch (error) {
            res.send({ msg: "Internal Server Error", flag: 0 })

        }
    },
    async read(req, res) {
        try {
            const id = req.params.id;

            // Fetch single product by ID first
            if (id) {
                const product = await productmodel.findById(id).populate(["categoryId", "colors","brandId"]);
                if (!product) {
                    return res.send({ msg: "Product not found", products: null, total: 0, flag: 1 });
                }
                return res.send({ msg: "Product found", products: product, total: 1, flag: 1 });
            }

            // Build filter query
            const filterQuery = {};

            // Category Filter
            if (req.query.category) {
                const category = await categorymodels.findOne({ slug: req.query.category });
                if (category) {
                    filterQuery.categoryId = category._id;
                } else {
                    return res.send({ msg: "Category not found", products: [], total: 0, flag: 1 });
                }
            }

            // Color Filter
            if (req.query.color) {
                const color = await colormodels.findOne({ slug: req.query.color });
                if (color) {
                    filterQuery.colors = { $in: [color._id] };
                } else {
                    return res.send({ msg: "Color not found", products: [], total: 0, flag: 1 });
                }
            }

            // Price Filter
            if (req.query.minPrice || req.query.maxPrice) {
                const priceFilter = {};
                if (req.query.minPrice) priceFilter.$gte = parseFloat(req.query.minPrice);
                if (req.query.maxPrice) priceFilter.$lte = parseFloat(req.query.maxPrice);

                // Make sure you’re filtering on correct field name (price or finalPrice)
                filterQuery.finalPrice = priceFilter;
            }

            // Limit handling
            const limit = req.query.limit ? parseInt(req.query.limit) : 0;

            // Fetch filtered products
            const products = await productmodel.find(filterQuery).limit(limit).populate(["categoryId", "colors","brandId"]);

            // Response
            res.send({
                msg: "Product found",
                products,
                total: products.length,
                flag: 1
            });

        } catch (error) {
            console.error("Error in Product Read API:", error);
            res.status(500).send({ msg: "Internal Server Error", flag: 0 });
        }
    }

    ,
    async status(req, res) {

        try {
            const id = req.params.id
            const statusflag = req.body.flag
            let massage;
            const products = await productmodel.findById(id);

            if (products) {

                const productstatus = {};
                if (statusflag === 1) {

                    productstatus.stock = !products.stock
                    massage = "stock updated"

                } else if (statusflag === 2) {

                    productstatus.topSelling = !products.topSelling
                    massage = "Top selling updated"


                } else if (statusflag === 3) {

                    productstatus.status = !products.status
                    massage = "status updated"



                }

                await productmodel.updateOne(
                    { _id: id },

                    {
                        $set: productstatus


                    }

                ).then(

                    () => {
                        res.status(200).send({ msg: massage, flag: 1 });
                    }

                ).catch(
                    (error) => {

                        res.send({ msg: 'unable to update product status', flag: 0 });

                    }


                )

            } else {

                res.send({ msg: "product not found", flag: 0 });

            }


        } catch (err) {

            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });

        }

    },
    async delete(req, res) {
        try {
            const id = req.params.id;
            const product = await productmodel.findById(id);

            if (!product) {
                return res.status(404).send({ msg: 'product not found', flag: 0 });
            }

            // Attempt to delete category from DB
            await productmodel.deleteOne({ _id: id });

            // Construct file system path (relative to project root)
            const imagePath = `public/images/product/${product.thumbnail}`;

            // Delete the image if it exists
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            res.status(200).send({ msg: 'Product deleted successfully', flag: 1 });

        } catch (err) {

            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });
        }


    },
    async multiimages(req, res) {

        try {

            const id = req.params.id;
            const images = req.files.images;


            const product = await productmodel.findById(id);

            if (!product) {
                return res.send({ msg: "Product not found", flag: 0 });
            }

            let allimages = product.images ?? [];
            let uploadPromise = [];

            for (let image of images) {
                const img = genrateUniqueName(image.name);
                const desntinationPath = `./public/images/product/${img}`;
                allimages.push(img);
                uploadPromise.push(image.mv(desntinationPath));
            }

            await Promise.all(uploadPromise)
            await productmodel.updateOne(
                { _id: id },
                {
                    images: allimages
                }
            )
            await res.send({ msg: "Product Image Upload", flag: 1 })



        } catch (error) {
            console.log(error)
            res.send({ msg: "Internal Server Error", flag: 0 });
        }

    },
    async update(req, res) {
        try {
            const id = req.params.id;
            const {
                name,
                slug,
                shortDescription,
                longDescription,
                originalPrice,
                discountPercentage,
                finalPrice,
                categoryId,
                colors,
                brandId
            } = req.body;

            const file = req.files?.thumbnail;

            const product = await productmodel.findById(id);
            if (!product) {
                return res.status(404).send({ msg: 'Product not found', flag: 0 });
            }

            let updatedData = {
                name,
                slug,
                shortDescription,
                longDescription,
                originalPrice,
                discountPercentage,
                finalPrice,
                categoryId,
                brandId,
                colors: JSON.parse(colors) // make sure to parse if sent as string
            };

            if (file) {
                const imageName = genrateUniqueName(file.name);
                const destination = `./public/images/product/${imageName}`;

                file.mv(destination, async (err) => {
                    if (err) {
                        return res.status(500).send({ msg: 'Unable to upload image', flag: 0 });
                    }

                    // Delete old image
                    const oldImagePath = `./public/images/product/${product.thumbnail}`;
                    if (fs.existsSync(oldImagePath)) {
                        try {
                            fs.unlinkSync(oldImagePath);
                        } catch (unlinkErr) {
                            console.error('Failed to delete old image:', unlinkErr);
                        }
                    }

                    updatedData.thumbnail = imageName;

                    try {
                        await productmodel.findByIdAndUpdate(id, updatedData);
                        return res.send({ msg: 'Product updated successfully', flag: 1 });
                    } catch (updateErr) {
                        console.error(updateErr);
                        return res.status(500).send({ msg: 'Unable to update product', flag: 0 });
                    }
                });
            } else {
                await productmodel.findByIdAndUpdate(id, updatedData);
                return res.send({ msg: 'Product updated successfully', flag: 1 });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });
        }
    }


}




module.exports = productconntroller


