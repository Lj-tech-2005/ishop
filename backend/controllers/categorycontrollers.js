const { genrateUniqueName } = require("../helper");
const categorymodel = require("../models/categorymodels");
const productmodel = require("../models/productmodels ");
const { param } = require("../routers/categoryrouters");
const fs = require("fs")


const categoryconntroller = {


    async create(req, res) {


        try {

            const { name, slug } = req.body
            if (!name || !slug || !req.files || !req.files.categoryImage) {

                return res.send({ msg: "please fill all the fields", flag: 0 });
            }


            const categoryImage = req.files.categoryImage;
            const categary_image = genrateUniqueName(categoryImage.name)
            const desntinationPath = `./public/images/category/${categary_image}`

            categoryImage.mv(

                desntinationPath,
                async (err) => {

                    if (err) {

                        return send({ msg: "unable to upload image" });
                    } else {

                        const categoryfind = await categorymodel.findOne({ name });

                        if (categoryfind) {

                            return res.send({ msg: "categary already created", flag: 0 });


                        }


                        const category = new categorymodel({ name, slug, categoryImage: categary_image });

                        category.save().then(
                            (res) => {

                                res.send({ msg: "category create successfully", flag: 1 })

                            }

                        ).catch(

                            (err) => {
                                console.log(err)

                                res.send({ msg: "category created successfully", flag: 1 });

                            }
                        )


                    }
                }
            )


        } catch (err) {


            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });

        }

    },
  async read(req, res) {
        try {
            const id = req.params.id;

            if (id) {
                const category = await categorymodel.findById(id);
                return res.send({ msg: "Category found successfully", flag: 1, categorys: category });
            }

            const categorys = await categorymodel.find().sort({ createdAt: -1 });
            const data = [];

            const allPromise = categorys.map(async (cat) => {
                const productCount = await productmodel.countDocuments({ categoryId: cat._id });
                data.push({
                    ...cat.toObject(),
                    productCount
                });
            });

            await Promise.all(allPromise);

            res.send({ msg: "Categories found successfully", flag: 1, categorys: data });
        } catch (error) {
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    }
    ,
    async delete(req, res) {
        try {
            const id = req.params.id;
            const category = await categorymodel.findById(id);

            if (!category) {
                return res.status(404).send({ msg: 'Category not found', flag: 0 });
            }

            // Attempt to delete category from DB
            await categorymodel.deleteOne({ _id: id });

            // Construct file system path (relative to project root)
            const imagePath = `public/images/category/${category.categoryImage}`;

            // Delete the image if it exists
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            res.status(200).send({ msg: 'Category deleted', flag: 1 });

        } catch (err) {

            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });
        }


    },
    async status(req, res) {

        console.log(req)

        try {
            const id = req.params.id
            const categorys = await categorymodel.findById(id);

            if (categorys) {

                await categorymodel.updateOne({ _id: id }, { $set: { status: !categorys.status } }).then(

                    () => {
                        res.status(200).send({ msg: 'category status updated', flag: 1 });
                    }

                ).catch(
                    (error) => {

                        res.send({ msg: 'unable to update category status', flag: 0 });

                    }


                )

            } else {

                res.send({ msg: "category not found", flag: 0 });

            }


        } catch (err) {

            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });

        }

    },
    async update(req, res) {

        try {


            const { name, slug } = req.body
            if (!name || !slug || !req.files || !req.files.categoryImage) {

                return res.send({ msg: "please fill all the fields", flag: 0 });
            }


            const id = req.params.id;
            const file = req.files?.categoryImage;

            const category = await categorymodel.findById(id);
            if (!category) {
                return res.status(404).send({ msg: 'Category not found', flag: 0 });
            }

            let updatedData = { name, slug };

            if (file) {
                const imageName = genrateUniqueName(file.name); // keep consistent with your helper
                const destination = `./public/images/category/${imageName}`;

                file.mv(destination, async (err) => {
                    if (err) {
                        return res.status(500).send({ msg: 'Unable to upload image', flag: 0 });
                    }

                    // Delete old image
                    const oldImagePath = `./public/images/category/${category.categoryImage}`;
                    if (fs.existsSync(oldImagePath)) {
                        try {
                            fs.unlinkSync(oldImagePath);
                        } catch (unlinkErr) {
                            console.warn('Failed to delete old image:', unlinkErr);
                        }
                    }

                    updatedData.categoryImage = imageName;

                    try {
                        await categorymodel.findByIdAndUpdate(id, updatedData);
                        res.send({ msg: 'Category updated successfully', flag: 1 });
                    } catch (updateErr) {
                        console.log(updateErr);
                        res.status(500).send({ msg: 'Unable to update category', flag: 0 });
                    }
                });
            } else {
                await categorymodel.findByIdAndUpdate(id, updatedData);
                res.send({ msg: 'Category updated successfully', flag: 1 });
            }

        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });
        }
    }

}


module.exports = categoryconntroller


