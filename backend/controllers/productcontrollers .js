
const { genrateUniqueName } = require("../helper");
const productmodel = require("../models/productmodels ");
const categorymodels = require("../models/categorymodels");
const brandmodels = require("../models/brandmodels");
const colormodels = require("../models/colormodels");
const fs = require("fs");




const productconntroller = {


    async create(req, res) {
        try {
            const { name, slug } = req.body;

            if (!name || !slug) {
                return res.send({ msg: "Please fill all the required fields", flag: 0 });
            }

            const existingProduct = await productmodel.findOne({ name });
            if (existingProduct) {
                return res.send({ msg: "Product already exists", flag: 0 });
            }

            const thumbnail = req.files?.thumbnail;
            if (!thumbnail) {
                return res.send({ msg: "Thumbnail image is required", flag: 0 });
            }

            // Clean optional fields
            if (req.body.brandId === "") delete req.body.brandId;
            if (req.body.categoryId === "") delete req.body.categoryId;

            // Parse colors
            if (!req.body.colors || req.body.colors === "[]" || req.body.colors === "") {
                delete req.body.colors;
            } else {
                req.body.colors = JSON.parse(req.body.colors);
            }

            // Generate unique filename but DON'T move it yet
            const imageName = genrateUniqueName(thumbnail.name);

            // Create product object with image name (file not saved yet)
            const product = new productmodel({
                ...req.body,
                thumbnail: imageName,
            });

            // 🧠 Save product to DB first
            await product.save();

            // ✅ If DB save successful, now move the image
            const destPath = `./public/images/product/${imageName}`;
            thumbnail.mv(destPath, (err) => {
                if (err) {
                    // Optional: Rollback product in DB if image fails
                    productmodel.findByIdAndDelete(product._id).catch(() => { });
                    return res.send({ msg: "Image upload failed. Product creation rolled back.", flag: 0 });
                }

                return res.send({ msg: "Product created successfully", flag: 1 });
            });

        } catch (error) {
            console.error(error);
            return res.send({ msg: "Internal Server Error", flag: 0, errmsg: error.message });
        }
    }
    ,
    async read(req, res) {
        try {
            const id = req.params.id;

            // 1. Get product by ID
            if (id) {
                const product = await productmodel.findById(id).populate(["categoryId", "colors", "brandId"]);
                if (!product) {
                    return res.send({ msg: "Product not found", products: null, total: 0, flag: 1 });
                }
                return res.send({ msg: "Product found", products: product, total: 1, flag: 1 });
            }

            // 2. Build filter
            const filterQuery = {};

            if (req.query.category) {
                const category = await categorymodels.findOne({ slug: req.query.category });
                if (category) {
                    filterQuery.categoryId = category._id;
                } else {
                    return res.send({ msg: "Category not found", products: [], total: 0, flag: 1 });
                }
            }

            if (req.query.brand) {
                const brand = await brandmodels.findOne({ slug: req.query.brand });
                if (brand) {
                    filterQuery.brandId = brand._id;
                } else {
                    return res.send({ msg: "Brand not found", products: [], total: 0, flag: 1 });
                }
            }

            if (req.query.color) {
                const color = await colormodels.findOne({ slug: req.query.color });
                if (color) {
                    filterQuery.colors = { $in: [color._id] };
                } else {
                    return res.send({ msg: "Color not found", products: [], total: 0, flag: 1 });
                }
            }

            if (req.query.minPrice || req.query.maxPrice) {
                const priceFilter = {};
                if (req.query.minPrice) priceFilter.$gte = parseFloat(req.query.minPrice);
                if (req.query.maxPrice) priceFilter.$lte = parseFloat(req.query.maxPrice);
                filterQuery.finalPrice = priceFilter;
            }

            // 3. Pagination logic
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const skip = (page - 1) * limit;

            // 4. Get total matching count
            const total = await productmodel.countDocuments(filterQuery);

            // 5. Get paginated products
            const products = await productmodel.find(filterQuery)
                .skip(skip)
                .limit(limit)
                .populate(["categoryId", "colors", "brandId"]);

            // 6. Return response
            res.send({
                msg: "Product found",
                products,
                total, // ✅ total matching count
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

            // Clean brandId and categoryId (Empty string means remove)
            if (req.body.brandId === "") delete req.body.brandId;
            if (req.body.categoryId === "") delete req.body.categoryId;

            // Clean colors
            if (!req.body.colors || req.body.colors === "[]" || req.body.colors === "") {
                delete req.body.colors;
            } else {
                req.body.colors = JSON.parse(req.body.colors);
            }

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

            const product = await productmodel.findById(id);
            if (!product) {
                return res.status(404).send({ msg: 'Product not found', flag: 0 });
            }

            const file = req.files?.thumbnail;

            const updatedData = {
                name,
                slug,
                shortDescription,
                longDescription,
                originalPrice,
                discountPercentage,
                finalPrice,
                categoryId,
                brandId,
                colors
            };

            if (file) {
                const imageName = genrateUniqueName(file.name);
                const destination = `./public/images/product/${imageName}`;

                // Move file
                await new Promise((resolve, reject) => {
                    file.mv(destination, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                // Delete old thumbnail
                if (product.thumbnail) {
                    const oldImagePath = `./public/images/product/${product.thumbnail}`;
                    if (fs.existsSync(oldImagePath)) {
                        try {
                            fs.unlinkSync(oldImagePath);
                        } catch (unlinkErr) {
                            console.error('Failed to delete old image:', unlinkErr);
                        }
                    }
                }

                updatedData.thumbnail = imageName;
            }

            await productmodel.findByIdAndUpdate(id, updatedData);
            return res.send({ msg: 'Product updated successfully', flag: 1 });

        } catch (error) {
            console.error("Update product error:", error);
            return res.status(500).send({ msg: 'Internal Server Error', flag: 0 });
        }
    },
    async deleteSingleImage(req, res) {
        try {
            const id = req.params.id;
            const { imageName } = req.body;

            const product = await productmodel.findById(id);
            if (!product) {
                return res.send({ msg: "Product not found", flag: 0 });
            }

            const updatedImages = product.images.filter(img => img !== imageName);
            await productmodel.findByIdAndUpdate(id, { images: updatedImages });

            const imgPath = `./public/images/product/${imageName}`;
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }

            return res.send({ msg: "Image deleted successfully", flag: 1 });
        } catch (error) {
            console.log(error);
            return res.send({ msg: "Internal server error", flag: 0 });
        }
    }





}




module.exports = productconntroller


