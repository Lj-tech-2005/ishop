
const { genrateUniqueName } = require("../helper");
const brandmodel = require("../models/brandmodels");
const fs = require("fs")

const brandController = {
    async create(req, res) {
        try {
            const { name, slug } = req.body;

            if (!name || !slug || !req.files || !req.files.brandImage) {
                return res.send({ msg: "Please fill all the fields", flag: 0 });
            }

            const brandImage = req.files.brandImage;
            const brand_image = genrateUniqueName(brandImage.name);
            const destinationPath = `./public/images/brand/${brand_image}`;

            // Move the image
            brandImage.mv(destinationPath, async (err) => {
                if (err) {
                    return res.send({ msg: "Unable to upload image", flag: 0 });
                }

                try {
                    // Check if brand already exists
                    const brandExists = await brandmodel.findOne({ name });

                    if (brandExists) {
                        return res.send({ msg: "Brand is already created", flag: 0 });
                    }

                    // Save new brand
                    const brand = new brandmodel({
                        name,
                        slug,
                        brandImage: brand_image
                    });

                    await brand.save();
                    return res.send({ msg: "Brand created successfully", flag: 1 });

                } catch (saveErr) {
                    console.error("Brand save error:", saveErr);
                    return res.send({ msg: "Brand unable to create", flag: 0 });
                }
            });

        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).send({ msg: "Internal Server Error", flag: 0 });
        }
    },
    async read(req, res) {

        try {
            let brand = null;
            const id = req.params.id;
            if (id) {

                brand = await brandmodel.findById(id);

            } else {

                brand = await brandmodel.find()

            }

            res.send({ msg: "brand find", flag: 1, brand });


        } catch (error) {

            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });
        }

    },
    async status(req, res) {

        try {
            const id = req.params.id
            const brand = await brandmodel.findById(id);

            if (brand) {

                await brandmodel.updateOne({ _id: id }, { $set: { status: !brand.status } }).then(

                    () => {
                        res.status(200).send({ msg: 'brand status updated', flag: 1 });
                    }

                ).catch(
                    (error) => {

                        res.send({ msg: 'unable to update brand status', flag: 0 });

                    }


                )

            } else {

                res.send({ msg: "brand not found", flag: 0 });

            }


        } catch (err) {

            console.log(err)
            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });

        }

    },
    async delete(req, res) {
        try {
            const id = req.params.id;
            const brand = await brandmodel.findById(id);

            if (!brand) {

                return res.status(404).send({ msg: 'brand not found', flag: 0 });
            }

            // Attempt to delete category from DB
            await brandmodel.deleteOne({ _id: id });

            // Construct file system path (relative to project root)
            const imagePath = `public/images/brand/${brand.brandImage}`;

            // Delete the image if it exists
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            res.status(200).send({ msg: 'brand deleted', flag: 1 });

        } catch (err) {

            console.log(err)
            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });
        }


    },
    async update(req, res) {
        try {
            const { name, slug } = req.body;
            const id = req.params.id;
            const file = req.files?.brandImage;

            // Input validation
            if (!name || !slug || !file) {
                return res.status(400).send({ msg: "Please fill all the fields", flag: 0 });
            }

            const brand = await brandmodel.findById(id);
            if (!brand) {
                return res.status(404).send({ msg: 'Brand not found', flag: 0 });
            }

            const imageName = genrateUniqueName(file.name); // your helper
            const destination = './public/images/brand/' + imageName;

            // Move file using callback
            file.mv(destination, async (err) => {
                if (err) {
                    console.error('File upload error:', err);
                    return res.status(500).send({ msg: 'Unable to upload image', flag: 0 });
                }

                // Delete old image if exists
                const oldImagePath = './public/images/brand/' + brand.brandImage;
                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                    } catch (unlinkErr) {
                        console.warn('Failed to delete old image:', unlinkErr);
                    }
                }

                // Prepare update data
                const updatedData = {
                    name,
                    slug,
                    brandImage: imageName
                };

                try {
                    await brandmodel.findByIdAndUpdate(id, updatedData);
                    return res.send({ msg: 'Brand updated successfully', flag: 1 });
                } catch (updateErr) {
                    console.error('DB update error:', updateErr);
                    return res.status(500).send({ msg: 'Unable to update brand', flag: 0 });
                }
            });

        } catch (error) {
            console.error('Unexpected error:', error);
            return res.status(500).send({ msg: 'Internal Server Error', flag: 0 });
        }
    }
};

module.exports = brandController;
