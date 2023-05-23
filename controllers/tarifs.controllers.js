const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const handleUpload = require("../config/cloudinary");
const path = require("path");
const db = require("../db/db");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/multer");

// Upload single image
const tarifsPrestationsUploadImage = uploadSingleImage("image_couvert");

// Image processing
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `tarifs-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 50 })
    .toFile(`uploads/tarifs/${filename}`);

  // Stocker l'image dans Cloudinary
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
  const cldRes = await handleUpload(dataURI);
  req.body.image = cldRes.url;

  // Stocker l'url de l'image dans la base de données sans passer par Cloudinary
  // req.body.image = process.env.BASE_URL + "/tarifs/" + filename;

  next();
});

// recuperer toutes les tarifs_prestations
const getTarifs = asyncHandler(async (req, res) => {
  const tarifs = await db.query("SELECT * FROM tarifs_prestations ");
  const countTarif = tarifs.length;
  res.status(200).json({ result: countTarif, data: tarifs });
});

// recuperer une seul Tarif

const getTarif = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Tarif = await db.query("SELECT * FROM tarifs_prestations WHERE id=?", [
    id,
  ]);
  if (!Tarif[0]) {
    return next(new apiError(`pas de Tarif pour ce id ${id}`, 400));
  }
  res.status(200).json({ data: Tarif });
});

// creer une image
const createTarif = asyncHandler(async (req, res) => {
  const { title, descreption, image, tarif } = req.body;
  await db.query(
    "INSERT INTO tarifs_prestations (title,descreption,image_couvert,tarif) VALUES (?,?,?,?)",
    [title, descreption, image, tarif]
  );

  res.status(201).json({ message: "Tarif bien ajouter" });
});

// modifier une image
const updateTarif = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, descreption, image, tarif} = req.body;
  const tarifs = await db.query("SELECT * FROM tarifs_prestations WHERE id=?", [
    id,
  ]);

  if (!tarifs[0]) {
    return next(new apiError(`pas de Tarif pour ce id ${id}`, 400));
  }
  await db.query(
    "UPDATE tarifs_prestations SET title=?,descreption=?,image_couvert=?,tarif=? WHERE id=?",
    [title, descreption, image, tarif, id]
  );
  res.status(200).json({
    message: `la Tarif avec id ${id} est bien modifier`,
  });
});

// suprimer une image
const deleteTarif = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM tarifs_prestations WHERE id=?", [id]);
  res.status(200).json({
    message: `la Tarif avec id ${id} est bien supprimer`,
  });
});

// exporte crud tarifs_prestations
module.exports = {
  getTarifs,
  getTarif,
  createTarif,
  updateTarif,
  deleteTarif,
  tarifsPrestationsUploadImage,
  resizeImage,
};
