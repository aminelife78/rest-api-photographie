const express = require("express");
const router = express.Router();

const {
  getPhotos,
  getPhoto,
  createPhoto,
  updatePhoto,
  deletePhoto,
  galerieUploadImage,
  resizeImage,
} = require("../controllers/galerie.controllers");
const { authorisation } = require("../controllers/auth.controllers");
// const {
//   getGalerieValidator,
//   createGalerieValidator,
//   updateGalerieValidator,
//   deleteGalerieValidator,
// } = require("../utils/validator/galerieValidator");

router.get("/", getPhotos);
router.post("/", galerieUploadImage, resizeImage, createPhoto);
router.get("/:id", getPhoto);
router.put(
  "/:id",
  galerieUploadImage,
  resizeImage,

  updatePhoto
);
router.delete("/:id", deletePhoto);

module.exports = router;
