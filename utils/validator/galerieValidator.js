const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getGalerieValidator = [
  check("id").isNumeric().withMessage("Invalid Galerie id"),
  validatorMiddleware,
];

exports.createGalerieValidator = [
  check("title")
    .not()
    .isNumeric()
    .withMessage("le titre de l'image doit etres une chaine de caractères")
    .not()
    .isEmpty()
    .withMessage("le titre de l'image est obligatoire")
    .isLength({ min: 3 })
    .withMessage("le titre de l'image trop court")
    .isLength({ max: 20 })
    .withMessage("le titre de l'image trop long"),
  check("image").notEmpty().withMessage("image  obligatoire"),

  validatorMiddleware,
];

exports.updateGalerieValidator = [
  check("id").isNumeric().withMessage("Invalid Galerie id"),
  check("title")
    .not()
    .isNumeric()
    .withMessage("le titre de l'image doit etres une chaine de caractères")
    .not()
    .isEmpty()
    .withMessage("le titre de l'image est obligatoire")
    .isLength({ min: 3 })
    .withMessage("le titre de l'image trop court")
    .isLength({ max: 20 })
    .withMessage("le titre de l'image trop long"),
  check("image").notEmpty().withMessage("image  obligatoire"),
  validatorMiddleware,
];

exports.deleteGalerieValidator = [
  check("id").isNumeric().withMessage("Invalid Galerie id"),
  validatorMiddleware,
];
