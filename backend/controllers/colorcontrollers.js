
const colormodel = require("../models/colormodels");
const colorcontroller = {

    async create(req, res) {


        try {

            if (!req.body.name || !req.body.slug || !req.body.Hexcode) {
                return res.send({ msg: "please fill all the fields", flag: 0 });

            }


            const findcolor = await colormodel.findOne({ name: req.body.name });
            if (findcolor) {
                return res.send({ msg: "this color is already created", flag: 0 })
            }

            const color = new colormodel({

                name: req.body.name,
                Hexcode: req.body.Hexcode,
                slug: req.body.slug

            });

            color.save().then(
                () => {

                    return res.send({ msg: "color created successfully", flag: 1 })

                }

            ).catch(

                () => {

                    return res.send({ msg: "unable to create color", flag: 0 })

                }

            )



        } catch (error) {


            console.log(error)
            return res.status(500).send({ msg: "Internal server error", flag: 0 })

        }


    },
    async read(req, res) {


        try {
            let colors = null;
            const id = req.params.id
            if (id) {

                colors = await colormodel.findById(id);


            } else {

                colors = await colormodel.find();

            }



            res.send({ msg: "color find", flag: 1, colors, total: colors.length })


        } catch (error) {

            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });

        }





    },
    async delete(req, res) {

        try {

            const colorid = req.params.id
            const colors = await colormodel.findById(colorid)
            if (colors) {

                await colormodel.deleteOne({ _id: colorid }).then(
                    () => {

                        res.status(200).send({ msg: 'color deleted', flag: 1 });

                    }
                ).catch(
                    () => {
                        res.send({ msg: 'color unable to deleted', flag: 0 });

                    }
                )

            }

        } catch (error) {
            console.log(error)
            res.status(500).send({ msg: 'Internal Server Error', flag: 0 });

        }


    },
    async status(req, res) {


        try {

            const colorid = req.params.id
            const colors = await colormodel.findById(colorid);
            if (colors) {

                await colormodel.updateOne({ _id: colorid }, { $set: { status: !colors.status } }).then(

                    () => {

                        res.send({ msg: "color status update successfully", flag: 1 });
                    }

                ).catch(

                    () => {

                        res.send({ msg: "unable to update color status", flag: 0 });

                    }

                )



            }

        } catch (error) {

            res.status(500).send({ msg: "Internal server error", flag: 0 });
        }


    },
    async update(req, res) {

        try {

            if (!req.body.name || !req.body.slug || !req.body.Hexcode) {
                return res.send({ msg: "please fill all the fields", flag: 0 });

            }
            const id = req.params.id
            await colormodel.findByIdAndUpdate(
                { _id: id },
                {
                    name: req.body.name,
                    slug: req.body.slug,
                    Hexcode: req.body.Hexcode

                }
            ).then(
                () => {

                    res.send({ msg: "color update successfully", flag: 1 });

                }

            ).catch(
                () => {

                    res.send({ msg: "unable to update color", flag: 0 });


                }

            )

        } catch (error) {
            console.log(error)
            res.status(500).send({ msg: "Internal server error", flag: 0 });


        }

    }




}


module.exports = colorcontroller;