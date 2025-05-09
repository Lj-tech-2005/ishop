const { console } = require("inspector");
const { genrateUniqueName } = require("../helper");
const productmodel = require("../models/productmodels ");
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
            let products = null;
            const id = req.params.id
            if (id) {
                products = await productmodel.findById(id);


            } else {
                products = await productmodel.find().sort({ createdAt: -1 });

            }

            res.send({ msg: "product find", flag: 1, products, total: products.length })

        } catch (err) {


            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });

        }

    },
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
        console.log(req.params.id,"myid");
        console.log(req.files,"my files")
return

        try {

            const id = req.params.id;
            const images = req.files.image;

            console.log(id)
            console.log(image)

            const product = await productmodel.findById(id);

            if (!product) {
                return res.send({ msg: "Product not found", flag: 0 });
            }

            let allimages = product.images ?? [];
            let uploadPromise = [];

            for (let image of images) {
                const img = generateUniqueName(image.name);
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

    }

    // async update(req, res) {

    //     try {
    //         const id = req.params.id
    //         await categorymodel.findByIdAndUpdate(
    //             {
    //                 _id: id
    //             },
    //             {
    //                 name: req.body.name,
    //                 slug: req.body.slug
    //             }
    //         ).then(
    //             () => {

    //                 res.send({ msg: "category update successfully", flag: 1 });
    //             }
    //         ).catch(
    //             (error) => {

    //                 console.log(error)
    //                 res.send({ msg: "unable to update category", flag: 0 });
    //             }
    //         )

    //     } catch {
    //         res.status(500).send({ msg: 'Internal Server Error', flag: 0 });
    //     }


    // }

}


module.exports = productconntroller


