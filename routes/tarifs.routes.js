const express = require("express");
const router = express.Router();

const {
  getTarifs,
  getTarif,
  createTarif,
  updateTarif,
  deleteTarif,
  tarifsPrestationsUploadImage,
  resizeImage,
} = require("../controllers/tarifs.controllers");
const { authorisation } = require("../controllers/auth.controllers");
// const {
//   getTarifValidator,
//   createTarifValidator,
//   updateTarifValidator,
//   deleteTarifValidator,
// } = require("../utils/validator/categoriesValidator.js");

router.get("/", getTarifs);
router.post(
  "/",
  tarifsPrestationsUploadImage,
  resizeImage,


  createTarif
);
router.get("/:id", getTarif);
router.put(
  "/:id",
  tarifsPrestationsUploadImage,
  resizeImage,

  updateTarif
);
router.delete(
  "/:id",

  deleteTarif
);

module.exports = router;
