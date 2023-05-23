const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const handleUpload = require("../config/cloudinary");
const path = require("path");
const db = require("../db/db");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/multer");

// Upload single image
const galerieUploadImage = uploadSingleImage("image");

// Image processing
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `galerie-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 50 })
    .toFile(`uploads/galerie/${filename}`);

  // Stocker l'image dans Cloudinary
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
  const cldRes = await handleUpload(dataURI);
  req.body.image = cldRes.url;
  console.log(cldRes);

  // Stocker l'url de l'image dans la base de données sans passer par Cloudinary
  // req.body.image = process.env.BASE_URL + "/galerie/" + filename;

  next();
});

// recuperer toutes les galerie
const getPhotos = asyncHandler(async (req, res) => {
  const {categorieId} = req.query
  if(categorieId){
    const photos = await db.query("SELECT * FROM galerie WHERE categorie_id=? ",[categorieId]);
    const countPhotos = photos.length;
    res.status(200).json({ result: countPhotos, data: photos });
  }else{
    const photos = await db.query("SELECT c.title AS title_categorie,c.id,g.id, g.title,g.categorie_id, g.image FROM galerie AS g JOIN categories AS c ON c.id = g.categorie_id");
    const countPhotos = photos.length;
    res.status(200).json({ result: countPhotos, data: photos });
  }
 
});

// recuperer une seul photo

const getPhoto = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const photos = await db.query("SELECT * FROM galerie WHERE id=?", [id]);
  if (!photos[0]) {
    return next(new apiError(`pas de photos pour ce id ${id}`, 400));
  }
  res.status(200).json({ data: photos });
});

// creer une image
const createPhoto = asyncHandler(async (req, res) => {
  const { title, image, categorie_id } = req.body;
  await db.query(
    "INSERT INTO galerie (title,image,categorie_id ) VALUES (?,?,?)",
    [title || null, image || null, categorie_id || null]
  );

  res.status(201).json({ message: "photo bien ajouter" });
});

// modifier une image
const updatePhoto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, image, categorie_id } = req.body;
  const plat = await db.query("SELECT * FROM galerie WHERE id=?", [id]);

  if (!plat[0]) {
    return next(new apiError(`pas de photo pour ce id ${id}`, 400));
  }
  await db.query(
    "UPDATE galerie SET title=?,image=?,categorie_id=? WHERE id=?",
    [title, image, categorie_id, id]
  );
  res.status(200).json({
    message: `la photo avec id ${id} est bien modifier`,
  });
});

// suprimer une image
const deletePhoto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM galerie WHERE id=?", [id]);
  res.status(200).json({
    message: `la photo avec id ${id} est bien supprimer`,
  });
});

// exporte crud galerie
module.exports = {
  getPhotos,
  getPhoto,
  createPhoto,
  updatePhoto,
  deletePhoto,
  galerieUploadImage,
  resizeImage,
};
