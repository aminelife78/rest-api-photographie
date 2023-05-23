const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.signupValidator = [
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
exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email utilisateur requis")
    .isEmail()
    .withMessage("adresse email invalide"),

  check("password")
    .notEmpty()
    .withMessage("mot de pas requis")
    .isLength({ min: 4 })
    .withMessage("Le mot de passe doit être au moins de 6 caractères"),

  validatorMiddleware,
];

exports.logout = [
  check("email")
    .notEmpty()
    .withMessage("Email utilisateur requis")
    .isEmail()
    .withMessage("adresse email invalide"),

  check("newPassword")
    .notEmpty()
    .withMessage("mot de pas requis")
    .isLength({ min: 4 })
    .withMessage("Le mot de passe doit être au moins de 6 caractères"),

  validatorMiddleware,
];
