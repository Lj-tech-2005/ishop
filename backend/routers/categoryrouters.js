const express = require("express");
const categoryrouter = express.Router();
const fileuploader = require("express-fileupload");

const categorycontroller = require("../controllers/categorycontrollers");
const authorization = require("../middleware/authorization");

categoryrouter.post("/create", fileuploader({ createParentPath: true }), categorycontroller.create);
categoryrouter.get("/:id?", categorycontroller.read);
categoryrouter.delete("/delete/:id",categorycontroller.delete);
categoryrouter.patch("/status/:id",authorization ,categorycontroller.status);
categoryrouter.put("/update/:id", fileuploader({ createParentPath: true }), categorycontroller.update);

module.exports = categoryrouter;
