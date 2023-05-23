const express = require("express");
const router = express.Router();

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  categoriesUploadImage,
  resizeImage,
} = require("../controllers/categories.controllers");
const { authorisation } = require("../controllers/auth.controllers");
// const {
//   getCategoryValidator,
//   createCategoryValidator,
//   updateCategoryValidator,
//   deleteCategoryValidator,
// } = require("../utils/validator/categoriesValidator.js");

router.get("/", getCategories);
router.post(
  "/",
  categoriesUploadImage,
  resizeImage,

  createCategory
);
router.get("/:id", getCategory);
router.put(
  "/:id",
  categoriesUploadImage,
  resizeImage,

  updateCategory
);
router.delete(
  "/:id",

  deleteCategory
);

module.exports = router;
