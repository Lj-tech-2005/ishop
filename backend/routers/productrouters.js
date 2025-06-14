const express = require("express");
const productrouter = express.Router();
const fileuploader = require("express-fileupload");


const productcontroller = require("../controllers/productcontrollers ");

productrouter.post("/create", fileuploader({ createParentPath: true }), productcontroller.create);
productrouter.get("/:id?", productcontroller.read);
productrouter.delete("/delete/:id", productcontroller.delete);
productrouter.patch("/status/:id", productcontroller.status);
productrouter.post("/multi-images/:id",fileuploader({ createParentPath: true }),productcontroller.multiimages);
productrouter.put("/update/:id",fileuploader({createParentPath:true}), productcontroller.update);
productrouter.post('/delete-image/:id', productcontroller.deleteSingleImage);
module.exports = productrouter;
