const express = require("express");
const brandrouter = express.Router();
const fileuploader = require("express-fileupload");
const brandController = require("../controllers/brandController");
const authorization = require("../middleware/authorization");




brandrouter.post("/create", fileuploader({ createParentPath: true }), brandController.create);
brandrouter.get("/:id?",brandController.read);
brandrouter.patch("/status/:id",authorization ,brandController.status);
brandrouter.delete("/delete/:id",brandController.delete);
brandrouter.put("/update/:id", fileuploader({ createParentPath: true }), brandController.update);





module.exports = brandrouter;