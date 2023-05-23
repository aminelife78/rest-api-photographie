const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const handleUpload = require("../config/cloudinary");
const path = require("path");
const db = require("../db/db");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/multer");

// Upload single image
const categoriesUploadImage = uploadSingleImage("image");

// Image processing
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `categories-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 50 })
    .toFile(`uploads/categories/${filename}`);

  // Stocker l'image dans Cloudinary
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
  const cldRes = await handleUpload(dataURI);
  req.body.image = cldRes.url;
  console.log(cldRes);

  // Stocker l'url de l'image dans la base de données sans passer par Cloudinary
  // req.body.image = process.env.BASE_URL + "/categories/" + filename;

  next();
});

// Récupérer toutes les catégories de plats
const getCategories = asyncHandler(async (req, res) => {
  const categories = await db.query("SELECT * FROM categories");
  res.status(200).json({ data: categories });
});

// Récupérer une seule catégorie
const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await db.query("SELECT * FROM categories WHERE id=?", [id]);
  if (!category[0]) {
    return next(new apiError(`Pas de catégorie pour cet ID: ${id}`, 400));
  }
  res.status(200).json({ data: category });
});

// Créer une catégorie
const createCategory = asyncHandler(async (req, res) => {
  const { title, image } = req.body;
  console.log(title);
  await db.query("INSERT INTO categories (title,image_couvert) VALUES (?,?)", [
    title,
    image,
  ]);
  res.status(201).json({ message: "Catégorie bien ajoutée" });
});

// Modifier une catégorie
const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, image } = req.body;
  

  const category = await db.query("SELECT * FROM categories WHERE id=?", [id]);

  if (!category[0]) {
    return next(new apiError(`Pas de catégorie pour cet ID: ${id}`, 400));
  }

  await db.query("UPDATE categories SET title=?,image_couvert=? WHERE id=?", [
    title ,
    image,
    id,
  ]);

  res
    .status(200)
    .json({ message: `La catégorie avec l'ID ${id} a été modifiée avec succès` });
});




// suprimer une categorie
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM categories WHERE id=?", [id]);
  res.status(200).json({
    message: `la categorie avec id ${id} est bien supprimer`,
  });
});

// exporte crud les categories
module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  categoriesUploadImage,resizeImage
};
