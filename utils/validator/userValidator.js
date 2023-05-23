const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getUserValidator = [
  check("id").isNumeric().withMessage("Invalid User id"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email utilisateur requis")
    .isEmail()
    .withMessage("adresse email invalide"),

  check("password")
    .notEmpty()
    .withMessage("mot de pas requis")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit être au moins de 6 caractères"),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isNumeric().withMessage("Invalide user id"),

  check("email")
    .notEmpty()
    .withMessage("Email utilisateur requis")
    .isEmail()
    .withMessage("adresse email invalide"),

  check("password")
    .notEmpty()
    .withMessage("mot de pas requis")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit être au moins de 6 caractères"),

  validatorMiddleware,
];
